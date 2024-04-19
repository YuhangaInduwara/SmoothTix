const p_id = "P0001";
let currentPage = 1;
const pageSize = 3;
let allData = [];
let booking_id_review;

// document.addEventListener('DOMContentLoaded', function () {
//    isAuthenticated().then(() => fetchAllData());
// });

fetchAllData()

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
                    <h1>Status: Pending</h1>
                </div>
                <div class="addBookingBtn">
                    <span class="icon-container">
                        <i onclick="updateRow('${item.timekpr_id}')"><img src="../../../images/vector_icons/update_icon.png" alt="update" class="action_icon"></i>
                    </span>
                    <span class="icon-container" style="margin-left: 1px;">
                        <i onclick="openFlagConfirm('${item.timekpr_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
                    </span>                    
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
        console.log(item)
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
                        <h1>Status: Checked In</h1>
                    </div>
                    <div class="addBookingBtn">
                        <span class="icon-container">
                            <i onclick="ViewLocation('${item.schedule_id}')"><img src="../../../images/vector_icons/location_icon.png" alt="location" class="action_icon"></i>
                        </span>
                        <span class="icon-container" style="margin-left: 1px;">
                            <i onclick="openReview('${item.schedule_id}', '${item.booking_id}')"><img src="../../../images/vector_icons/review_icon.png" alt="review" class="action_icon"></i>
                        </span>                     
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

var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;
let fetchInterval;

function fetchAndUpdateLocation(schedule_id) {
    fetch(`../../../locationController?schedule_id=${schedule_id}`, {
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
                console.log("lat: " + lat + " lng: " + lng);
                updateMarkerPosition(lat, lng);
            }
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}

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

function startFetchingLocation(schedule_id) {
    fetchAndUpdateLocation(schedule_id);
    fetchInterval = setInterval(() => {
        fetchAndUpdateLocation(schedule_id);
    }, 1000); // Fetch location every 1 second
}


function stopFetchingLocation() {
    clearInterval(fetchInterval);
}

function ViewLocation(schedule_id){
    console.log(schedule_id)
    document.getElementById("locationView").style.display = "flex";
    document.getElementById("overlay").style.display = "block";

    startFetchingLocation(schedule_id)
    resizeMap();
}

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

function RemoveLocation(){
    stopFetchingLocation()
    document.getElementById("locationView").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openReview(schedule_id, booking_id){
    booking_id_review = booking_id;
    document.getElementById("review_container").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeReview(){
    booking_id_review = '';
    document.getElementById("review_container").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

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
                openAlert( "You only can review a journey once!", "alertFail");
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
                openAlert( "Successfully reviewed", "alertSuccess");
            }
            else{
                openAlert( "Review Unsuccessful", "alertFail");
            }
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
    refreshPage();
}