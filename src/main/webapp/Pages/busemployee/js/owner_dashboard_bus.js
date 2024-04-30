// Initialize variables
let Bus_id = "";
let searchOption = "bus_id";
let currentPage = 1;
const pageSize = 10;
let dataSearch = [];
let allData = [];
let allRequestData = [];

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

document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

// Function to refresh the page
function refreshPage() {
    location.reload();
}
// Function to fetch all bus data
function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;
    // Fetch data from the server
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
        allData = capitalizeStartAndDestination(data);
        updatePage(currentPage);
    })
    .catch(error => {
        console.error('Error fetching bus data:', error);
    });
}

// Function to update the page number display
function updatePageNumber(page) {
    // Update the page number display
    document.getElementById("currentPageNumber").textContent = page;
}

// Event listener for previous page button
const prevPageIcon = document.getElementById("prevPageIcon");
// Event listener for next page button
prevPageIcon.addEventListener("click", () => changePage(currentPage))

const nextPageIcon = document.getElementById("nextPageIcon");
nextPageIcon.addEventListener("click", () => changePage(currentPage));

// Function to handle page change
function changePage(newPage) {
    // Change the current page and update the page
    if (currentPage !== newPage) {
        currentPage = Math.max(1, newPage);
        updatePage(currentPage, false);
    }
}
function updatePage(page, search) {
    // Update the page with data based on search
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

function displayDataAsTable(data) {
      // Display data as a table
      const tableBody = document.querySelector("#dataTable tbody");
      const rowCount = data.length;
      let existingData = {};
          if(rowCount === 0){
              // Display message if no data available
              const noDataRow = document.createElement("tr");
              noDataRow.innerHTML = `<td colspan="6">No data available</td>`;
              tableBody.appendChild(noDataRow);
              return;
          }
          if(rowCount >= 10){
              // Render page control if more than 10 rows
              renderPageControl()
          }
     // Iterate through data and display each row
    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
        `;
        // Fetch additional data for each row
        fetch(`${ url }/busController`, {
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
                        // Populate row with data
                        row.innerHTML = `
                            <td>${item.bus_id}</td>
                            <td>${item.reg_no}</td>
                            <td>${item.route}</td>
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
    // Render page control if needed
    document.getElementById("page_control").style.display = "flex";
}

// Event listener for bus registration form submission
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
    const jsonData = JSON.stringify(userData);

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
            closeForm_add();
            openAlertSuccess("Operation Successful! Your bus request is pending for approval.");
        } else if (response.status === 409) {
            return response.text().then(error_msg => {
                openAlertFail(error_msg);
            });
        } else {
            return response.text().then(error_msg => {
                openAlertFail("Failed to add bus: " + error_msg);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        openAlertFail("An error occurred while processing your request.");
    });
});

// Function to update a row
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
                openAlertSuccess("Successfully Updated");
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

// Function to delete a row
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

// Function to open the add form
function openForm_add() {
    const existingForm = document.querySelector(".bus_add_form_body");
    if (!existingForm) {
        createForm('add');
    }
    document.getElementById("busRegForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close the add form
function closeForm_add() {
    document.getElementById("busRegForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Function to open the update form
function openForm_update() {
    const existingForm = document.querySelector(".bus_update_form_body");
    if (!existingForm) {
        createForm('update');
    }
    document.getElementById("busUpdateForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close the update form
function closeForm_update() {
    document.getElementById("busUpdateForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Function to open the success alert
function openAlertSuccess(msg) {
    bus_id = "";
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close the success alert
function closeAlertSuccess() {
    bus_id = "";
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_bus.html";
}

// Function to open the fail alert
function openAlertFail(response) {
    bus_id = "";
    document.getElementById("failMsg").textContent = response;
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close the fail alert
function closeAlertFail() {
    bus_id = "";
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_bus.html";
}

// Function to open the confirmation dialog for deletion
function openFlagConfirm(bus_id){
    Bus_id = bus_id;
    document.getElementById("confirmAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("deleteUser").textContent = Bus_id;
}

// Function to close the alert dialog
function closeAlert(){
    bus_id = "";
    document.getElementById("confirmAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

document.addEventListener('DOMContentLoaded', function() {
    createForm('add');
    createForm('update');
});

// Function to create add/update form
function createForm(action) {
if(action === 'add'){
     const form_add = document.createElement('div');
     form_add.classList.add('bus_add_form_body');

        const form= `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="reg_no" class="bus_form_title">Registration No <span class="bus_form_require">*</span></label>
                <input type="text" name="reg_no" id="reg_no" class="form_data" placeholder=" Eg : NB-XXXX" required="required" pattern="[A-Z]{2,3}-[0-9]{4}" title="Format: XX-1234 or XXX-1234"/>
            </div>
            <div class="form_div">
                <label for="route_no" class="bus_form_title">Route No <span class="bus_form_require">*</span></label>
                <input type="text" name="route_no" id="route_no" class="form_data" placeholder=" Eg : EX001 " required="required" oninput="showSuggestions1(event)" />
                <ul id="bus_route_suggestions" class="autocomplete-list"></ul>
            </div>
            <div class="form_div">
                <label for="no_of_Seats" class="bus_form_title">Number of Seats <span class="bus_form_require">*</span></label>
                <input type="number" name="no_of_Seats" id="no_of_Seats" class="form_data" placeholder=" Eg : XX" required="required" required="required" pattern="[0-9]{2}" title="Format:50"/>
            </div>
        </div>
        `;

        form_add.innerHTML = form.replace(/id="/g, 'id="add_');
        const formContainer_add = document.getElementById('formContainer_add');
        formContainer_add.appendChild(form_add.cloneNode(true));

    }
    else if(action === 'update'){
        const form_update = document.createElement('div');
        form_update.classList.add('bus_update_form_body');

        const form = `
            <div class="bus_form_left">
                <div class="form_div">
                    <label for="route_no" class="bus_form_title">Route No <span class="bus_form_require">*</span></label>
                    <input type="text" name="route_no" id="route_no" class="form_data" placeholder="Update Route_No" required="required" oninput="showSuggestions2(event)" />
                    <ul id="bus_route_suggestions" class="autocomplete-list"></ul>
                </div>
                <div class="form_div">
                    <label for="no_of_Seats" class="bus_form_title">Number of Seats <span class="bus_form_require">*</span></label>
                    <input type="number" name="no_of_Seats" id="no_of_Seats" class="form_data" placeholder="update Number of Seats" required="required" />
                </div>
            </div>
        `;

        form_update.innerHTML = form.replace(/id="/g, 'id="update_');
        const formContainer_update = document.getElementById('formContainer_update');
        formContainer_update.appendChild(form_update.cloneNode(true));
    }

}

// Function to show route suggestions
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

// Event listener for search input
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);
// Function to handle search data
function searchData() {
    const searchTerm = document.getElementById("searchInput").value;
    const search = searchTerm.toLowerCase();

    dataSearch = allData.filter(user =>
        user[searchOption].toLowerCase().includes(search)
    );

    updatePage(currentPage, true);
}
// Event listener for search select
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

// Function to show requests

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
            showRequestsBody(0)
        }
        else if(status === 2){
            showRequestsBody(2)
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to display requests body
function showRequestsBody(status) {
    // Filter and display requests based on status
    let filteredRequests = allRequestData.filter(function(request) {
        return request.status === status;
    });

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