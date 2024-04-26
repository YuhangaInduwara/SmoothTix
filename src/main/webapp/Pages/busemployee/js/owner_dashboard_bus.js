let Bus_id = "";
let searchOption = "bus_id";
let currentPage = 1;
const pageSize = 10;
let dataSearch = [];
let allData = [];
let allRequestData = [];


document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

function refreshPage() {
    location.reload();
}
// Fetch all data from the database
function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;
            fetch(`${url}/busController`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'p_id': session_p_id
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch bus data: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                allData = data;
                updatePage(currentPage);
            })
            .catch(error => {
                console.error('Error fetching bus data:', error);
            });
}


function updatePageNumber(page) {
    document.getElementById("currentPageNumber").textContent = page;
}

const prevPageIcon = document.getElementById("prevPageIcon");
prevPageIcon.addEventListener("click", () => changePage(currentPage))

const nextPageIcon = document.getElementById("nextPageIcon");
nextPageIcon.addEventListener("click", () => changePage(currentPage));

function changePage(newPage) {
    console.log(currentPage + "  " + newPage)
    if (currentPage !== newPage) {
        currentPage = Math.max(1, newPage);
        updatePage(currentPage, false);
    }
}
function updatePage(page, search) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const tableBody = document.querySelector("#dataTable tbody");

    let dataToShow;
    if(search){
        console.log("hello: " + dataSearch)
        dataToShow = dataSearch.slice(startIndex, endIndex);
    }
    else{
        dataToShow = allData.slice(startIndex, endIndex);
    }

    tableBody.innerHTML = "";
    displayDataAsTable(dataToShow);
    updatePageNumber(currentPage);
}

