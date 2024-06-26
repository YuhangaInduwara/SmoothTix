// Initialize variables
let bus_profile_id = "";
let searchOption = "bus_profile_id";
let currentPage = 1;
const pageSize = 10;
let allData = [];
let dataSearch = [];

// Function to capitalize the first letter of stand
function capitalizeRoute(data) {
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    if (data) {
        data.forEach(row => {
            console.log(row)
            if (row.route) {
                const parts = row.route.split('-');
                const capitalizedParts = parts.map(part => capitalizeFirstLetter(part));
                row.route = capitalizedParts.join(' - ');
            }
        });
    }

    return data;
}

// When the DOM content is loaded, execute the function
document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is authenticated, then fetch all data
    isAuthenticated().then(() => fetchAllData());
});

// Function to refresh the page
 function refreshPage() {
     location.reload();
 }

// Function to fetch all data
function fetchAllData() {
    // Set the user name in the UI
    document.getElementById("userName").textContent = session_user_name;

    // Fetch data from the busprofileController endpoint
    fetch(`${ url }/busprofileController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id
        },
    })
    .then(response => {
        // Check if response is successful
        if (!response.ok) {
            throw new Error(`Failed to fetch bus data: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Store fetched data and update the page
        allData = capitalizeRoute(data);
        updatePage(currentPage);
    })
    .catch(error => {
        console.error('Error fetching bus data:', error);
    });
}

// Function to update the displayed page
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

// Function to update the displayed page number
function updatePageNumber(page) {
    document.getElementById("currentPageNumber").textContent = page;
}

// Event listener for previous page navigation
const prevPageIcon = document.getElementById("prevPageIcon");
prevPageIcon.addEventListener("click", () => changePage(currentPage))

const nextPageIcon = document.getElementById("nextPageIcon");
nextPageIcon.addEventListener("click", () => changePage(currentPage));

// Function to change the page
function changePage(newPage) {
    if (currentPage !== newPage) {
        currentPage = Math.max(1, newPage);
        updatePage(currentPage, false);
    }
}


// Function to display data as a table
function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    if (data.length === 0) {
    // Display message if no data available
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="8">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    // Renders page control if row count >= 10
    if(data.length >= 10){
        renderPageControl()
    }

    // Loop through data and create table rows
    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.bus_profile_id}</td>
            <td>${item.bus_registration_no}</td>
            <td>${item.route}</td>
            <td>${item.driver_name}</td>
            <td>${item.driver_nic}</td>
            <td>${item.conductor_name}</td>
            <td>${item.conductor_nic}</td>
            <td>
                <span class="icon-container" style="margin-left: 1px;">
                    <i onclick="redirectToFeasibleSchedule('${item.bus_profile_id}')"><img src="../../../images/vector_icons/schedule.png" alt="Availability" class="action_icon"></i>
                </span>
                <span class="icon-container">
                    <i onclick="updateRow('${item.bus_profile_id}')"><img src="../../../images/vector_icons/update_icon.png" alt="update" class="action_icon"></i>
                </span>
                <span class="icon-container" style="margin-left: 1px;">
                    <i onclick="openFlagConfirm('${item.bus_profile_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
                </span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to redirect to feasible schedule
function redirectToFeasibleSchedule(bus_profile_id) {
    if (bus_profile_id) {
        openForm_feasible(bus_profile_id);
    } else {
        console.error('Invalid bus_profile_id:', bus_profile_id);

    }
}

// Function to open the feasible schedule form
function openForm_feasible(bus_profile_id) {
    const feasibleForm = document.getElementById('feasibleScheduleForm');
    if (feasibleForm) {
        feasibleForm.style.display = 'block';

    const inputForBusProfileId = document.getElementById('inputForBusProfileId');
            if (inputForBusProfileId) {
                inputForBusProfileId.value = bus_profile_id;
            } else {
                console.error('Element with ID "inputForBusProfileId" not found.');
            }
        } else {
            console.error('Feasible form not found');
        }

        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.style.display = 'block';
        } else {
            console.error('Overlay not found');
        }
    }

// Function to close the feasible schedule form
function closeForm_feasible() {
    const feasibleForm = document.getElementById('feasibleScheduleForm');
    if (feasibleForm) {
        feasibleForm.style.display = 'none';
    } else {
        console.error('Feasible form not found');
    }

    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'none';
    } else {
        console.error('Overlay not found');
    }
}
// Function to set bus profile id on DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
    if (bus_profile_id) {
        document.getElementById('bus_profile_id').innerText = bus_profile_id;
    }
});

