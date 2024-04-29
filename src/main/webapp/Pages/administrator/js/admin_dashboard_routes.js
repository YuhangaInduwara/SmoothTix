let route_id = "";
let currentPage = 1;
const pageSize = 10;
let allData = [];
let dataSearch = [];
let searchOption = 'route_no';

// session management (authentication and authorization)
document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

// refresh the page
function refreshPage() {
    location.reload();
}

function openForm_add() {
    const existingForm = document.querySelector(".bus_add_form_body");

    if (!existingForm) {
        createForm();
    }

    document.getElementById("busRegForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";//make visible the form
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

// get all route data from database
function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name; // set username in dashboard
    fetch(`${ url }/routeController`, {
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
            allData = data;
            updatePage(currentPage, false);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// create data chunks for each page and call display function for each of them
function updatePage(page, search) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const tableBody = document.querySelector("#dataTable tbody");

    let dataToShow;
    if(search){
        dataToShow = dataSearch.slice(startIndex, endIndex);
    }
    else{
        dataToShow = allData.slice(startIndex, endIndex);
    }

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
prevPageIcon.addEventListener("click", () => changePage(currentPage))

const nextPageIcon = document.getElementById("nextPageIcon");
nextPageIcon.addEventListener("click", () => changePage(currentPage));

// change the page number
function changePage(newPage) {
    if (currentPage !== newPage) {
        currentPage = Math.max(1, newPage);
        updatePage(currentPage, false);
    }
}

// display chunked data on the UI
function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    const rowCount = data.length;

    // check for empty pages
    if(rowCount === 0){
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="8">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    // display page controls if row count is greater than 10
    if(rowCount >= 10){
        renderPageControl()
    }

    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.route_id}</td>
            <td>${item.route_no}</td>
            <td>${item.start}</td>
            <td>${item.destination}</td>
            <td>${item.distance}</td>
            <td>${item.price_per_ride}</td>
            <td>${item.number_of_buses}</td>
            <td>
                <span class="icon-container">
                    <i onclick="updateRow('${item.route_id}')"><img src="../../../images/vector_icons/update_icon.png" alt="update" class="action_icon"></i>
                </span>
                <span class="icon-container" style="margin-left: 1px;">
                    <i onclick="deleteRow('${item.route_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
                </span>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// display page control icons
function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}

// event listener for getting form data and submitting as a new route
document.getElementById("busRegForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const route_no = document.getElementById("add_route_no").value;
    const start = document.getElementById("add_start").value.toLowerCase();
    const destination = document.getElementById("add_destination").value.toLowerCase();
    const distance = document.getElementById("add_distance").value;
    const price_per_ride = document.getElementById("add_price_per_ride").value;

    const userData = {
        route_no: route_no,
        start: start,
        destination: destination,
        distance: distance,
        price_per_ride: price_per_ride,
    };

    const jsonData = JSON.stringify(userData);
    fetch(`${ url }/routeController`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                closeForm_add();
                openAlertSuccess("Successfully Added!");
                console.log("Success");
            } else{
                return response.json()
                    .then(data => {
                        const error_msg = data.error;
                        console.log(error_msg)
                        openAlertFail(error_msg);
                        throw new Error("Insertion failed");
                    });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// render add route and update route forms
function createForm() {
    const form_add = document.createElement('div');
    form_add.classList.add('bus_add_form_body');

    const form_update = document.createElement('div');
    form_update.classList.add('bus_update_form_body');

    var form= `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="route_no" class="bus_form_title">Route Number<span class="bus_form_require">*</span></label>
                <input type="text" name="route_no" id="route_no" class="form_data" placeholder="Enter Route Number" required="required" />
            </div>
            <div class="form_div">
                <label for="start" class="bus_form_title">From<span class="bus_form_require">*</span></label>
                <input type="text" name="start" id="start" class="form_data" placeholder="Enter Starting Stand" required="required" />
            </div>
            <div class="form_div">
                <label for="destination" class="bus_form_title">To<span class="bus_form_require">*</span></label>
                <input type="text" name="destination" id="destination" class="form_data" placeholder="Enter Ending Stand" required="required" />
            </div>
            <div class="form_div">
                <label for="distance" class="bus_form_title">Distance(km) <span class="bus_form_require">*</span></label>
                <input type="text" name="distance" id="distance" class="form_data" placeholder="Enter Distance" required="required" />
            </div>
            <div class="form_div">
                <label for="price_per_ride" class="bus_form_title">Price Per Ride(LKR) <span class="bus_form_require">*</span></label>
                <input type="text" name="price_per_ride" id="price_per_ride" class="form_data" placeholder="Enter Price Per Ride" required="required" />
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

// update selected route by showing current data and sending user inputs to the database
function updateRow(route_id){
    openForm_update();

    let existingData = {};

    const urlParams = new URLSearchParams(window.location.search);

    document.getElementById("header_bus_id").innerHTML = route_id

    fetch(`${ url }/routeController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'route_id': route_id
        },
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    existingData = data[0];
                    console.log(existingData)
                    document.getElementById("update_route_no").value = existingData.route_no;
                    document.getElementById("update_start").value = existingData.start;
                    document.getElementById("update_destination").value = existingData.destination;
                    document.getElementById("update_distance").value = existingData.distance;
                    document.getElementById("update_price_per_ride").value = existingData.price_per_ride;
                });
            } else {
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    document.getElementById("busUpdateForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const route_no = document.getElementById("update_route_no").value;
        const start = document.getElementById("update_start").value.toLowerCase();
        const destination = document.getElementById("update_destination").value.toLowerCase();
        const distance = document.getElementById("update_distance").value;
        const price_per_ride = document.getElementById("update_price_per_ride").value;

        const updatedData = {
            route_no: route_no,
            start: start,
            destination: destination,
            distance: distance,
            price_per_ride: price_per_ride,
        };

        const jsonData = JSON.stringify(updatedData);

        fetch(`${ url }/routeController`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'route_id': route_id
            },
            body: jsonData
        })
            .then(response => {
                if (response.ok) {
                    closeForm_update();
                    openAlertSuccess("Successfully updated!");
                }else {
                    return response.json()
                        .then(data => {
                            const error_msg = data.error;
                            console.log(error_msg)
                            openAlertFail(error_msg);
                            throw new Error("Update failed");
                        });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}

// delete a selected route
function deleteRow(route_id){
    fetch(`${ url }/routeController`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'route_id': route_id
        },
    })
        .then(response => {
            if (response.ok) {
                openAlertSuccess("Successfully deleted!");
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

// handle view/close success/alert popups
function openAlertSuccess(msg) {
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function openAlertFail(error_msg) {
    document.getElementById("failMsg").textContent = error_msg;
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = `${url}/Pages/administrator/html/admin_dashboard_routes.html`;
}

function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// event listener for search button
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);

// handle search data
function searchData() {
    const searchTerm = document.getElementById("searchInput").value;
    const search = searchTerm.toLowerCase();
    console.log(searchTerm)
    console.log(searchOption)

    dataSearch = allData.filter(user =>
        user[searchOption].toLowerCase().includes(search)
    );

    updatePage(currentPage, true);
}

// event listener for filter drop down
const searchSelect = document.getElementById("searchSelect");
searchSelect.addEventListener("change", (event) => {
    searchOption = event.target.value;
});