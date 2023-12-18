// import { url } from '../../../js/url.js';

let currentPage = 1;
const pageSize = 3;
let allData = [];

const url = 'http://localhost:2000/SmoothTix_war_exploded';
function fetchAllData() {
    fetch(`${ url }/scheduleController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Error:', response.status);
            }
        })
        .then(data => {
            allData = data;
            document.getElementById("noOfPages").textContent = parseInt(allData.length / 3) + 1;
            updatePage(currentPage);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

fetchAllData();

function updatePage(page) {
    const list = document.getElementById("schedule_list");
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataToShow = allData.slice(startIndex, endIndex);

    list.innerHTML = "";
    displayDataAsScheduleTiles(dataToShow);
    updatePageNumber(currentPage);
}

function updatePageNumber(page) {
    document.getElementById("currentPageNumber").textContent = page;
}

const prevPageIcon = document.getElementById("prevPageIcon");
prevPageIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    changePage(currentPage - 1);
}, true);

const nextPageIcon = document.getElementById("nextPageIcon");
nextPageIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    changePage(currentPage + 1);
}, true);

function changePage(newPage) {
    const data = getDataForPage(newPage);

    if (currentPage !== newPage) {
        if (data.length > 0) {
            currentPage = Math.max(1, newPage);
            document.getElementById("nextPageIcon").style.opacity = "1";
            updatePage(currentPage);
        } else {
            console.log(`Next page is empty`);
            document.getElementById("nextPageIcon").style.opacity = "0.5";
        }
    }
}

function getDataForPage(page) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allData.slice(startIndex, endIndex);
}

function displayDataAsScheduleTiles(data) {
    const scheduleList = document.getElementById("schedule_list");

    const dataCount = data.length;
    if(dataCount === 0){
        const noData = document.createElement("tr");
        noData.innerHTML = `<td colspan="6">No schedules available</td>`;
        scheduleList.appendChild(noData);
        return;
    }

    if(dataCount >= 3){
        renderPageControl();
    }

    data.forEach(item => {
        const scheduleElement = document.createElement("div");
        scheduleElement.classList.add("schedule_tiles");
        scheduleElement.innerHTML = `
            <div class="schedule_element_row1">
                <div class="busRegNo">
                    <h1 id="busRegNo">${item.reg_no}</h1>
                </div>
                <div>
                    <p>From: <span id="start">${item.start}</span></p>
                    <p>To: <span id="destination">${item.destination}</span></p>
                </div>
                <div>
                    <p>Booking Closing Date: <span id="bookingClosingDate">${item.date}</span></p>
                    <p>Booking Closing Time: <span id="bookingClosingTime">${item.adjusted_time}</span></p>
                </div>
                <div class="seatAvailability">
                    <h2>Available <br> Seats</h2>
                    <h1 id="seatAvailability">${item.available_seats}</h1>
                </div>
            </div>
            <div class="schedule_element_row2">
                <div>
                    <h1>Departure Time: ${item.time}</h1>
                </div>
                <div class="price">
                    <h1>Rs. ${item.price_per_ride}</h1>
                </div>
                <div class="addBookingBtn">
                    <button class="button" onclick="openSeatAvailability('${item.schedule_id}')">Book Seat</button>
                </div>
            </div>
        `;

        scheduleList.appendChild(scheduleElement);
    });
}

function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}

function searchData() {
    const start = document.getElementById('dropdown_start').value;
    const destination = document.getElementById('dropdown_destination').value;
    const date = document.getElementById('datePicker').value;
    const startTime = document.getElementById('startTimePicker').value;
    const endTime = document.getElementById('endTimePicker').value;
    console.log("start: " + start + " destination: " + destination + " date: " + date + " startTime: " + startTime + " endTime: " + endTime);

    fetch(`${ url }/scheduleController?start=${start}&destination=${destination}&date=${date}&startTime=${startTime}&endTime=${endTime}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Error:', response.status);
            }
        })
        .then(data => {
            const scheduleList = document.getElementById("schedule_list");
            scheduleList.innerHTML = "";
            allData = data;
            updatePage(currentPage);
            // displayDataAsScheduleTiles(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function openSeatAvailability(scheduleId) {
    console.log(scheduleId);
    document.getElementById("seat_selection").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeSeatAvailability() {
    document.getElementById("seat_selection").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

const busContainer = document.getElementById('bus-container');
generateSeats(11, 5);

function generateSeats(numRows, numCols) {
    let seatNumber = 1;

    for (let row = 1; row <= numRows; row++) {
        for (let col = 1; col <= numCols; col++) {
            console.log(row + "  " + col)

            if (col === 3 && row !== numRows) {
                const emptySeat = document.createElement('div');
                emptySeat.className = 'empty-seat';
                busContainer.appendChild(emptySeat);
                console.log("test "+row + "  " + col)
            }
            else{
                const seat = document.createElement('div');
                seat.className = 'seat';
                seat.setAttribute('data-row', row);
                seat.setAttribute('data-col', col);
                seat.setAttribute('data-seat-number', seatNumber);
                seat.addEventListener('click', toggleSeat);
                busContainer.appendChild(seat);
                seatNumber++;
            }
        }
    }
}

function toggleSeat() {
    this.classList.toggle('selected');
}

function getSelectedSeats() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    return Array.from(selectedSeats).map(seat => ({
        row: parseInt(seat.getAttribute('data-row')),
        col: parseInt(seat.getAttribute('data-col')),
        seatNumber: parseInt(seat.getAttribute('data-seat-number'))
    }));
}

function bookSelectedSeats() {
    const selectedSeats = getSelectedSeats();
    console.log('Selected Seats:', selectedSeats);
}
