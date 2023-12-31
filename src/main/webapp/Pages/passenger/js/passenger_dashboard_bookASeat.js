let currentPage = 1;
const pageSize = 3;
let allData = [];
let price_per_ride = 0;
const seatsPerRow = 5;
const rows = 10;
const totalSeats = rows * seatsPerRow;
const availableSeats = Array.from({ length: totalSeats }, (_, index) => index + 1);
let selectedSeats = [];
let totalPrice = 0;
let seatAvailabilityArray = [];

let booking_p_id = "P0030";
let booking_schedule_id = "";

// if(isAuthenticated()){
//     const jwtToken = localStorage.getItem('jwtToken');
//     if(jwtToken){
//         const decodedToken = decodeJWT(jwtToken);
//         const p_id = decodedToken.p_id;
//         booking_p_id = decodedToken.p_id;
//     }
//     else{
//         window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/login/html/login.html';
//     }
// }
// else{
//     window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/login/html/login.html';
// }

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
                    <button class="button" onclick="openSeatSelection('${item.schedule_id}', '${item.start}', '${item.destination}', '${item.date}', '${item.time}', '${item.available_seats}', '${item.price_per_ride}')">Book Seat</button>
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

function openAlert(text, alertBody){
    if(alertBody === "alertFail"){
        document.getElementById("alertMsg").textContent = text;
    }
    else{
        document.getElementById("alertMsgSuccess").textContent = text;
    }
    document.getElementById(alertBody).style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlert(){
    const alertSuccess = document.getElementById("alertSuccess");
    const alertFail = document.getElementById("alertFail");
    if(alertSuccess.style.display === "block" && alertFail.style.display === "block"){
        alertSuccess.style.display = "none";
        alertFail.style.display = "none";
    }
    else if(alertSuccess.style.display === "block"){
        alertSuccess.style.display = "none";
    }
    else if(alertFail.style.display === "block"){
        alertFail.style.display = "none";
    }
    document.getElementById("overlay").style.display = "none";
}

function openSeatSelection(schedule_id, start, destination, date, time, available_seats, price) {
    console.log(available_seats)
    if(parseInt(available_seats, 10) === 0){
        openAlert( "Sorry! All seats are booked.", "alertFail");
    }
    else{
        document.getElementById("seat_selection").style.display = "flex";
        document.getElementById("overlay").style.display = "block";
        document.getElementById("seat_selection_route").textContent = start + " - " + destination;
        document.getElementById("seat_selection_date").textContent = date;
        document.getElementById("seat_selection_time").textContent = time;
        document.getElementById("seat_selection_seat_count").textContent = available_seats;
        document.getElementById("seat_selection_price").textContent = price;
        price_per_ride = parseInt(price, 10);
        booking_schedule_id = schedule_id;

        fetch(`${ url }/seatAvailabilityController?schedule_id=${schedule_id}`,{
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response =>{
                if(response.ok){
                    return response.json();
                }
                else{
                    console.error("Error" + err);
                }
            })
            .then(parsedResponse => {
                seatAvailabilityArray = parsedResponse.map(seatInfo => seatInfo.availability);
                updateSeatMap();
            })
    }
}

function closeSeatSelection() {
    document.getElementById("seat_selection").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    price_per_ride = 0;
    selectedSeats = [];
    totalPrice = 0;
}

function updateBookingDetails() {
    const selectedSeatsElement = document.getElementById('selected-seats');
    const totalPriceElement = document.getElementById('total-price');

    selectedSeatsElement.textContent = selectedSeats.length === 0 ? 'None' : selectedSeats.join(', ');
    totalPriceElement.textContent = totalPrice;
}

function toggleSeat(seatNumber) {
    const seatIndex = selectedSeats.indexOf(seatNumber);

    if (seatIndex === -1) {
        selectedSeats.push(seatNumber);
        totalPrice += price_per_ride;
    } else {
        selectedSeats.splice(seatIndex, 1);
        totalPrice -= price_per_ride;
    }

    updateBookingDetails();
    updateSeatMap();
}

function updateSeatMap() {
    const seatMapElement = document.getElementById('seat-map');
    seatMapElement.innerHTML = '';
    for (let rowNumber = 1; rowNumber <= rows; rowNumber++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        for (let seatIndex = 1; seatIndex <= seatsPerRow; seatIndex++) {
            const seatNumber = (rowNumber - 1) * seatsPerRow + seatIndex;
            const isAvailable = seatAvailabilityArray[seatNumber - 1];
            const seatElement = document.createElement('div');
            seatElement.classList.add('seat');

            if (isAvailable === '1') {
                seatElement.textContent = seatNumber;
                seatElement.addEventListener('click', () => toggleSeat(seatNumber));
                if (selectedSeats.includes(seatNumber)) {
                    seatElement.classList.add('selected');
                }
            } else if (isAvailable === '0') {
                seatElement.style.backgroundColor = 'red';
                seatElement.style.color = 'white';
                seatElement.textContent = seatNumber;
                seatElement.classList.add('unavailable');
                seatElement.setAttribute('disabled', 'true');
            } else{
                seatElement.style.backgroundColor = 'red';
                seatElement.style.color = 'white';
                seatElement.textContent = 'X';
                seatElement.classList.add('unavailable');
                seatElement.setAttribute('disabled', 'true');
            }
            rowElement.appendChild(seatElement);
        }
        seatMapElement.appendChild(rowElement);
    }
}

function payment() {
    if(totalPrice <= 0){
        openAlert( "Please,select at least one seat!", "alertFail");
    }
    else{
        document.getElementById('selected-seats-payment').textContent = selectedSeats.length === 0 ? 'None' : selectedSeats.join(', ');
        document.getElementById('total-price-payment').textContent = totalPrice;
        document.getElementById("paymentContainer").style.display = "flex";
        document.getElementById("overlay").style.display = "block";
    }
}
function closePayment() {
    document.getElementById("paymentContainer").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function pay() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    console.log("Current Date and Time:", formattedDateTime);
    const paymentDetails = {
        date_time: formattedDateTime,
        amount:totalPrice,
    };

    const jsonData = JSON.stringify(paymentDetails);

    fetch(`${ url }/paymentController`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response =>{
            if(response.ok){
                return response.json();
            }
            else{
                console.error("Error" + err);
            }
        })
        .then(parsedResponse => {
            console.log(parsedResponse);
            const payment_id = parsedResponse.payment_id;
            // const seat_no = selectedSeats;
            addBooking(booking_schedule_id, booking_p_id, payment_id, selectedSeats);
        })
}

function addBooking(schedule_id, p_id, payment_id, selectedSeats) {
    const bookingDetails = {
        schedule_id: schedule_id,
        p_id: p_id,
        payment_id: payment_id,
        selectedSeats: selectedSeats,
    };

    const jsonData = JSON.stringify(bookingDetails);

    fetch(`${ url }/bookingController`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response =>{
            if(response.ok){
                return response.json();
            }
            else{
                closeConfirmAlert();
                openAlert("Your booking was unsuccessful!", "alertFail");
                console.error("Error" + err);
            }
        })
        .then(parsedResponse => {
            const booking_id = parsedResponse.booking_id;
            const email = parsedResponse.email;
            const bookedSeats = selectedSeats.join(', ');

            console.log("booking_id: " + booking_id + "p_id: " + p_id + "email: " + email + "seats: " + bookedSeats)
            fetch(`${ url }/mailController?email=${email}&schedule_id=${schedule_id}&p_id=${p_id}&bookingId=${booking_id}&price=${totalPrice}&bookedSeats=${bookedSeats}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Successful")
                        closeConfirmAlert();
                        closePayment();
                        closeSeatSelection();
                        openAlert("Your booking was successful!", "alertSuccess");
                    } else {
                        console.log("Unsuccessful: " + response)
                        closeConfirmAlert();
                        openAlert("Your booking was unsuccessful!", "alertFail");
                    }
                })
        })
}

function openConfirmAlert(){
    document.getElementById('confirmationMsg').textContent = "Are you sure to pay?";
    document.getElementById("confirmationAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeConfirmAlert(){
    document.getElementById("confirmationAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}