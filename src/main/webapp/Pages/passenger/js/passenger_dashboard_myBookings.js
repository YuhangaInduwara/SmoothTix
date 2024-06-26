let currentPage = 1;
const pageSize = 3;
let allData = [];
let booking_id_review;
let booking_id_delete;
let seat_delete = [];
let all_seats = [];
const errorMessages = {};

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

// session management
document.addEventListener('DOMContentLoaded', function () {
   isAuthenticated().then(() => fetchAllData());
});

setSearchStands()

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

// function to refresh the page
function refreshPage() {
    location.reload();
}

// get passenger's data from the database
function fetchAllData(){
    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById("userName").textContent = session_user_name;  // set dashboard user name
    fetch(`${ url }/bookingController?p_id=${session_p_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                document.getElementById('loading-spinner').style.display = 'none';
                return response.json();
            } else {
                console.error('Error:', response.status);
            }
        })
        .then(data => {
            let tempData = capitalizeStartAndDestination(data)
            allData = tempData.sort((a, b) => {
                const dateComparison = a.date.localeCompare(b.date);
                if (dateComparison !== 0) {
                    return dateComparison;
                }

                return a.time.localeCompare(b.time);
            });

            displayDataAsScheduleTiles_0(allData);
            displayDataAsScheduleTiles_1(allData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// upcoming bookings. these bookings can be deleted
function displayDataAsScheduleTiles_0(data) {
    const scheduleList = document.getElementById("schedule_list");
    scheduleList.innerHTML = "";
    let counter = 0;

    const dataCount = data.length;
    if(dataCount === 0){
        const noData = document.createElement("tr");
        noData.innerHTML = `<td colspan="6">No booking available</td>`;
        scheduleList.appendChild(noData);
        return;
    }

    let buttonsHTML = '';
    data.forEach(item => {
        const now = new Date();
        const itemDateTime = new Date(item.date + 'T' + item.time);
        const timeDiff = itemDateTime - now;
        const diffInHours = timeDiff / (1000 * 60 * 60);

        if (counter < 2 && item.status === 0) {
            if (item.schedule_status === 0 && diffInHours > 2) {
                buttonsHTML = `
                <span class="icon-container" style="margin-left: 1px;">
                    <i onclick="deleteBooking_passenger('${item.booking_id}', '${item.seat_no}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
                </span>
            `;
            } else if (item.schedule_status === 1 || item.schedule_status === 2) {
                buttonsHTML = `
            `;
            }
            const scheduleElement = document.createElement("div");
            scheduleElement.classList.add("schedule_tiles");
            scheduleElement.innerHTML = `
            <div class="schedule_element_row1">
                <div class="busRegNo">
                    <h1 id="busRegNo">${item.booking_id}</h1>
                </div>
                <div>
                    <h3><span id="start">${item.start}-${item.destination}</span></h3>
                    <p>Status: Pending</p>
                </div>
                <div class="seatAvailability">
                    <h1 id="seatAvailability">${item.seat_no}</h1>
                </div>
            </div>
            <div class="schedule_element_row2">
                <div class="routeNo">
                    <h1 id="busRegNo">${item.reg_no}</h1>
                </div>
                <div>
                    <h1><span id="destination">${item.date} ${item.time}</span></h1>
                </div>
                <div class="addBookingBtn">
                     ${buttonsHTML}                   
                </div>              
            </div>
        `;

            scheduleList.appendChild(scheduleElement);
            counter += 1;
        }
        if(counter >= 2){
            document.getElementById("see_more_upcoming").style.display = "flex";
        }
        else{
            document.getElementById("see_more_upcoming").style.display = "none";
        }
    });
}

// previous bookings. these bookings can be reviewed and see location if on going
function displayDataAsScheduleTiles_1(data) {
    const scheduleList = document.getElementById("schedule_list_old");
    scheduleList.innerHTML = "";

    let counter = 0;

    const dataCount = data.length;
    if(dataCount === 0){
        const noData = document.createElement("tr");
        noData.innerHTML = `<td colspan="6">No booking available</td>`;
        scheduleList.appendChild(noData);
        return;
    }

    let buttonsHTML = '';
    data.forEach(item => {
        if(counter < 2 && item.status === 1){
            if (item.schedule_status === 1) {
                buttonsHTML = `
                <span class="icon-container">
                    <i onclick="ViewLocation('${item.schedule_id}')"><img src="../../../images/vector_icons/location_icon.png" alt="location" class="action_icon"></i>
                </span>
                <span class="icon-container" style="margin-left: 1px;">
                    <i onclick="openReview('${item.schedule_id}', '${item.booking_id}')"><img src="../../../images/vector_icons/review_icon.png" alt="review" class="action_icon"></i>
                </span>  
            `;
            }
            else if (item.schedule_status === 2) {
                buttonsHTML = `
                <span class="icon-container" style="margin-left: 1px;">
                    <i onclick="openReview('${item.schedule_id}', '${item.booking_id}')"><img src="../../../images/vector_icons/review_icon.png" alt="review" class="action_icon"></i>
                </span>  
            `;
            }
            else if (item.schedule_status === 0) {
                buttonsHTML = `
            `;
            }
            const scheduleElement = document.createElement("div");
            scheduleElement.classList.add("schedule_tiles");
            scheduleElement.innerHTML = `
                <div class="schedule_element_row1">
                    <div class="busRegNo">
                        <h1 id="busRegNo">${item.booking_id}</h1>
                    </div>
                    <div>
                        <h3><span id="start">${item.start}-${item.destination}</span></h3>
                        <p>Status: Checked In</p>
                    </div>
                    <div class="seatAvailability">
                        <h1 id="seatAvailability">${item.seat_no}</h1>
                    </div>
                </div>
                <div class="schedule_element_row2">
                    <div class="routeNo">
                        <h1 id="busRegNo">${item.reg_no}</h1>
                    </div>
                    <div>
                        <h1><span id="destination">${item.date} ${item.time}</span></h1>
                    </div>
                    <div class="addBookingBtn">
                        ${buttonsHTML}                  
                    </div>
                </div>
            `;

            scheduleList.appendChild(scheduleElement);
            counter += 1;
        }
        if(counter >= 2){
            document.getElementById("see_more_previous").style.display = "flex";
        }
        else{
            document.getElementById("see_more_previous").style.display = "none";
        }
    });
}

// track the location
var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;
let fetchInterval;

// function to track location and update it
function fetchAndUpdateLocation(schedule_id) {
    fetch(`${ url }/locationController?schedule_id=${schedule_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].latitude;
                const lng = data[0].longitude;
                updateMarkerPosition(lat, lng);
            }
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}

