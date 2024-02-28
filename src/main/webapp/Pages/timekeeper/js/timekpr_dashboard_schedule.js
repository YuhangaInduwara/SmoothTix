let p_id = "P0009";
let timeKeeper_id = "";
let timeKeeper_stand= "";
let currentPage = 1;
const pageSize = 10;
let allData = [];
let standData = [];

getTimeKeeperData();

document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

function refreshPage() {
    location.reload();
}

setSearchStands();

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
                standData = data;

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

function getTimeKeeperData(){
    fetch(`${ url }/timekeeperController?p_id=${p_id}`, {
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
            console.log(data)
            data.forEach(item =>{
                timeKeeper_id = item.timekpr_id;
                timeKeeper_stand = item.stand;
                console.log(timeKeeper_stand)
            })

            console.log(timeKeeper_id + " " + timeKeeper_stand);
            fetchAllData(timeKeeper_stand);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;
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
            console.log(allData)
            updatePage(currentPage);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updatePage(page) {
    const tableBody = document.querySelector("#dataTable tbody");
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataToShow = allData.slice(startIndex, endIndex);

    tableBody.innerHTML = "";
    displayDataAsTable(dataToShow);
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

    data.forEach(item => {
        console.log(item.start +" " + timeKeeper_stand + " " + item.destination)
        if(item.start.toLowerCase() === timeKeeper_stand.toLowerCase() || item.destination.toLowerCase() === timeKeeper_stand.toLowerCase()){
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
                    <span class="icon-container">
                    <i onclick="updateRow('${item.bus_id}')"><img src="../../../images/vector_icons/update_icon.png" alt="update" class="action_icon"></i>
                </span>
                <span class="icon-container" style="margin-left: 1px;">
                    <i onclick="deleteRow('${item.bus_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
                </span>
                </td>
            `;

            tableBody.appendChild(row);
        }
    });
}

function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}


document.getElementById("busRegForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const start = timeKeeper_stand;
    const destination = document.getElementById("add_destination").value;
    const date = document.getElementById("add_date").value;
    const time = document.getElementById("add_time").value;

    fetch(`${ url }/feasibilityController?start=${start}&destination=${destination}&date=${date}&time=${time}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                closeForm_add();
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
});

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
            const tableBody = document.querySelector("#dataTable tbody");
            tableBody.innerHTML = "";
            allData = data;
            updatePage(currentPage);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateRow(bus_id){
    openForm_update();

    let existingData = {};
    new URLSearchParams(window.location.search);
    document.getElementById("header_bus_id").innerHTML = bus_id

    fetch('../../../busController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'bus_id': bus_id
        },
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    existingData = data[0];
                    console.log("existingData:", existingData);

                    document.getElementById("update_owner_nic").value = existingData.owner_id;
                    document.getElementById("update_engineNo").value = existingData.engineNo;
                    document.getElementById("update_route").value = existingData.route;
                    document.getElementById("update_chassisNo").value = existingData.chassisNo;
                    document.getElementById("update_noOfSeats").value = existingData.noOfSeats;
                    document.getElementById("update_manufact_year").value = existingData.manufact_year;
                    document.getElementById("update_brand").value = existingData.brand;
                    document.getElementById("update_model").value = existingData.model;
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

        const owner_nic = document.getElementById("update_owner_nic").value;
        const engineNo = document.getElementById("update_engineNo").value;
        const route = document.getElementById("update_route").value;
        const chassisNo = document.getElementById("update_chassisNo").value;
        const noOfSeats = document.getElementById("update_noOfSeats").value;
        const manufact_year = document.getElementById("update_manufact_year").value;
        const brand = document.getElementById("update_brand").value;
        const model = document.getElementById("update_model").value;

        const updatedData = {
            owner_nic: owner_nic,
            engineNo: engineNo,
            route: route,
            chassisNo: chassisNo,
            noOfSeats: noOfSeats,
            manufact_year: manufact_year,
            brand: brand,
            model: model
        };

        const jsonData = JSON.stringify(updatedData);

        fetch(`/SmoothTix_war_exploded/busController`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'bus_id': bus_id
            },
            body: jsonData
        })
            .then(response => {
                if (response.ok) {
                    closeForm_update();
                    openAlertSuccess();
                } else if (response.status === 401) {
                    openAlertFail(response.status);
                    console.log('Update unsuccessful');
                } else {
                    openAlertFail(response.status);
                    console.error('Error:', response.status);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}

function deleteRow(bus_id){
    fetch(`/SmoothTix_war_exploded/busController`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'bus_id': bus_id
        },
    })
        .then(response => {
            if (response.ok) {
                openAlertSuccess();
            } else if (response.status === 401) {
                openAlertFail(response.status);
                console.log('Delete unsuccessful');
            } else {
                openAlertFail(response.status);
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
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

    formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form
    formContainer_update.appendChild(form_update.cloneNode(true)); // Clone the form

    // showSuggestions({ target: document.getElementById('add_destination') });
}

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
                    console.error('Error:', response.status);
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            })
            .then(data => {
                const suggestions = data.map(item => item.stand_list);
                suggestionsContainer.innerHTML = '';
                const filteredSuggestions = suggestions.filter(suggestion =>
                    suggestion.toUpperCase().includes(inputValue)
                );
                console.log(filteredSuggestions)
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