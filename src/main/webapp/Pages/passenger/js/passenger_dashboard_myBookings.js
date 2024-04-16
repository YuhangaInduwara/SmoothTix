const p_id = "P0001";
let currentPage = 1;
const pageSize = 3;
let allData = [];

document.addEventListener('DOMContentLoaded', function () {
   isAuthenticated().then(() => fetchAllData());
});

function refreshPage() {
    location.reload();
}

function fetchAllData(){
    fetch(`${ url }/bookingController?p_id=${p_id}`, {
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
            allData = data.sort((a, b) => {
                const dateComparison = a.date.localeCompare(b.date);
                if (dateComparison !== 0) {
                    return dateComparison;
                }

                return a.time.localeCompare(b.time);
            });
            console.log(allData);
            displayDataAsScheduleTiles_0(allData);
            displayDataAsScheduleTiles_1(allData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updatePage(page) {
    const list = document.getElementById("schedule_list");
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataToShow = allData.slice(startIndex, endIndex);

    list.innerHTML = "";
    console.log(startIndex + " " +dataToShow + " " + endIndex)
    displayDataAsScheduleTiles_0(dataToShow);
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

function displayDataAsScheduleTiles_0(data) {
    const scheduleList = document.getElementById("schedule_list");

    let counter = 0;

    const dataCount = data.length;
    if(dataCount === 0){
        const noData = document.createElement("tr");
        noData.innerHTML = `<td colspan="6">No schedules available</td>`;
        scheduleList.appendChild(noData);
        return;
    }

    data.forEach(item => {
        if(counter < 2 && item.status === 0){
            counter += 1;
            const scheduleElement = document.createElement("div");
            scheduleElement.classList.add("schedule_tiles");
            scheduleElement.innerHTML = `
            <div class="schedule_element_row1">
                <div class="busRegNo">
                    <h1 id="busRegNo">${item.booking_id}</h1>
                </div>
                <div>
                    <p>From: <span id="start">${item.start}</span></p>
                    <p>To: <span id="destination">${item.destination}</span></p>
                </div>
                <div>
                    <p>Date: <span id="bookingClosingDate">${item.date}</span></p>
                    <p>Time: <span id="bookingClosingTime">${item.time}</span></p>
                </div>
                <div class="seatAvailability">
                    <h2>Booked <br> Seat/Seats</h2>
                    <h1 id="seatAvailability">${item.seat_no}</h1>
                </div>
            </div>
            <div class="schedule_element_row2">
                <div class="routeNo">
                    <h1 id="busRegNo">${item.reg_no}</h1>
                </div>
                <div>
                    <h1>Status: ${item.status}</h1>
                </div>
                <div class="addBookingBtn">
                    <button class="button" onclick="openSeatSelection('${item.schedule_id}', '${item.start}', '${item.destination}', '${item.date}', '${item.time}', '${item.available_seats}', '${item.price_per_ride}')">Book Seat</button>
                </div>
            </div>
        `;

            scheduleList.appendChild(scheduleElement);
        }
        if(counter >= 2){
            document.getElementById("see_more_upcoming").style.display = "flex";
        }
        else{
            document.getElementById("see_more_upcoming").style.display = "none";
        }
    });
}

function displayDataAsScheduleTiles_1(data) {
    const scheduleList = document.getElementById("schedule_list_old");

    let counter = 0;

    const dataCount = data.length;
    if(dataCount === 0){
        const noData = document.createElement("tr");
        noData.innerHTML = `<td colspan="6">No schedules available</td>`;
        scheduleList.appendChild(noData);
        return;
    }

    data.forEach(item => {
        if(counter < 2 && item.status === 1){
            counter += 1;
            const scheduleElement = document.createElement("div");
            scheduleElement.classList.add("schedule_tiles");
            scheduleElement.innerHTML = `
                <div class="schedule_element_row1">
                    <div class="busRegNo">
                        <h1 id="busRegNo">${item.booking_id}</h1>
                    </div>
                    <div>
                        <p>From: <span id="start">${item.start}</span></p>
                        <p>To: <span id="destination">${item.destination}</span></p>
                    </div>
                    <div>
                        <p>Date: <span id="bookingClosingDate">${item.date}</span></p>
                        <p>Time: <span id="bookingClosingTime">${item.time}</span></p>
                    </div>
                    <div class="seatAvailability">
                        <h2>Booked <br> Seat/Seats</h2>
                        <h1 id="seatAvailability">${item.seat_no}</h1>
                    </div>
                </div>
                <div class="schedule_element_row2">
                    <div class="routeNo">
                        <h1 id="busRegNo">${item.reg_no}</h1>
                    </div>
                    <div>
                        <h1>Status: ${item.status}</h1>
                    </div>
                    <div class="addBookingBtn">
                        <button class="button" onclick="openSeatSelection('${item.schedule_id}', '${item.start}', '${item.destination}', '${item.date}', '${item.time}', '${item.available_seats}', '${item.price_per_ride}')">Book Seat</button>
                    </div>
                </div>
            `;

            scheduleList.appendChild(scheduleElement);
        }
        if(counter >= 2){
            document.getElementById("see_more_previous").style.display = "flex";
        }
        else{
            document.getElementById("see_more_previous").style.display = "none";
        }
    });
}

function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}