// Add event listener to the form for feasible schedule submission
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('feasibleScheduleForm');

    form.addEventListener('submit', function (event) {
    event.preventDefault();
    // Validate the form
    if (validateForm()) {
        const bus_profile_id = document.getElementById("inputForBusProfileId").value;
        const date = document.getElementById("date").value;
        const time_range = getCheckedTimeRanges();
        // Construct form data
        const formData = {
            bus_profile_id: bus_profile_id,
            date: date,
            time_range: time_range,
        };
        // Send form data via POST request
        fetch(`${url}/feasibilityController`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                openAlertSuccess("Data Successfully Added!");
            } else {
                return response.json()
                    .then(data => {
                        const error_msg = data.error;
                        openAlertFail(error_msg);
                        console.error('Error:', response.status);
                    });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

    function getCheckedTimeRanges() {
        const checkboxes = document.querySelectorAll('input[name="time_range[]"]:checked');
        const timeRanges = Array.from(checkboxes).map(checkbox => checkbox.value);
        return timeRanges.join(',');
    }


    function validateForm() {
        var checkboxes = document.querySelectorAll('input[name="time_range[]"]:checked');
        if (checkboxes.length === 0) {
            openAlertFail("Please select at least one time range.");
            return false;
        }
        return true;
    }
});

function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}

document.getElementById("busprofileRegForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const reg_no = document.getElementById("add_bus_reg_no").value;
    const driver_nic = document.getElementById("add_driver_nic").value;
    const conductor_nic = document.getElementById("add_conductor_nic").value;

    const userData = {
        reg_no: reg_no,
        driver_nic: driver_nic,
        conductor_nic: conductor_nic,
    };
    const jsonData = JSON.stringify(userData);

    fetch(`${ url }/busprofileController`, {
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

function updateRow(bus_profile_id) {

    let existingData = {};

    const urlParams = new URLSearchParams(window.location.search);

    document.getElementById("header_bus_profile_id").innerHTML = bus_profile_id

    fetch(`${url}/busprofileController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'bus_profile_id' :bus_profile_id
        },
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    existingData = data[0];
                    document.getElementById("update_bus_reg_no").value = existingData.reg_no;
                    document.getElementById("update_driver_nic").value = existingData.driver_nic;
                    document.getElementById("update_conductor_nic").value = existingData.conductor_nic;
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
    openForm_update();
}

document.getElementById("busprofileUpdateForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const bus_profile_id = document.getElementById("header_bus_profile_id").textContent;
    const reg_no = document.getElementById("update_bus_reg_no").value;
    const driver_nic = document.getElementById("update_driver_nic").value;
    const conductor_nic = document.getElementById("update_conductor_nic").value;

    const userData = {
        reg_no: reg_no,
        driver_nic: driver_nic,
        conductor_nic: conductor_nic,
    };

    const jsonData = JSON.stringify(userData);
    console.log(jsonData);

    fetch(`${ url }/busprofileController`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'bus_profile_id': bus_profile_id
            },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                closeForm_update();
                openAlertSuccess("Successfully");
            } else if (response.status === 401) {
                openAlertFail(response.status);
            } else {
                openAlertFail(response.status);
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

// This function is responsible for handling the deletion of a row in the bus profile table.
 function deleteRow() {
 // Make a DELETE request to the server to delete the bus profile with the specified ID (Bus_profile_id).
     fetch(`${ url }/busprofileController`, {
         method: 'DELETE',
         headers: {
             'Content-Type': 'application/json',
             'bus_profile_id': Bus_profile_id,  // Bus_profile_id should be defined somewhere in your code.
         },
     })
     .then(response => {
         if (response.ok) {
             closeAlert();
             openAlertSuccess("Successfully Deleted!");
         } else if (response.status === 401) {
             closeAlert();
             openAlertFail(response.status);
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
    const existingForm = document.querySelector(".busprofile_add_form_body");
    if (!existingForm) {
        createForm('add');
    }
    document.getElementById("busprofileRegForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_add() {
    document.getElementById("busprofileRegForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openForm_update() {
    const existingForm = document.querySelector(".busprofile_update_form_body");
    if (!existingForm) {
        createForm('update');
    }
    document.getElementById("busprofileUpdateForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_update() {
    document.getElementById("busprofileUpdateForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openAlertSuccess(msg) {
    bus_profile_id = "";
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    bus_profile_id = "";
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_busprofile.html";
}

function openAlertFail(response) {
    bus_profile_id = "";
    document.getElementById("failMsg").textContent = response;
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    bus_profile_id = "";
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_busprofile.html";
}
function closeAlert(){
    bus_profile_id = "";
    document.getElementById("confirmAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
function openFlagConfirm(bus_profile_id){
    Bus_profile_id = bus_profile_id;
    document.getElementById("confirmAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("deleteUser").textContent = Bus_profile_id;
}

document.addEventListener('DOMContentLoaded', function() {
    createForm('add');
    createForm('update');
});

function createForm(action) {
    if(action === 'add'){
        const form_add = document.createElement('div');
        form_add.classList.add('busprofile_add_form_body');

        const form= `
        <div class="busprofile_form_left">
            <div class="form_div">
                <label for="bus_reg_no" class="busprofile_form_title">Bus Registration No<span class="busprofile_form_require">*</span></label>
                <input type="text" name="bus_reg_no" id="bus_reg_no" class="form_data" placeholder="Eg : NB-xxxx" required="required" oninput="showSuggestions1(event)"/>
                <ul id="bus_reg_no_suggestions" class="autocomplete-list"></ul>
            </div>
            <div class="form_div">
                <label for="driver_nic" class="busprofile_form_title">Driver NIC <span class="busprofile_form_require">*</span></label>
                <input type="text" name="driver_nic" id="driver_nic" class="form_data" placeholder="Enter Driver NIC" required="required" oninput="showSuggestions2(event)" />
                <ul id="Driver_nic_suggestions" class="autocomplete-list"></ul>
            </div>
            <div class="form_div">
                <label for="conductor_nic" class="busprofile_form_title">Conductor NIC <span class="busprofile_form_require">*</span></label>
                <input type="text" name="conductor_nic" id="conductor_nic" class="form_data" placeholder="Enter Conductor NIC" required="required" oninput="showSuggestions3(event)"/>
                <ul id="Conductor_nic_suggestions" class="autocomplete-list"></ul>
            </div>
        </div>
        `;

        form_add.innerHTML = form.replace(/id="/g, 'id="add_');
        const formContainer_add = document.getElementById('formContainer_add');
        formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form

    }
    else if(action === 'update'){
        const form_update = document.createElement('div');
        form_update.classList.add('busprofile_update_form_body');

        const form = `
            <div class="busprofile_form_left">
                <div class="form_div">
                    <label for="bus_reg_no" class="busprofile_form_title">Bus Registration No.<span class="busprofile_form_require">*</span></label>
                    <input type="text" name="bus_reg_no" id="bus_reg_no" class="form_data" placeholder="Update Bus Registration No" oninput="showSuggestions4(event)" />
                    <ul id="bus_reg_no_suggestions" class="autocomplete-list"></ul>
                </div>
                <div class="form_div">
                    <label for="driver_nic" class="busprofile_form_title">Driver NIC <span class="busprofile_form_require">*</span></label>
                    <input type="text" name="driver_nic" id="driver_nic" class="form_data" placeholder="Update Driver NIC" oninput="showSuggestions5(event)" />
                    <ul id="Driver_nic_suggestions" class="autocomplete-list"></ul>
                </div>
                <div class="form_div">
                    <label for="conductor_nic" class="busprofile_form_title"> Conductor NIC <span class="busprofile_form_require">*</span></label>
                    <input type="text" name="conductor_nic" id="conductor_nic" class="form_data" placeholder="Update Conductor NIC" oninput="showSuggestions6(event)"/>
                    <ul id="Conductor_nic_suggestions" class="autocomplete-list"></ul>
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
        fetch(`${url}/busController`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'p_id': session_p_id
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
            const suggestions = data.map(item => item.reg_no);
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
function showSuggestions2(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container2`);
    fetch(`${ url }/driverController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'op_id': session_p_id
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
function showSuggestions3(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container3`);
    fetch(`${ url }/conductorController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'op_id': session_p_id
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

function showSuggestions4(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container4`);
    if(inputValue === ""){
        suggestionsContainer.innerHTML = '';
    }
    else {
        fetch(`${url}/busController`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'p_id': session_p_id
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
            const suggestions = data.map(item => item.reg_no);
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
function showSuggestions5(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container5`);
    fetch(`${ url }/driverController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'op_id': session_p_id
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
function showSuggestions6(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container6`);
    fetch(`${ url }/conductorController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'op_id': session_p_id
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

document.getElementById("update_bus_reg_no").addEventListener("input", showSuggestions4);
document.getElementById("update_driver_nic").addEventListener("input", showSuggestions5);
document.getElementById("update_conductor_nic").addEventListener("input", showSuggestions6);


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