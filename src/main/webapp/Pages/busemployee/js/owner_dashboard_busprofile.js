let bus_profile_id = "";
let searchOption = "bus_profile_id";
let currentPage = 1;
const pageSize = 10;
let allData = [];

function fetchAllData() {
    fetch(`${ url }/busprofileController`, {
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
            displayDataAsTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

fetchAllData();


function updatePage(page) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    let dataToShow= allData.slice(startIndex, endIndex);
    const tableBody = document.querySelector("#dataTable tbody");
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
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
                    <td>${item.bus_profile_id}</td>
                    <td>${item.bus_id}</td>
                    <td>${item.driver_id}</td>
                    <td>${item.conductor_id}</td>
                    <td>
                        <span class="icon-container">
                            <i onclick="updateRow('${item.bus_profile_id}')"><img src="../../../images/vector_icons/update_icon.png" alt="update" class="action_icon"></i>
                        </span>
                        <span class="icon-container" style="margin-left: 1px;">
                            <i onclick="deleteRow('${item.bus_profile_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
                        </span>
                    </td>
                   <td>
                       <button class="feasible-schedule-btn" onclick="redirectToFeasibleSchedule('${item.bus_id}')">Feasible Schedule</button>
                   </td>
                `;
        tableBody.appendChild(row);
    });
}

function redirectToFeasibleSchedule(busProfileId) {
    window.location.href = `feasible_schedule.html?busProfileId=${busProfileId}`;
}


function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}
//Add new bus to the database
document.getElementById("busprofileRegForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const bus_profile_id = document.getElementById("add_bus_profile_id").value;
    const bus_id = document.getElementById("add_bus_id").value;
    const driver_id = document.getElementById("add_driver_id").value;
    const conductor_id = document.getElementById("add_conductor_id").value;

    const userData = {
        bus_profile_id: bus_profile_id,
        bus_id: bus_id,
        driver_id: driver_id,
        conductor_id: conductor_id,

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
                openAlertSuccess();
            } else if (response.status === 401) {
                openAlertFail();
                console.log('operation unsuccessful');
            } else {
                openAlertFail();
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Handle update
function updateRow(bus_profile_id){
    openForm_update();

    let existingData = {};

    const urlParams = new URLSearchParams(window.location.search);

    document.getElementById("header_bus_profile_id").innerHTML = bus_profile_id

    fetch(`${ url }/busprofileController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'bus_profile_id': bus_profile_id
        },
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    existingData = data[0];
                    console.log("existingData:", existingData);

                    document.getElementById("update_bus_profile_id").value = existingData.bus_profile_id;
                    document.getElementById("update_bus_id").value = existingData.bus_id;
                    document.getElementById("update_driver_id").value = existingData.driver_id;
                    document.getElementById("update_conductor_id").value = existingData.conductor_id;

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

    document.getElementById("busprofileUpdateForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const bus_profile_id = document.getElementById("update_bus_profile_id").value;
        const bus_id = document.getElementById("update_bus_id").value;
        const driver_id = document.getElementById("update_driver_id").value;
        const conductor_id = document.getElementById("update_conductor_id").value;

        const updatedData = {
            bus_profile_id: bus_profile_id,
            bus_id: bus_id,
            driver_id: driver_id,
            conductor_id: conductor_id,
        };

        const jsonData = JSON.stringify(updatedData);

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

// Handle delete
function deleteRow(bus_profile_id){
    fetch(`${ url }/busprofileController`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'bus_profile_id': bus_profile_id
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
    const existingForm = document.querySelector(".busprofile_add_form_body");

    if (!existingForm) {
        createForm();
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
        createForm();
    }

    document.getElementById("busprofileUpdateForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_update() {
    document.getElementById("busprofileUpdateForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openAlertSuccess() {
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_busprofile.html";
}

function openAlertFail() {
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_busprofile.html";
}

// Create the add and update forms
function createForm() {
    const form_add = document.createElement('div');
    form_add.classList.add('busprofile_add_form_body');

    const form_update = document.createElement('div');
    form_update.classList.add('busprofile_update_form_body');

    var form= `
        <div class="busprofile_form_left">
            <div class="form_div">
                <label for="bus_profile_id" class="busprofile_form_title">Bus profile Id <span class="busprofile_form_require">*</span></label>
                <input type="text" name="bus_profile_id" id="bus_profile_id" class="form_data" placeholder="Enter Bus profile ID" required="required" />
            </div>
            <div class="form_div">
                <label for="bus_id" class="busprofile_form_title">Bus Id <span class="busprofile_form_require">*</span></label>
                <input type="text" name="bus_id" id="bus_id" class="form_data" placeholder="Enter Bus Id" required="required" />
            </div>
            <div class="form_div">
                <label for="driver_id" class="busprofile_form_title">Driver ID <span class="busprofile_form_require">*</span></label>
                <input type="text" name="driver_id" id="driver_id" class="form_data" placeholder="Enter Driver ID" required="required" />
            </div>
            <div class="form_div">
                <label for="conductor_id" class="busprofile_form_title">Conductor ID<span class="busprofile_form_require">*</span></label>
                <input type="text" name="conductor_id" id="conductor_id" class="form_data" placeholder="Enter Conductor ID" required="required" />
            </div>
        </div>
        `;

    form_add.innerHTML = form.replace(/id="/g, 'id="add_');
    form_update.innerHTML = form.replace(/id="/g, 'id="update_');
    const formContainer_add = document.getElementById('formContainer_add');
    const formContainer_update = document.getElementById('formContainer_update');

    formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form
    formContainer_update.appendChild(form_update.cloneNode(true)); // Clone the form
}

const searchSelect = document.getElementById("searchSelect");
searchSelect.addEventListener("change", (event) => {
    searchOption = event.target.value;
    console.log(searchOption)
});

// Attach the searchData function to the keyup event of the search input field
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);

// Handle search
function searchData() {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";

    const searchTerm = document.getElementById("searchInput").value;

    if (searchTerm.trim() === "") {
        fetchAllData();
        return;
    }

    fetch(`${ url }/busprofileController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            [searchOption]: searchTerm
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
            displayDataAsTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}





