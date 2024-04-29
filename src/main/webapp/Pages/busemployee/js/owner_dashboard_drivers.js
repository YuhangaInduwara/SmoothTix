let Driver_id = "";
let searchOption = "driver_id";
let currentPage = 1;
const pageSize = 10;
let dataSearch = [];
let allData = [];

// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check authentication status before fetching data
    isAuthenticated().then(() => fetchAllData());
});

// Function to refresh the page
function refreshPage() {
    location.reload();
}

// Function to fetch all driver data from the server
function fetchAllData() {
    // Set the user name in the UI
    document.getElementById("userName").textContent = session_user_name;

    // Fetch all driver data
    fetch(`${url}/driverController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'dp_id': session_p_id,
        },
    })
    .then(response => {
        // Check if the response is successful
        if (!response.ok) {
            // If not, throw an error
            throw new Error(`Failed to fetch bus data: ${response.status}`);
        }
        // If successful, parse the response as JSON
        return response.json();
    })
    .then(data => {
        // Store the fetched data
        allData = data;
        // Reset the current page to the first page
        currentPage = 1;
        // Update the page with the fetched data
        updatePage(currentPage);
    })
    .catch(error => {
        // Log any errors that occur during fetching
        console.error('Error fetching bus data:', error);
    });
}

// Function to update the page with data
function updatePage(page, search) {
    // Calculate the start and end index for pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    // Select the table body element
    const tableBody = document.querySelector("#dataTable tbody");

    // Determine which data to display based on search status
    let dataToShow;
    if (search) {
        dataToShow = dataSearch.slice(startIndex, endIndex);
    } else {
        dataToShow = allData.slice(startIndex, endIndex);
    }

    // Clear the table body
    tableBody.innerHTML = "";
    // Display the data in table format
    displayDataAsTable(dataToShow);
    // Update the page number display
    updatePageNumber(currentPage);
}

// Function to update the page number display
function updatePageNumber(page) {
    document.getElementById("currentPageNumber").textContent = page;
}

// Event listeners for previous and next page navigation
const prevPageIcon = document.getElementById("prevPageIcon");
prevPageIcon.addEventListener("click", () => changePage(currentPage));

const nextPageIcon = document.getElementById("nextPageIcon");
nextPageIcon.addEventListener("click", () => changePage(currentPage));

// Function to change the current page
function changePage(newPage) {
    if (currentPage !== newPage) {
        // Ensure the new page is within bounds
        currentPage = Math.max(1, newPage);
        // Update the page with new data
        updatePage(currentPage, false);
    }
}

// Function to render the page control
function renderPageControl() {
    document.getElementById("page_control").style.display = "flex";
}

// Function to display data in table format
function displayDataAsTable(data) {
    // Loop through each data item
    data.forEach(item => {
        // Create a table row element
        const row = document.createElement("tr");

        // Fetch additional data for each driver
        fetch(`${url}/passengerController`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'p_id': item.p_id,
            },
        })
        .then(response => {
            // Check if the response is successful
            if (response.ok) {
                // If successful, parse the response as JSON
                response.json().then(data => {
                    // Store the additional data
                    existingData = data[0];
                    // Populate the table row with data
                    row.innerHTML = `
                        <td>${item.driver_id}</td>
                        <td>${item.license_no}</td>
                        <td>${existingData.first_name} ${existingData.last_name}</td>
                        <td>${existingData.nic}</td>
                        <td>${existingData.email}</td>
                        <td>${item.review_points}</td>
                        <td>
                            <span class="icon-container">
                                <i onclick="updateRow('${item.driver_id}')"><img src="../../../images/vector_icons/update_icon.png" alt="update" class="action_icon"></i>
                            </span>
                            <span class="icon-container" style="margin-left: 1px;">
                                <i onclick="openFlagConfirm('${item.driver_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
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

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

// Event listener for driver registration form submission
document.getElementById("driverRegForm").addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Get values from form inputs
    const nic = document.getElementById("add_nic").value;
    const license_no = document.getElementById("add_license_no").value;

    // Create an object with user data
    const userData = {
        nic: nic,
        license_no: license_no,
    };
    // Convert user data to JSON
    const jsonData = JSON.stringify(userData);

    // Send a POST request to add a new driver
    fetch(`${url}/driverController`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id
        },
        body: jsonData
    })
    .then(response => {
        // Check if the response is successful
        if (response.ok) {
            // If successful, close the form and show a success alert
            closeForm_add();
            openAlertSuccess("Successfully Added!");
        } else {
            // If not successful, parse the response as JSON
            // and show a failure alert with the error message
            return response.json()
                .then(data => {
                    const error_msg = data.error;
                    openAlertFail(error_msg);
                    throw new Error("Failed");
                });
        }
    })
    .catch(error => {
        // Log any errors that occur during the request
        console.error('Error:', error);
    });
});

// Function to dynamically create add and update driver forms
createForm('add');
createForm('update');