// function to update location marker
function updateMarkerPosition(lat, lng) {
    if (!marker) {
        marker = L.marker([lat, lng]).addTo(map);

        const initialZoomLevel = 14;
        map.setView([lat, lng], initialZoomLevel);
    } else {
        marker.setLatLng([lat, lng]);
    }

    const currentZoomLevel = map.getZoom();

    map.setView([lat, lng], currentZoomLevel);
}

// fetch location for every 1 second
function startFetchingLocation(schedule_id) {
    fetchAndUpdateLocation(schedule_id);
    fetchInterval = setInterval(() => {
        fetchAndUpdateLocation(schedule_id);
    }, 1000);
}

// function to stop getting location
function stopFetchingLocation() {
    clearInterval(fetchInterval);
}

// function to view location with relevant schedule id
function ViewLocation(schedule_id){
    document.getElementById("locationView").style.display = "flex";
    document.getElementById("overlay").style.display = "block";

    startFetchingLocation(schedule_id)
    resizeMap();
}

// function to resize the map and display
let previousMapSize = { width: 0, height: 0 };
function resizeMap() {
    const currentMapSize = {
        width: document.getElementById('map').clientWidth,
        height: document.getElementById('map').clientHeight
    };

    if (
        currentMapSize.width !== previousMapSize.width ||
        currentMapSize.height !== previousMapSize.height
    ) {
        previousMapSize = currentMapSize;
        map.invalidateSize();
    }
}

