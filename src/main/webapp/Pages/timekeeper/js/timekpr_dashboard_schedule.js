let timeKeeper_id = "";
let timeKeeper_stand= "colombo";
let currentPage = 1;
const pageSize = 10;
let allData = [];
let standData = [];
let allFeasibleData = [];
let date_time;
let bus_profile_id_schedule;
let isUpdate = false;
let update_schedule_id;

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

// session management (authentication and authorization)
document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => getTimeKeeperData());
});

// refresh the page
function refreshPage() {
    location.reload();
}

setSearchStands();

// get stand data for showing on the dropdown list
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

// get the corresponding timekeeper id and stand for the session passenger id
function getTimeKeeperData(){
    document.getElementById("userName").textContent = session_user_name;
    fetch(`${ url }/timekeeperController?p_id=${session_p_id}`, {
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
            data.forEach(item =>{
                timeKeeper_id = item.timekpr_id;
                timeKeeper_stand = item.stand;
            })

            fetchAllData(timeKeeper_stand);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// get all schedule data from database
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
            allData = capitalizeStartAndDestination(data);
            document.getElementById("noOfPages").textContent = parseInt(allData.length / 3) + 1;
            updatePage(currentPage);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// create data chunks for each page and call display function for each of them
function updatePage(page) {
    const tableBody = document.querySelector("#dataTable tbody");
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataToShow = allData.slice(startIndex, endIndex);
    tableBody.innerHTML = "";
    displayDataAsTable(dataToShow);
    updatePageNumber(currentPage);
}

// update the page number on page control icons
function updatePageNumber(page) {
    document.getElementById("currentPageNumber").textContent = page;
}

// event listeners for page control buttons
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

// change the page number
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

// get data chunks for each pages
function getDataForPage(page) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allData.slice(startIndex, endIndex);
}

// display chunked data on the UI
function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");

    const dataCount = data.length;
    if(dataCount === 0){
        const noData = document.createElement("tr");
        noData.innerHTML = `<td colspan="11">No schedules available</td>`;
        tableBody.appendChild(noData);
        return;
    }

    if(dataCount >= 11){
        renderPageControl();
    }

    let buttonsHTML = '';
    data.forEach(item => {
        console.log(item.start +" " + timeKeeper_stand + " " + item.destination)
        if(item.start.toLowerCase() === timeKeeper_stand.toLowerCase() || item.destination.toLowerCase() === timeKeeper_stand.toLowerCase()){
            if (item.status === 1) {
                buttonsHTML = `
                    <span class="icon-container">
                        <i onclick="ViewLocation('${item.schedule_id}')"><img src="../../../images/vector_icons/location_icon.png" alt="update" class="action_icon"></i>
                    </span>
                    <span class="icon-container">
                        <i onclick="updateRow('${item.schedule_id}')"><img src="../../../images/vector_icons/update_icon.png" alt="update" class="action_icon"></i>
                    </span>
                    <span class="icon-container" style="margin-left: 1px;">
                        <i onclick="deleteRow('${item.schedule_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
                    </span>
                `;
            } else{
                buttonsHTML = `
                    <span class="icon-container">
                        <i onclick="updateRow('${item.schedule_id}')"><img src="../../../images/vector_icons/update_icon.png" alt="update" class="action_icon"></i>
                    </span>
                    <span class="icon-container" style="margin-left: 1px;">
                        <i onclick="deleteRow('${item.schedule_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
                    </span>
                `;
            }
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.schedule_id}</td>
                <td>${item.reg_no}</td>
                <td>${item.route_no}</td>
                <td>${item.start}</td>
                <td>${item.destination}</td>
                <td>${item.date}</td>
                <td>${item.time}</td>
                <td>${item.price_per_ride}</td>
                <td>${item.available_seats}</td>
                <td>${item.status}</td>
                <td>
                    ${buttonsHTML} 
                </td>
            `;

            tableBody.appendChild(row);
        }
    });
}

// display page control icons
function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}

// event listener for getting form data and submitting as a new schedule
document.getElementById("busRegForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const start = timeKeeper_stand;
    const destination = document.getElementById("add_destination").value;
    const date = document.getElementById("add_date").value;
    const time = document.getElementById("add_time").value;
    date_time = date + " " + time;
    fetch(`${ url }/feasibilityController?start=${start}&destination=${destination}&date=${date}&time=${time}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json()
                    .then(data =>{
                        allFeasibleData = data;
                        closeForm_add();
                        openForm_bpSelection();
                    })
            } else{
                return response.json()
                    .then(data => {
                        const error_msg = data.error;
                        openAlertFail(error_msg);
                        throw new Error("Failed");
                    });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// handle search data
function searchData() {
    const start = document.getElementById('dropdown_start').value.toLowerCase();
    const destination = document.getElementById('dropdown_destination').value.toLowerCase();
    const date = document.getElementById('datePicker').value;
    const startTime = document.getElementById('startTimePicker').value;
    const endTime = document.getElementById('endTimePicker').value;

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
            const tableBody = document.querySelector("#dataTable tbody");
            tableBody.innerHTML = "";
            allData = capitalizeStartAndDestination(data);
            updatePage(currentPage);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// update selected schedule by showing current data and sending user inputs to the database
function updateRow(schedule_id){
    update_schedule_id = schedule_id;
    isUpdate = true;
    let submitButton = document.getElementById('bpSelectionSubmit');
    submitButton.value = 'Update';
    openForm_update();

    let existingData = {};

    fetch(`${ url }/scheduleController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'schedule_id': schedule_id
        },
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    existingData = data[0];
                    document.getElementById("update_destination").value = existingData.destination;
                    document.getElementById("update_date").value = existingData.date;
                    document.getElementById("update_time").value = existingData.time;
                });
            } else if (response.status === 401) {
                console.log('Unauthorized');
            } else {
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    document.getElementById("busUpdateForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const start = timeKeeper_stand;
        const destination = document.getElementById("update_destination").value;
        const date = document.getElementById("update_date").value;
        const time = document.getElementById("update_time").value;
        date_time = date + " " + time;
        fetch(`${ url }/feasibilityController?start=${start}&destination=${destination}&date=${date}&time=${time}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                        .then(data =>{
                            allFeasibleData = data;
                            closeForm_update();
                            openForm_bpSelection();
                        })
                } else{
                    return response.json()
                        .then(data => {
                            const error_msg = data.error;
                            openAlertFail(error_msg);
                            throw new Error("Failed");
                        });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}

// delete a selected schedule
function deleteRow(schedule_id){
    fetch(`${ url }/scheduleController?schedule_id=${schedule_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                openAlertSuccess('Deleted successfully');
            } else if (response.status === 401) {
                openAlertFail(response.status);
            } else {
                openAlertFail(response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// handle view/close bus profile selection popups | open/close add/update forms
function openForm_bpSelection() {
    createTableRows(allFeasibleData);
    document.getElementById("bpSelection").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_bpSelection() {
    document.getElementById("bpSelection").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openForm_add() {
    const existingForm = document.querySelector(".bus_add_form_body");

    if (!existingForm) {
        createForm();
    }

    document.getElementById("busRegForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_add() {
    document.getElementById("busRegForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openForm_update() {
    const existingForm = document.querySelector(".bus_update_form_body");

    if (!existingForm) {
        createForm();
    }

    document.getElementById("busUpdateForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_update() {
    document.getElementById("busUpdateForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// render add route and update route forms
function createForm() {
    const form_add = document.createElement('div');
    form_add.classList.add('bus_add_form_body');

    const form_update = document.createElement('div');
    form_update.classList.add('bus_update_form_body');

    var form= `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="destination" class="bus_form_title">Destination <span class="bus_form_require">*</span></label>
                <input type="text" name="destination" id="destination" class="form_data" placeholder="Enter Destination" required="required" oninput="showSuggestions(event)"/>
                <ul id="nic_suggestions" class="autocomplete-list"></ul>
            </div>
            <div class="form_div">
                <label for="date" class="bus_form_title">Date <span class="bus_form_require">*</span></label>
                <input type="date" name="date" id="date" class="form_data" placeholder="Enter Date" required="required" />
            </div>
            <div class="form_div">
                <label for="time" class="bus_form_title">Time <span class="bus_form_require">*</span></label>
                <input type="time" name="time" id="time" class="form_data" placeholder="Enter Time" required="required" />
            </div>
        </div>
        `;

    form_add.innerHTML = form.replace(/id="/g, 'id="add_');
    form_update.innerHTML = form.replace(/id="/g, 'id="update_');
    const formContainer_add = document.getElementById('formContainer_add');
    const formContainer_update = document.getElementById('formContainer_update');

    formContainer_add.appendChild(form_add.cloneNode(true));
    formContainer_update.appendChild(form_update.cloneNode(true));
}

// show stand suggestions
function showSuggestions(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container`);
    if(inputValue === ""){
        suggestionsContainer.innerHTML = '';
    }
    else{
        fetch(`${ url }/routeController?request_data=stand_list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            })
            .then(data => {
                const suggestions = data.map(item => item.stand_list);
                suggestionsContainer.innerHTML = '';
                const filteredSuggestions = suggestions.filter(suggestion =>
                    suggestion.toUpperCase().includes(inputValue)
                );
                suggestionsContainer.style.maxHeight = '200px';
                suggestionsContainer.style.overflowY = 'auto';
                suggestionsContainer.style.width = '100%';
                suggestionsContainer.style.left = `18px`;
                if (filteredSuggestions.length === 0) {
                    const errorMessage = document.createElement('li');
                    errorMessage.textContent = 'No suggestions found';
                    suggestionsContainer.appendChild(errorMessage);
                } else {
                    filteredSuggestions.forEach(suggestion => {
                        const listItem = document.createElement('li');
                        listItem.classList.add('autocomplete-list-item');
                        listItem.textContent = suggestion;
                        listItem.addEventListener('click', () => {
                            input.value = suggestion;
                            suggestionsContainer.innerHTML = '';
                        });
                        suggestionsContainer.appendChild(listItem);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

// handle view/close success/alert popups
function openAlertSuccess(msg) {
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/timekpr_dashboard_schedule.html";
}

function openAlertFail(response) {
    document.getElementById("failMsg").textContent = response;
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function createTableRow(obj) {
    const row = document.createElement('tr');
    row.addEventListener('click', () => handleRowClick(obj));

    row.innerHTML = `
        <td>${obj.reg_no}</td>
        <td>${obj.conductor_nic}</td>
        <td>${obj.driver_nic}</td>
    `;

    return row;
}

// render the table for displaying feasible schedules
function createTableRows(data) {
    const tbody = document.querySelector('#bpSelection_container tbody');
    tbody.innerHTML = '';
    if (Array.isArray(data)) {
        data.forEach(obj => {
            const row = createTableRow(obj);
            tbody.appendChild(row);
        });
    } else {
        const row = createTableRow(data);
        tbody.appendChild(row);
    }
}

// show selected row
function handleRowClick(data) {
    const tbody = document.querySelector('#bpSelection_container tbody');
    tbody.innerHTML = '';

    if (data === []) {
        const messageRow = document.createElement('tr');
        const messageCell = document.createElement('td');
        messageCell.textContent = 'No data available';
        messageCell.colSpan = 3;
        messageRow.appendChild(messageCell);
        tbody.appendChild(messageRow);
    } else {
        const row = createTableRow(data);
        bus_profile_id_schedule = data.bus_profile_id;
        tbody.appendChild(row);
    }
}

// submit data after selecting bus profile and add button
document.getElementById("bpSelection").addEventListener("submit", function(event) {
    event.preventDefault();

    const userData = {
        bus_profile_id: bus_profile_id_schedule,
        date_time: date_time,
        status: 0
    };
    const jsonData = JSON.stringify(userData);

    if(isUpdate === true){
        fetch(`${ url }/scheduleController?schedule_id=${update_schedule_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
            .then(response => {
                if (response.ok) {
                    closeForm_bpSelection();
                    openAlertSuccess("Successfully Updated!");
                    update_schedule_id = '';
                    isUpdate = false;
                } else{
                    return response.json()
                        .then(data => {
                            const error_msg = data.error;
                            openAlertFail(error_msg);
                            throw new Error("Failed");
                        });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    else{
        fetch(`${ url }/scheduleController`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
            .then(response => {
                if (response.ok) {
                    closeForm_bpSelection();
                    openAlertSuccess("Successfully Added!");
                } else{
                    return response.json()
                        .then(data => {
                            const error_msg = data.error;
                            openAlertFail(error_msg);
                            throw new Error("Failed");
                        });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

});

var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;
let fetchInterval;

// get location updates for a given schedule id
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
                updateMarkerPosition(lat, lng);
            }
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}

// set the marker position of the map according to the current location
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

// starting to calling fetchAndUpdateLocation function for 1 second timer
function startFetchingLocation(schedule_id) {
    fetchAndUpdateLocation(schedule_id);
    fetchInterval = setInterval(() => {
        fetchAndUpdateLocation(schedule_id);
    }, 1000);
}

// stop location fetching
function stopFetchingLocation() {
    clearInterval(fetchInterval);
}

// display location container
function ViewLocation(schedule_id){
    document.getElementById("locationView").style.display = "flex";
    document.getElementById("overlay").style.display = "block";

    startFetchingLocation(schedule_id)
    resizeMap();
}

let previousMapSize = { width: 0, height: 0 };

// resize the map according to the user's previous map size
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

// close map view by stopping location fetching
function RemoveLocation(){
    stopFetchingLocation()
    document.getElementById("locationView").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}