let currentPage = 1;
const pageSize = 3;
let smooth_points;
let allData = [];
let price_per_ride = 0;
const seatsPerRow = 5;
const rows = 10;
let selectedSeats = [];
let totalPrice = 0;
let seatAvailabilityArray = [];
let booking_schedule_id = "";
const errorMessages = {};
let standData = [];
let isPayByPoints = false;

// Function to capitalize the first letter of stand
function capitalizeStartAndDestination(data) {
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    if (data) {
        data.forEach(row => {
            if (row.start) {
                row.start = capitalizeFirstLetter(row.start);
            }

            if (row.destination) {
                row.destination = capitalizeFirstLetter(row.destination);
            }

            if (row.stand_list) {
                row.stand_list = capitalizeFirstLetter(row.stand_list);
            }
        });
    }

    return data;
}

setSearchStands();

// function to refresh the page
function refreshPage() {
    location.reload();
}

// get the stand data for display on start and end dropdowns
function setSearchStands() {
    fetch(`${url}/routeController?request_data=stand_list`, {
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
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(data => {

            if (data) {
                standData = capitalizeStartAndDestination(data);

                let dropdown_start = document.getElementById("dropdown_start");
                let dropdown_destination = document.getElementById("dropdown_destination");

                for (let i = 0; i < standData.length; i++) {
                    let option_start = document.createElement("option");
                    option_start.text = standData[i].stand_list;
                    option_start.value = standData[i].stand_list;
                    dropdown_start.add(option_start);

                    let option_destination = document.createElement("option");
                    option_destination.text = standData[i].stand_list;
                    option_destination.value = standData[i].stand_list;
                    dropdown_destination.add(option_destination);
                }
            } else {
                console.error('Error: Invalid or missing data.stand property');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// fetch all data
function fetchAllData() {
    if(!session_user_name === ''){
        document.getElementById("userName").textContent = session_user_name;
    }
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
            let tempData = capitalizeStartAndDestination(data);
            allData = tempData.filter(booking => booking.status === 0);
            updatePage(currentPage);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

fetchAllData();

 // function for change the page data and shows 3 data tiles
function updatePage(page) {
    const list = document.getElementById("schedule_list");
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataToShow = allData.slice(startIndex, endIndex);

    list.innerHTML = "";
    displayDataAsScheduleTiles(dataToShow);
    updatePageNumber(currentPage);
}

// change the page number with above function
function updatePageNumber(page) {
    document.getElementById("currentPageNumber").textContent = page;
}

// event listener for go back for previous page
const prevPageIcon = document.getElementById("prevPageIcon");
prevPageIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    changePage(currentPage - 1);
}, true);

// event listener for go for next page
const nextPageIcon = document.getElementById("nextPageIcon");
nextPageIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    changePage(currentPage + 1);
}, true);


// above 2 event listeners are dealing with this function
function changePage(newPage) {
    const data = getDataForPage(newPage);

    if (currentPage !== newPage) {
        if (data.length > 0) {
            currentPage = Math.max(1, newPage);
            document.getElementById("nextPageIcon").style.opacity = "1";
            updatePage(currentPage);
        } else {
            document.getElementById("nextPageIcon").style.opacity = "0.5";
        }
    }
}

// this calls with changePage(newPage) function
function getDataForPage(page) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allData.slice(startIndex, endIndex);
}

// display data in 3 tiles. this calls with updatePage(page) function
function displayDataAsScheduleTiles(data) {
    const scheduleList = document.getElementById("schedule_list");

    const dataCount = data.length;
    if(dataCount === 0){
        const noData = document.createElement("tr");
        noData.innerHTML = `<td colspan="6">No schedules available</td>`;
        scheduleList.appendChild(noData);
        return;
    }

    if(dataCount > 3){
        renderPageControl();
    }

    data.forEach(item => {
        if(item.status === 0){
            const scheduleElement = document.createElement("div");
            scheduleElement.classList.add("schedule_tiles");

            // create a html element
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
                <div class="routeNo">
                    <h1 id="busRegNo">${item.route_no}</h1>
                </div>
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
        }
    });
}

// display page number
function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}

// search data function
function searchData() {
    const start = document.getElementById('dropdown_start').value.toLowerCase();
    const destination = document.getElementById('dropdown_destination').value.toLowerCase();
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
            allData = capitalizeStartAndDestination(data);
            updatePage(currentPage);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// open alert everything control from here
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

// this also calls with open alert when press ok button
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

// when pressed add booking button it directs here
function openSeatSelection(schedule_id, start, destination, date, time, available_seats, price) {
    isAuthenticated();
    if(parseInt(available_seats, 10) === 0){
        openAlert( "Sorry! All Seats Are Booked.", "alertFail");
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

// when pressed close booking button it directs here
function closeSeatSelection() {
    price_per_ride = 0;
    selectedSeats = [];
    totalPrice = 0;
    updateBookingDetails()
    document.getElementById("seat_selection").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    resetPaymentDetails();
}

// update booking price in relevant tile
function updateBookingDetails() {
    const selectedSeatsElement = document.getElementById('selected-seats');
    const totalPriceElement = document.getElementById('total-price');
    selectedSeatsElement.textContent = selectedSeats.length === 0 ? 'None' : selectedSeats.join(', ');
    totalPriceElement.textContent = totalPrice;
}

// this calls when selecting/deselecting seats
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

// firstly calls with openSeatSelection function
function updateSeatMap() {
    const seatMapElement = document.getElementById('seat-map');
    seatMapElement.innerHTML = '';
    for (let rowNumber = 1; rowNumber <= rows; rowNumber++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        for (let seatIndex = 1; seatIndex <= seatsPerRow; seatIndex++) {
            const seatElement = document.createElement('div');
            seatElement.classList.add('seat');

            if(seatIndex === 3 && rowNumber !== 10){
                const emptySeatElement = document.createElement('div');
                emptySeatElement.classList.add('seat');
                emptySeatElement.style.visibility = 'hidden';
                rowElement.appendChild(emptySeatElement);
            }

            const seatNumber = (rowNumber - 1) * seatsPerRow + seatIndex;
            const isAvailable = seatAvailabilityArray[seatNumber - 1];

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

// when press pay button it calls this
function payment() {
    if(totalPrice <= 0){
        openAlert( "Please Select At Least One Seat!", "alertFail");
    }
    else{
        getSmoothPoints();
        document.getElementById('selected-seats-payment').textContent = selectedSeats.length === 0 ? 'None' : selectedSeats.join(', ');
        document.getElementById('total-price-payment').textContent = totalPrice;
        document.getElementById("paymentContainer").style.display = "flex";
        document.getElementById("overlay").style.display = "block";
    }
}

// after payment() function done, it calls this function
function getSmoothPoints(){
    fetch(`${url}/smoothPointController?p_id=${session_p_id}`, {
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
            smooth_points = data.smooth_points;
            document.getElementById('smooth_points').textContent = smooth_points;
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

// close button of seat map div
function closePayment() {
    document.getElementById("paymentContainer").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// after completing card details or pressed pay using Smooth Points this calls
function pay() {
    closeConfirmAlert();
    if(isPayByPoints === true){
        reduceSmoothPoints(totalPrice);
    }
    document.getElementById('loading-spinner').style.display = 'block';
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

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
                openAlert("Your Booking Was Unsuccessful!" + err, "alertFail");
            }
        })
        .then(parsedResponse => {
            const payment_id = parsedResponse.payment_id;
            addBooking(booking_schedule_id, session_p_id, payment_id, selectedSeats);
        })
}

// pay with smooth points directs here
function payByPoints(){
    if(smooth_points*100 >= totalPrice){
        openConfirmAlert('points');
    }
    else{
        openAlert("Not Enough SmoothPoints!", "alertFail");
    }
}

// after payment part completed those functions calls this and inside it it sends the mail
function addBooking(schedule_id, p_id, payment_id, selectedSeats) {
    const bookingDetails = {
        schedule_id: schedule_id,
        p_id: p_id,
        payment_id: payment_id,
        selectedSeats: selectedSeats,
        status: false,
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
                document.getElementById('loading-spinner').style.display = 'none';
                openAlert("Your Booking Was Unsuccessful!", "alertFail");
            }
        })
        .then(parsedResponse => {
            const booking_id = parsedResponse.booking_id;
            const email = parsedResponse.email;
            const bookedSeats = selectedSeats.join(', ');

            fetch(`${ url }/mailController?email=${email}&schedule_id=${schedule_id}&p_id=${p_id}&bookingId=${booking_id}&price=${totalPrice}&bookedSeats=${bookedSeats}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Successful")
                        document.getElementById('loading-spinner').style.display = 'none';
                        openAlert("Your Booking Was Successful!", "alertSuccess");
                        closeConfirmAlert();
                        closePayment();
                        closeSeatSelection();
                        resetPaymentDetails();
                        isPayByPoints = false;
                    } else {
                        deleteBooking(booking_id);
                        deletePayment(payment_id);
                        closeConfirmAlert();
                        document.getElementById('loading-spinner').style.display = 'none';
                        openAlert("Your Booking Was Unsuccessful!", "alertFail");
                    }
                })
        })
}

// delete booking icon's function or unsuccessful add bookings. this is at my bookings
function deleteBooking(booking_id){
    fetch(`${ url }/bookingController?booking_id=${booking_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {

            } else {
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// delete booking icon's function or unsuccessful add bookings. this is at my bookings
function deletePayment(payment_id){
    fetch(`${ url }/bookingController?payment_id=${payment_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {

            } else {
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// check the card payment or point payment
function openConfirmAlert(action){
    let isValid
    if(action === 'card'){
        isValid = validatePayment();
    }
    else if(action === 'points'){
        isPayByPoints = true;
        const agreementCheckbox = document.getElementById("declaration");
        if (!agreementCheckbox.checked) {
            showAlert(agreementCheckbox, "Please agree to the terms and conditions.");
            isValid = false;
        }
        else{
            isValid = true;
        }
    }

    if (isValid) {
        document.getElementById('confirmationMsg').textContent = "Are You Sure To Pay?";
        document.getElementById("confirmationAlert").style.display = "block";
        document.getElementById("overlay").style.display = "block";
    }
}

// close alert message
function closeConfirmAlert(){
    document.getElementById("confirmationAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// show alert box at payment gateway
function showAlert(inputElement, message) {
    if (!errorMessages[inputElement.id]) {
        const alertBox = document.createElement("div");
        alertBox.className = "alert";
        alertBox.innerHTML = message;

        inputElement.parentNode.insertBefore(alertBox, inputElement.nextSibling);

        errorMessages[inputElement.id] = true;

        setTimeout(function () {
            alertBox.parentNode.removeChild(alertBox);
            errorMessages[inputElement.id] = false;
        }, 3000);
    }
}

// event listener for select card type visa
document.querySelectorAll('.cardOptionVisa').forEach(function (label) {
    label.addEventListener('click', function () {
        document.getElementById("visaCard").checked = true;
        document.getElementById("masterCard").checked = false;
    });
});

// event listener for select card type visa
document.querySelectorAll('.cardOptionMaster').forEach(function (label) {
    label.addEventListener('click', function () {
        document.getElementById("visaCard").checked = false;
        document.getElementById("masterCard").checked = true;
    });
});

// openConfirmAlert(action) function calls this. check validity of card details
function validatePayment() {
    const visaCardChecked = document.getElementById("visaCard").checked;
    const masterCardChecked = document.getElementById("masterCard").checked;

    if (!visaCardChecked && !masterCardChecked) {
        showAlert(document.querySelector(".cardOptions"), "Please select a card type.");
        return false;
    }

    const cardNumber = document.getElementById("cardNo").value;
    if (!cardNumber || cardNumber.length !== 16 || isNaN(cardNumber)) {
        showAlert(document.querySelector("label[for='cardNo']"), "Please enter a valid 16-digit card number.");
        return false;
    }

    const expMonth = document.getElementById("expMonth").value;
    if (!expMonth || expMonth.length !== 2 || isNaN(expMonth) || parseInt(expMonth) < 1 || parseInt(expMonth) > 12) {
        showAlert(document.querySelector("label[for='expMonth']"), "Please enter a valid 2-digit expiration month.");
        return false;
    }

    const expYear = document.getElementById("expYear").value;
    if (!expYear || expYear.length !== 2 || isNaN(expYear) || parseInt(expYear) + 2000 < new Date().getFullYear()) {
        showAlert(document.querySelector("label[for='expYear']"), "Please enter a valid 2-digit expiration year.");
        return false;
    }

    const cvn = document.getElementById("cvn").value;
    if (!cvn || cvn.length !== 3 || isNaN(cvn)) {
        showAlert(document.querySelector("label[for='cvn']"), "Please enter a valid 3-digit CVN.");
        return false;
    }

    const agreementCheckbox = document.getElementById("declaration");
    if (!agreementCheckbox.checked) {
        showAlert(agreementCheckbox, "Please agree to the terms and conditions.");
        return false;
    }

    const cardType = visaCardChecked ? "Visa" : "MasterCard";
    const paymentData = {
            cardType: cardType,
            cardNumber: cardNumber,
            expMonth: expMonth,
            expYear: expYear,
            cvn: cvn,
            agreement: agreementCheckbox.checked
        };

    return true;
}

// when close bookings or error occurred
function resetPaymentDetails() {
    document.getElementById("visaCard").checked = false;
    document.getElementById("masterCard").checked = false;
    document.getElementById("cardNo").value = "";
    document.getElementById("expMonth").value = "";
    document.getElementById("expYear").value = "";
    document.getElementById("cvn").value = "";
    document.getElementById("declaration").checked = false;
}


// this calls from pay() function
function reduceSmoothPoints(amount){
    const updatedData = {
        p_id: session_p_id,
        amount: amount,
    };

    const jsonData = JSON.stringify(updatedData);

    fetch(`${ url }/smoothPointController?action=subtract`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                console.log('Update Successful');
            } else if (response.status === 401) {
                console.log('Update Unsuccessful');
            } else {
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