// function to stop displaying location
function RemoveLocation(){
    stopFetchingLocation()
    document.getElementById("locationView").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// add a review
function openReview(schedule_id, booking_id){
    booking_id_review = booking_id;
    document.getElementById("review_container").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// close the review
function closeReview(){
    booking_id_review = '';
    document.getElementById("review_container").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// event listener for review submit button
document.getElementById("review_form").addEventListener("submit", function(event) {
    event.preventDefault();

    const driverRating = parseInt(document.getElementById("driverRating").value);
    const busRating = parseInt(document.getElementById("busRating").value);
    const conductorRating = parseInt(document.getElementById("conductorRating").value);
    const comments = document.getElementById("comments").value;

    if (!driverRating || !busRating || !conductorRating || !comments) {
        alert("Please fill in all required fields.");
        return;
    }

    const pointDetails = {
        driverRating: driverRating,
        busRating: busRating,
        conductorRating: conductorRating,
        booking_id: booking_id_review
    };

    const jsonData = JSON.stringify(pointDetails);
    fetch(`${url}/pointController`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                openAlert( "You Can Only Review A Journey Once!", "alertFail");
                console.log("Error:", response.status);
            }
        })
        .then(data => {
            const pointID = data.point_id;
            addReview(pointID, booking_id_review, comments);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// call from above function
function addReview(point_id, booking_id, comments){

    const reviewDetails = {
        point_id : point_id,
        booking_id : booking_id,
        comments : comments
    }

    const jsonData = JSON.stringify(reviewDetails);

    fetch(`${ url }/reviewController`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response =>{
            if(response.ok){
                openAlert( "Successfully Reviewed", "alertSuccess");
            }
            else{
                openAlert( "Review Unsuccessful", "alertFail");
            }
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
    refreshPage();
}

// delete a booking
function deleteBooking_passenger(booking_id, seat_no){
    booking_id_delete = booking_id;
    openDeleteConfirmation(seat_no);
}

// function to open confirmation box for deletion
function openDeleteConfirmation(seat_no) {
    let seats = seat_no.split(',');
    all_seats = seats;
    let seatToBeDeletedDiv = document.getElementById("seatToBeDeleted");
    seatToBeDeletedDiv.innerHTML = '';

    seats.forEach(function(seat) {
        let seatTile = document.createElement("div");
        seatTile.classList.add("seatTile");
        seatTile.textContent = seat;

        seatTile.addEventListener("click", function() {
            this.classList.toggle("selected");

            if (this.classList.contains("selected")) {
                seat_delete.push(seat);
            } else {
                let index = seat_delete.indexOf(seat);
                if (index !== -1) {
                    seat_delete.splice(index, 1);
                }
            }
        });

        seatToBeDeletedDiv.appendChild(seatTile);
    });

    document.getElementById("deleteConfirmation").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// function to close confirmation box for deletion
function closeDeleteConfirmation(){
    booking_id_delete = '';
    seat_delete = [];
    all_seats = [];
    document.getElementById("declaration").checked = false;
    document.getElementById("deleteConfirmation").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// delete the payment of the booking
function deleteBookingPayment(){
    if(booking_id_delete === ''){
        console.error('booking_id_delete is null');
    }
    else if(seat_delete.length === 0){
        showAlert(document.getElementById("seatToBeDeleted"), "Please select one or more seats to be deleted.");
    }
    else if(!document.getElementById("declaration").checked){
        showAlert(document.getElementById("declaration"), "Please agree to the terms and conditions.");
    }
    else if(seat_delete.length === all_seats.length){
        deleteFetch(booking_id_delete, seat_delete, "flag");
    }
    else if(seat_delete.length < all_seats.length){
        deleteFetch(booking_id_delete, seat_delete, "update");
    }
}

// show alert box
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

// after payment deleted this function is called
function deleteFetch(booking_id, selected_seat, action){
    const userData = {
        booking_id: booking_id,
        p_id: session_p_id,
        selectedSeats: selected_seat,
    };

    const jsonData = JSON.stringify(userData);
    fetch(`${url}/bookingController?action=${action}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                openAlert( "Successfully deleted", "alertSuccess");
            } else {
                openAlert( "Deletion unsuccessful!", "alertFail");;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// see more function. this creates a another div model
function openSeeMore(page){
    document.getElementById("seeMoreBookings").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    const scheduleList = document.getElementById("bookingList");
    scheduleList.innerHTML = '';

    allData.forEach(item => {
        if(item.status === page){
            let buttonsHTML = "";
            if (page === 0) {
                buttonsHTML = `
                <span class="icon-container" style="margin-left: 1px;">
                    <i onclick="deleteBooking_passenger('${item.booking_id}', '${item.seat_no}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
                </span>
            `;
            } else if (page === 1) {
                if (item.schedule_status === 1) {
                    buttonsHTML = `
                <span class="icon-container">
                    <i onclick="ViewLocation('${item.schedule_id}')"><img src="../../../images/vector_icons/location_icon.png" alt="location" class="action_icon"></i>
                </span>
                <span class="icon-container" style="margin-left: 1px;">
                    <i onclick="openReview('${item.schedule_id}', '${item.booking_id}')"><img src="../../../images/vector_icons/review_icon.png" alt="review" class="action_icon"></i>
                </span>  
            `;
                }
                else if (item.schedule_status === 2) {
                    buttonsHTML = `
                <span class="icon-container" style="margin-left: 1px;">
                    <i onclick="openReview('${item.schedule_id}', '${item.booking_id}')"><img src="../../../images/vector_icons/review_icon.png" alt="review" class="action_icon"></i>
                </span>  
            `;
                }
                else if (item.schedule_status === 0) {
                    buttonsHTML = `
            `;
                }
            }
            const scheduleElement = document.createElement("div");
            scheduleElement.classList.add("schedule_tiles");
            scheduleElement.innerHTML = `
            <div class="schedule_element_row1">
                <div class="busRegNo">
                    <h1 id="busRegNo">${item.booking_id}</h1>
                </div>
                <div>
                    <h3><span id="start">${item.start}-${item.destination}</span></h3>
                    <p>Status: Pending</p>
                </div>
                <div class="seatAvailability">
                    <h1 id="seatAvailability">${item.seat_no}</h1>
                </div>
            </div>
            <div class="schedule_element_row2">
                <div class="routeNo">
                    <h1 id="busRegNo">${item.reg_no}</h1>
                </div>
                <div>
                    <h1><span id="destination">${item.date} ${item.time}</span></h1>
                </div>
                <div class="addBookingBtn">
                     ${buttonsHTML}                   
                </div>              
            </div>
        `;

            scheduleList.appendChild(scheduleElement);
        }
    });
}

// function to close the see more at previous bookings and upcoming bookings
function closeSeeMore(){
    document.getElementById("seeMoreBookings").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// search require data
function searchData() {
    const start = document.getElementById('dropdown_start').value.toLowerCase();
    const destination = document.getElementById('dropdown_destination').value.toLowerCase();
    const date = document.getElementById('datePicker').value;
    const startTime = document.getElementById('startTimePicker').value;
    const endTime = document.getElementById('endTimePicker').value;

    fetch(`${ url }/bookingController?start=${start}&destination=${destination}&date=${date}&startTime=${startTime}&endTime=${endTime}&p_id=${session_p_id}`, {
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
            document.getElementById("schedule_list").innerHTML = "";
            document.getElementById("schedule_list_old").innerHTML = "";
            allData = capitalizeStartAndDestination(data);
            displayDataAsScheduleTiles_0(allData);
            displayDataAsScheduleTiles_1(allData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
