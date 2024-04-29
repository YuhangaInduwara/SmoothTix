// Declaration of global variables
let Conductor_id = ""; // Stores conductor ID for deletion
let searchOption = "conductor_id"; // Default search option
let currentPage = 1; // Current page number
const pageSize = 10; // Number of items per page
let allData = []; // Array to store all fetched conductor data
let dataSearch = []; // Array to store search results

// Event listener for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

// Function to refresh the page
function refreshPage() {
    location.reload();
}

// Function to fetch all conductor data
function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;
    // Fetches all conductor data from the server
    fetch(`${ url }/conductorController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'cp_id': session_p_id,
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
            // Stores fetched data and updates page
            allData = data;
            currentPage = 1;
            updatePage(currentPage, false);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to update page with data
function updatePage(page, search) {
    // Calculates start and end index for pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const tableBody = document.querySelector("#dataTable tbody");

    // Selects data to display based on search
    let dataToShow;
    if(search){
        dataToShow = dataSearch.slice(startIndex, endIndex);
    }
    else{
        dataToShow = allData.slice(startIndex, endIndex);
    }

    // Clears table body and displays data
    tableBody.innerHTML = "";
    displayDataAsTable(dataToShow);
    updatePageNumber(currentPage);
}

// Function to update page number display
function updatePageNumber(page) {
    document.getElementById("currentPageNumber").textContent = page;
}

// Event listeners for previous and next page navigation
const prevPageIcon = document.getElementById("prevPageIcon");
prevPageIcon.addEventListener("click", () => changePage(currentPage))

const nextPageIcon = document.getElementById("nextPageIcon");
nextPageIcon.addEventListener("click", () => changePage(currentPage));

// Function to change page
function changePage(newPage) {
    if (currentPage !== newPage) {
        currentPage = Math.max(1, newPage);
        updatePage(currentPage, false);
    }
}

// Function to display data in table format
function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    const rowCount = data.length;
    let existingData = {};

    // Displays no data message if no data available
    if(rowCount === 0){
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="6">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    // Renders page control if row count >= 10
    if(rowCount >= 10){
        renderPageControl()
    }

    // Iterates over data to display each row in the table
    data.forEach(item => {
        const row = document.createElement("tr");

        // Fetches passenger data for the conductor
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
                        // Renders table row with conductor and passenger data
                        existingData = data[0];
                        row.innerHTML = `
                            <td>${item.conductor_id}</td>
                            <td>${existingData.first_name} ${existingData.last_name}</td>
                            <td>${existingData.nic}</td>
                            <td>${existingData.email}</td>
                            <td>${item.review_points}</td>
                            <td>
                                <span class="icon-container" style="margin-left: 1px;">
                                  <i onclick="openFlagConfirm('${item.conductor_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
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

// Function to render page control
function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}

// Event listener for conductor form submission
document.getElementById("conductorForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Retrieves input data
    const nic = document.getElementById("add_nic").value;

    // Constructs user data
    const userData = {
        nic: nic,
    };

    const jsonData = JSON.stringify(userData);

    // Sends POST request to add conductor
    fetch(`${url}/conductorController`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                // Closes form and displays success alert
                closeForm_add();
                openAlertSuccess("Successfully Added!");
            } else{
                return response.json()
                    .then(data => {
                        // Displays error alert if request fails
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

// Function to delete row
function deleteRow(){
    // Sends DELETE request to delete conductor
    fetch(`${url}/conductorController`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'conductor_id': Conductor_id
        },
    })
        .then(response => {
            if (response.ok) {
                // Displays success alert on successful deletion
                closeAlert();
                openAlertSuccess("Successfully Deleted!");
            } else if (response.status === 401) {
                // Displays unauthorized alert on failure
                closeAlert();
                openAlertFail(response.status);
                console.log('Delete unsuccessful');
            } else {
                // Displays error alert on other failures
                openAlertFail(response.status);
                closeAlert();
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to open add conductor form
function openForm_add() {
    const existingForm = document.querySelector(".conductor_add_form_body");

    if (!existingForm) {
        createForm('add');
    }
    document.getElementById("conductorForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close add conductor form
function closeForm_add() {
    document.getElementById("conductorForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Function to open success alert
function openAlertSuccess(msg) {
    conductor_id = "";
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close success alert and redirect to dashboard
function closeAlertSuccess() {
    conductor_id = "";
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_conductor.html";
}

// Function to open fail alert
function openAlertFail() {
    conductor_id = "";
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close fail alert
function closeAlertFail() {
    conductor_id = "";
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Function to open flag confirm dialog
function openFlagConfirm(conductor_id){
    Conductor_id = conductor_id;
    document.getElementById("confirmAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("deleteUser").textContent = Conductor_id;
}

// Function to close alert dialog
function closeAlert(){
    conductor_id = "";
    document.getElementById("confirmAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Function to create conductor form
function createForm(action) {
    if(action === 'add'){
        const form_add = document.createElement('div');
        form_add.classList.add('conductor_add_form_body');

        // Constructs add conductor form
        const form= `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="nic" class="conductor_form_title">NIC<span class="conductor_form_require">*</span></label>
                <input type="text" name="nic" id="nic" class="form_data" placeholder="Enter NIC" required="required" oninput="showSuggestions1(event)"/>
                <ul id="nic_suggestions" class="autocomplete-list"></ul>
            </div>
        </div>
        `;

        // Appends form to form container
        form_add.innerHTML = form.replace(/id="/g, 'id="add_');
        const formContainer_add = document.getElementById('formContainer_add');
        formContainer_add.appendChild(form_add.cloneNode(true));

    }
}

// Function to show NIC suggestions
function showSuggestions1(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container1`);
    fetch(`${ url }/passengerController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'flag': '0',
            'privilege_level': '6',
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
            const suggestions = data.map(item => item.nic);
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

// Event listener for search input
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);

// Function to perform search
function searchData() {
    const searchTerm = document.getElementById("searchInput").value;
    const search = searchTerm.toLowerCase();

    // Filters data based on search term
    dataSearch = allData.filter(user =>
        user[searchOption].toLowerCase().includes(search)
    );

    // Updates page with search results
    updatePage(currentPage, true);
}

// Event listener for search select
const searchSelect = document.getElementById("searchSelect");
searchSelect.addEventListener("change", (event) => {
    searchOption = event.target.value;
});