// Function to handle updating a driver's data
function updateRow(driver_id){
    // Open the update form
    openForm_update();

    // Variable to store existing data
    let existingData = {};

    // Fetch existing data for the selected driver
    fetch(`${ url }/driverController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'driver_id': driver_id
        },
    })
    .then(response => {
        // Check if the response is successful
        if (response.ok) {
            // If successful, parse the response as JSON
            response.json().then(data => {
                // Store the existing data
                existingData = data[0];
                // Populate the update form with existing data
                document.getElementById("update_license_no").value = existingData.license_no;
            });
        } else if (response.status === 401) {
            console.log('Unauthorized');
        } else {
            console.error('Error:', response.status);
        }
    })
    .catch(error => {
        // Log any errors that occur during the request
        console.error('Error:', error);
    });

    // Event listener for update form submission
    document.getElementById("driverUpdateForm").addEventListener("submit", function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        // Get the updated license number from the form
        const license_no = document.getElementById("update_license_no").value;

        // Create an object with updated data
        const updatedData = {
            license_no: license_no,
        };

        // Convert updated data to JSON
        const jsonData = JSON.stringify(updatedData);

        // Send a PUT request to update the driver's data
        fetch(`${ url }/driverController`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'driver_id': driver_id
            },
            body: jsonData
        })
        .then(response => {
            // Check if the response is successful
            if (response.ok) {
                // If successful, close the update form and show a success alert
                closeForm_update();
                openAlertSuccess("Successfully");
            } else if (response.status === 401) {
                // If unauthorized, show a failure alert
                openAlertFail(response.status);
                console.log('Update unsuccessful');
            } else {
                // If not successful, show a failure alert with the error status
                openAlertFail(response.status);
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            // Log any errors that occur during the request
            console.error('Error:', error);
        });
    });
}

// Function to open the add driver form
function openForm_add(){
    // Create the add driver form if it doesn't exist
    const existingForm = document.querySelector(".driver_add_form_body");
    if (!existingForm) {
        createForm('add');
    }
    // Display the add driver form and overlay
    document.getElementById("driverRegForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close the add driver form
function closeForm_add() {
    document.getElementById("driverRegForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Function to open the update driver form
function openForm_update(){
    // Create the update driver form if it doesn't exist
    const existingForm = document.querySelector(".driver_update_form_body");
    if (!existingForm) {
        createForm('update');
    }
    // Display the update driver form and overlay
    document.getElementById("driverUpdateForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close the update driver form
function closeForm_update(){
    document.getElementById("driverUpdateForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function createForm(action) {
    if(action === 'add'){
     // Create the add driver form
        const form_add = document.createElement('div');
        form_add.classList.add('driver_add_form_body');

        const form= `
        <div class="driver_form_left">
            <div class="form_div">
                <label for="nic" class="driver_form_title">NIC<span class="driver_form_require">*</span></label>
                <input type="text" name="nic" id="nic" class="form_data" placeholder="Enter NIC" required="required" oninput="showSuggestions1(event)"/>
                <ul id="nic_suggestions" class="autocomplete-list"></ul>
            </div>
            <div class="form_div">
                <label for="license_no" class="driver_form_title">Driving License Number <span class="driver_form_require">*</span></label>
                <input type="text" name="license_no" id="license_no" class="form_data" placeholder="Eg : Bxxxxxxx" required="required" />
            </div>
        </div>
        `;

        form_add.innerHTML = form.replace(/id="/g, 'id="add_');
        const formContainer_add = document.getElementById('formContainer_add');
        formContainer_add.appendChild(form_add.cloneNode(true));

    }
    else if(action === 'update'){
    // Create the update driver form
        const form_update = document.createElement('div');
        form_update.classList.add('driver_update_form_body');

        const form = `
            <div class="driver_form_left">
                <div class="form_div">
                    <label for="license_no" class="driver_form_title">Driving License Number <span class="driver_form_require">*</span></label>
                    <input type="text" name="license_no" id="license_no" class="form_data" placeholder=" update driving License Number"  />
                </div>
            </div>
        `;

        form_update.innerHTML = form.replace(/id="/g, 'id="update_');
        const formContainer_update = document.getElementById('formContainer_update');
        formContainer_update.appendChild(form_update.cloneNode(true));

    }
}
function showSuggestions1(event) {
// Fetch passenger data for NIC autocomplete suggestions
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

// Function to open a success alert with a message
function openAlertSuccess(msg) {
    // Set the message in the success alert
    document.getElementById("alertMsgSuccess").textContent = msg;
    // Display the success alert and overlay
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close the success alert
function closeAlertSuccess() {
    // Close the success alert and overlay
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    // Redirect to the owner dashboard page
    window.location.href = "../html/owner_dashboard_drivers.html";
}

// Function to open a failure alert with a message
function openAlertFail(response) {
    // Set the message in the failure alert
    document.getElementById("failMsg").textContent = response;
    // Display the failure alert and overlay
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close the failure alert
function closeAlertFail() {
    // Close the failure alert and overlay
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    // Redirect to the owner dashboard page
    window.location.href = "../html/owner_dashboard_drivers.html";
}

// Function to close any type of alert
function closeAlert(){
    // Close the confirmation alert and overlay
    document.getElementById("confirmAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Function to open a confirmation alert for deleting a driver
function openFlagConfirm(driver_id){
    // Set the driver ID in the confirmation alert
    Driver_id = driver_id;
    // Display the confirmation alert and overlay
    document.getElementById("confirmAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("deleteUser").textContent = Driver_id;
}

function deleteRow() {
// Send a DELETE request to delete the selected driver
    fetch(`${ url }/driverController`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'driver_id': Driver_id
        },
    })
    .then(response => {
        if (response.ok) {
            closeAlert();
            openAlertSuccess("Successfully Deleted!");
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

// Event listener for search input
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);

// Function to perform search
function searchData() {
    // Get the search term from the input
    const searchTerm = document.getElementById("searchInput").value;
    const search = searchTerm.toLowerCase();

    // Filter data based on search term and update page
    dataSearch = allData.filter(user =>
        user[searchOption].toLowerCase().includes(search)
    );

    // Update the page with search results
    updatePage(currentPage, true);
}

// Event listener for search select
const searchSelect = document.getElementById("searchSelect");
searchSelect.addEventListener("change", (event) => {
    // Update the search option based on user selection
    searchOption = event.target.value;
});