// Display all data
function displayDataAsTable(data) {
      const tableBody = document.querySelector("#dataTable tbody");
      const rowCount = data.length;
      let existingData = {};
          if(rowCount === 0){
              const noDataRow = document.createElement("tr");
              noDataRow.innerHTML = `<td colspan="6">No data available</td>`;
              tableBody.appendChild(noDataRow);
              return;
          }
          if(rowCount >= 10){
              renderPageControl()
          }

    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
        `;

        fetch(`${ url }/passengerController`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'p_id': item.p_id,
            },
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        existingData = data[0];
                        row.innerHTML = `
                            <td>${item.bus_id}</td>
                            <td>${item.owner_id}</td>
                            <td>${item.reg_no}</td>
                            <td>${item.route_id}</td>
                            <td>${item.no_of_Seats}</td>
                            <td>${item.review_points}</td>
                            <td>
                                <span class="icon-container">
                                    <i onclick="updateRow('${item.bus_id}')"><img src="../../../images/vector_icons/update_icon.png" alt="update" class="action_icon"></i>
                                </span>
                                <span class="icon-container" style="margin-left: 1px;">
                                    <i onclick="openFlagConfirm('${item.bus_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
                                </span>
                            </td>
                        `;
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
        tableBody.appendChild(row);
    });
}

function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}

// Add new bus to the database
document.getElementById("busRegForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const reg_no = document.getElementById("add_reg_no").value;
    const route_no = document.getElementById("add_route_no").value;
    const no_of_Seats = document.getElementById("add_no_of_Seats").value;

    const userData = {
        reg_no: reg_no,
        route_no: route_no,
        no_of_Seats: no_of_Seats,
    };
    console.log(userData);
    const jsonData = JSON.stringify(userData);

    // Assuming `url` is defined elsewhere and `session_p_id` is available in your session storage or a similar place.
    fetch(`${url}/busController`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id
        },
        body: jsonData
    })
    .then(response => {
        if (response.ok) {
            // If the response is OK (200 status), handle success
            closeForm_add(); // Assuming this function closes your form
            openAlertSuccess("Successfully Added!"); // Assuming this function shows a success message
        } else if (response.status === 409) {
            // Handle the specific case of a conflict (duplicate entry)
            return response.text().then(error_msg => {
                openAlertFail(error_msg); // Assuming this function shows an error message
            });
        } else {
            // Handle other types of errors generically
            return response.text().then(error_msg => {
                openAlertFail("Failed to add bus: " + error_msg);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        openAlertFail("An error occurred while processing your request."); // General error handling
    });
});


// Handle update
function updateRow(bus_id){
    openForm_update();

    let existingData = {};

    const urlParams = new URLSearchParams(window.location.search);

    document.getElementById("header_bus_id").innerHTML = bus_id

    fetch(`${ url }/busController`, {
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
                    document.getElementById("update_route_no").value = existingData.route_no;
                    document.getElementById("update_no_of_Seats").value = existingData.no_of_Seats;
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
        const route_no = document.getElementById("update_route_no").value;
        const no_of_Seats = document.getElementById("update_no_of_Seats").value;
        const updatedData = {
            route_no: route_no,
            no_of_Seats: no_of_Seats,
        };

        const jsonData = JSON.stringify(updatedData);

    fetch(`${ url }/busController`, {
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
                openAlertSuccess("Successfully");
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

// Handle delete
function deleteRow(){
    fetch(`${ url }/busController`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'bus_id': Bus_id
        },
    })
       .then(response => {
           if (response.ok) {
               closeAlert();
               openAlertSuccess("Successfully Deleted!");
           } else if (response.status === 401) {
               closeAlert();
               openAlertFail(response.status);
               console.log('Delete unsuccessful');
           } else {
               openAlertFail(response.status);
               closeAlert();
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
        createForm('add');
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
        createForm('update');
    }

    document.getElementById("busUpdateForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_update() {
    document.getElementById("busUpdateForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openAlertSuccess(msg) {
    bus_id = "";
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    bus_id = "";
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_bus.html";
}

function openAlertFail(response) {
    bus_id = "";
    document.getElementById("failMsg").textContent = response;
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    bus_id = "";
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_bus.html";
}
function openFlagConfirm(bus_id){
    Bus_id = bus_id;
    document.getElementById("confirmAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("deleteUser").textContent = Bus_id;
}

function closeAlert(){
    bus_id = "";
    document.getElementById("confirmAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

document.addEventListener('DOMContentLoaded', function() {
    createForm('add');
    createForm('update');
});

// Create the add and update forms
function createForm(action) {
if(action === 'add'){
     const form_add = document.createElement('div');
     form_add.classList.add('bus_add_form_body');

        const form= `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="reg_no" class="bus_form_title">Registration No <span class="bus_form_require">*</span></label>
                <input type="text" name="reg_no" id="reg_no" class="form_data" placeholder="Enter Registration No" required="required" />
            </div>
            <div class="form_div">
                <label for="route_no" class="bus_form_title">Route No <span class="bus_form_require">*</span></label>
                <input type="text" name="route_no" id="route_no" class="form_data" placeholder="Enter Route_No" required="required" oninput="showSuggestions1(event)" />
                <ul id="bus_route_suggestions" class="autocomplete-list"></ul>
            </div>
            <div class="form_div">
                <label for="no_of_Seats" class="bus_form_title">Number of Seats <span class="bus_form_require">*</span></label>
                <input type="number" name="no_of_Seats" id="no_of_Seats" class="form_data" placeholder="Enter Number of Seats" required="required" />
            </div>
        </div>
        `;

        form_add.innerHTML = form.replace(/id="/g, 'id="add_');
        const formContainer_add = document.getElementById('formContainer_add');
        formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form

    }
    else if(action === 'update'){
        const form_update = document.createElement('div');
        form_update.classList.add('bus_update_form_body');

        const form = `
            <div class="bus_form_left">
                <div class="form_div">
                    <label for="route_no" class="bus_form_title">Route No <span class="bus_form_require">*</span></label>
                    <input type="text" name="route_no" id="route_no" class="form_data" placeholder="Enter Route_No" required="required" oninput="showSuggestions2(event)" />
                    <ul id="bus_route_suggestions" class="autocomplete-list"></ul>
                </div>
                <div class="form_div">
                    <label for="no_of_Seats" class="bus_form_title">Number of Seats <span class="bus_form_require">*</span></label>
                    <input type="number" name="no_of_Seats" id="no_of_Seats" class="form_data" placeholder="Enter Number of Seats" required="required" />
                </div>
            </div>
        `;

        form_update.innerHTML = form.replace(/id="/g, 'id="update_');
        const formContainer_update = document.getElementById('formContainer_update');
        formContainer_update.appendChild(form_update.cloneNode(true)); // Clone the form
    }

}

function showSuggestions1(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container1`);
    if(inputValue === ""){
        suggestionsContainer.innerHTML = '';
    }
    else {
        fetch(`${url}/routeController`, {
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
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            })
            .then(data => {
                const suggestions = data.map(item => {
                    return {
                        route_no: item.route_no,
                        start: item.start,
                        destination: item.destination
                    };
                });
                suggestionsContainer.innerHTML = '';
                const filteredSuggestions = suggestions.filter(suggestion =>
                    suggestion.route_no.toUpperCase().includes(inputValue)
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
                        listItem.textContent = `${suggestion.route_no} - ${suggestion.start} to ${suggestion.destination}`;
                        listItem.addEventListener('click', () => {
                            input.value = suggestion.route_no;
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

function showSuggestions2(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container2`);
    if(inputValue === ""){
        suggestionsContainer.innerHTML = '';
    }
    else {
        fetch(`${url}/routeController`, {
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
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            })
            .then(data => {
                const suggestions = data.map(item => {
                    return {
                        route_no: item.route_no,
                        start: item.start,
                        destination: item.destination
                    };
                });
                suggestionsContainer.innerHTML = '';
                const filteredSuggestions = suggestions.filter(suggestion =>
                    suggestion.route_no.toUpperCase().includes(inputValue)
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
                        listItem.textContent = `${suggestion.route_no} - ${suggestion.start} to ${suggestion.destination}`;
                        listItem.addEventListener('click', () => {
                            input.value = suggestion.route_no;
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

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);

function searchData() {
    const searchTerm = document.getElementById("searchInput").value;
    const search = searchTerm.toLowerCase();

    dataSearch = allData.filter(user =>
        user[searchOption].toLowerCase().includes(search)
    );

    updatePage(currentPage, true);
}

const searchSelect = document.getElementById("searchSelect");
searchSelect.addEventListener("change", (event) => {
    searchOption = event.target.value;
});

function openRequests(){
    showRequests(0);
    document.getElementById("requestContainer").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeRequests(){
    document.getElementById("requestContainer").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function showRequests(status){
    fetch(`${url}/busVerifyController?p_id=${session_p_id}`, {
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
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(data=>{
            allRequestData = data;
            console.log(allRequestData);
            if(status === 0){
                console.log("0")
                showRequestsBody(0)
            }
            else if(status === 2){
                console.log("2")
                showRequestsBody(2)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function showRequestsBody(status) {
    let filteredRequests = allRequestData.filter(function(request) {
        return request.status === status;
    });

    console.log(filteredRequests)

    let requestBody = document.getElementById("requestBody");
    requestBody.innerHTML = "";

    if (filteredRequests.length === 0) {
        let noDataMsg = document.createElement("p");
        noDataMsg.textContent = "No requests found.";
        requestBody.appendChild(noDataMsg);
    } else {
        filteredRequests.forEach(function (request) {
            let requestInfo = document.createElement("p");
            requestInfo.textContent = request.reg_no + " - " + request.route_no + " - " + request.route + " - " + request.no_of_Seats;
            requestBody.appendChild(requestInfo);
        });
    }
}