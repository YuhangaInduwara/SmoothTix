let bus_profile_id = "";
let searchOption = "bus_profile_id";
let currentPage = 1;
const pageSize = 10;
let allData = [];
let dataSearch = [];

document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

function refreshPage() {
    location.reload();
}
function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;

    fetch(`${ url }/busprofileController`, {
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
        console.log(data);
        updatePage(currentPage);
    })
    .catch(error => {
        console.error('Error fetching bus data:', error);
    });
}


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
// Display all data
function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    if (data.length === 0) {
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="8">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    // Assuming 'data' now includes all necessary details directly
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

function redirectToFeasibleSchedule(bus_profile_id) {
    if (bus_profile_id) {
        openForm_feasible(bus_profile_id);
    } else {
        console.error('Invalid bus_profile_id:', bus_profile_id);

    }
}
function openForm_feasible(bus_profile_id) {
    const feasibleForm = document.getElementById('feasibleScheduleForm');
    if (feasibleForm) {
        feasibleForm.style.display = 'block';

    const inputForBusProfileId = document.getElementById('inputForBusProfileId');
            if (inputForBusProfileId) {
                // Set the value property
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
document.addEventListener("DOMContentLoaded", function () {
    if (bus_profile_id) {
        document.getElementById('bus_profile_id').innerText = bus_profile_id;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('feasibleScheduleForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm()) {
            const bus_profile_id = document.getElementById("inputForBusProfileId").value;
            const date = document.getElementById("date").value;
            const time_range = getCheckedTimeRanges();

            const formData = {
                bus_profile_id: bus_profile_id,
                date: date,
                time_range: time_range,
            };


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
                    console.log('Success');
                } else {
                    return response.json()
                        .then(data => {
                            const error_msg = data.error;
                            console.log(error_msg);
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


//Add new bus to the database
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
    console.log(userData)
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

// Handle update

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
                    console.log("existingData:", existingData);

                    document.getElementById("update_bus_reg_no").value = existingData.bus_registration_no;
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
    openForm_update(); // Open the update form
}

// Handle form submission for updating bus profile data
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
    console.log(userData);

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


 function deleteRow() {
     fetch(`${ url }/busprofileController`, {
         method: 'DELETE',
         headers: {
             'Content-Type': 'application/json',
             'bus_profile_id': Bus_profile_id,
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

// Create the add and update forms
function createForm(action) {
    if(action === 'add'){
        const form_add = document.createElement('div');
        form_add.classList.add('busprofile_add_form_body');

        const form= `
        <div class="busprofile_form_left">
            <div class="form_div">
                <label for="bus_reg_no" class="busprofile_form_title">Bus Registration No.<span class="busprofile_form_require">*</span></label>
                <input type="text" name="bus_reg_no" id="bus_reg_no" class="form_data" placeholder="Enter Bus Registration No" required="required" oninput="showSuggestions1(event)"/>
                <ul id="bus_reg_no_suggestions" class="autocomplete-list"></ul>
            </div>
            <div class="form_div">
                <label for="driver_nic" class="busprofile_form_title">Driver NIC <span class="busprofile_form_require">*</span></label>
                <input type="text" name="driver_nic" id="driver_nic" class="form_data" placeholder="Enter Driver NIC" required="required" oninput="showSuggestions2(event)" />
                <ul id="Driver_nic_suggestions" class="autocomplete-list"></ul>
            </div>
            <div class="form_div">
                <label for="conductor_nic" class="busprofile_form_title">CONDUCTOR NIC <span class="busprofile_form_require">*</span></label>
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
                    <input type="text" name="bus_reg_no" id="bus_reg_no" class="form_data" placeholder="Update Bus Registration No"  />

                </div>
                <div class="form_div">
                    <label for="driver_nic" class="busprofile_form_title">Driver NIC <span class="busprofile_form_require">*</span></label>
                    <input type="text" name="driver_nic" id="driver_nic" class="form_data" placeholder="Update Driver NIC"  />

                </div>
                <div class="form_div">
                    <label for="conductor_nic" class="busprofile_form_title"> Conductor NIC <span class="busprofile_form_require">*</span></label>
                    <input type="text" name="conductor_nic" id="conductor_nic" class="form_data" placeholder="Update Conductor NIC"/>

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
    const suggestionsContainer = document.getElementById(`autocomplete-container1`);
    fetch(`${ url }/passengerController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'flag': '0',
            'privilege_level': '4',
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
    const suggestionsContainer = document.getElementById(`autocomplete-container1`);
    fetch(`${ url }/passengerController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'flag': '0',
            'privilege_level': '5',
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