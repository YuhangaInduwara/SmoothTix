// Fetch all data from the database
function fetchAllData() {
    fetch('/SmoothTix_war_exploded/busController', {
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

// Display all data
function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    const rowCount = data.length;
    if(rowCount >=10){
        renderPageControl()
    }
    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.bus_id}</td>
            <td>${item.owner_id}</td>
            <td>${item.route}</td>
            <td>${item.engineNo}</td>
            <td>${item.chassisNo}</td>
            <td>${item.noOfSeats}</td>
            <td>${item.manufact_year}</td>
            <td>${item.brand}</td>
            <td>${item.model}</td>
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
    });
}

function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}

// Add new bus to the database
document.getElementById("busRegForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const owner_nic = document.getElementById("add_owner_nic").value;
    const engineNo = document.getElementById("add_engineNo").value;
    const route = document.getElementById("add_route").value;
    const chassisNo = document.getElementById("add_chassisNo").value;
    const noOfSeats = document.getElementById("add_noOfSeats").value;
    const manufact_year = document.getElementById("add_manufact_year").value;
    const brand = document.getElementById("add_brand").value;
    const model = document.getElementById("add_model").value;

    const userData = {
        owner_nic: owner_nic,
        engineNo: engineNo,
        route: route,
        chassisNo: chassisNo,
        noOfSeats: noOfSeats,
        manufact_year: manufact_year,
        brand: brand,
        model: model
    };
    console.log(userData)
    const jsonData = JSON.stringify(userData);

    fetch('../../../busController', {
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
                openAlertFail(response.status);
                console.log('Registration unsuccessful');
            } else {
                openAlertFail(response.status);
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Handle update
function updateRow(bus_id){
    openForm_update();

    let existingData = {};

    const urlParams = new URLSearchParams(window.location.search);

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

// Handle delete
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

function openAlertSuccess() {
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/admin_dashboard_buses.html";
}

function openAlertFail(response) {
    document.getElementById("failMsg").innerHTML = "Operation failed (" + response + ")";
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/admin_dashboard_buses.html";
}

// Create the add and update forms
function createForm() {
    const form_add = document.createElement('div');
    form_add.classList.add('bus_add_form_body');

    const form_update = document.createElement('div');
    form_update.classList.add('bus_update_form_body');

    var form= `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="owner_nic" class="bus_form_title">Owner NIC <span class="bus_form_require">*</span></label>
                <input type="text" name="owner_nic" id="owner_nic" class="form_data" placeholder="Enter Owner NIC" required="required" />
            </div>
            <div class="form_div">
                <label for="route" class="bus_form_title">Route <span class="bus_form_require">*</span></label>
                <input type="text" name="route" id="route" class="form_data" placeholder="Enter Route" required="required" />
            </div>
            <div class="form_div">
                <label for="engineNo" class="bus_form_title">Engine No <span class="bus_form_require">*</span></label>
                <input type="text" name="engineNo" id="engineNo" class="form_data" placeholder="Enter Engine No" required="required" />
            </div>
            <div class="form_div">
                <label for="chassisNo" class="bus_form_title">Chassis No <span class="bus_form_require">*</span></label>
                <input type="text" name="chassisNo" id="chassisNo" class="form_data" placeholder="Enter Chassis No" required="required" />
            </div>
        </div>
        <div class="bus_form_right">
            <div class="form_div">
                <label for="noOfSeats" class="bus_form_title">Number of Seats <span class="bus_form_require">*</span></label>
                <input type="number" name="noOfSeats" id="noOfSeats" class="form_data" placeholder="Enter Number of Seats" required="required" />
            </div>
            <div class="form_div">
                <label for="manufact_year" class="bus_form_title">Manufactured Year <span class="bus_form_require">*</span></label>
                <input type="text" name="manufact_year" id="manufact_year" class="form_data" placeholder="Enter Manufactured Year" required="required" />
            </div>
            <div class="form_div">
                <label for="brand" class="bus_form_title">Brand <span class="bus_form_require">*</span></label>
                <input type="text" name="brand" id="brand" class="form_data" placeholder="Enter Brand" required="required" />
            </div>
            <div class="form_div">
                <label for="model" class="bus_form_title">Model <span class="bus_form_require">*</span></label>
                <input type="text" name="model" id="model" class="form_data" placeholder="Enter Model" required="required" />
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

    fetch('/SmoothTix_war_exploded/busController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'bus_id': searchTerm
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





