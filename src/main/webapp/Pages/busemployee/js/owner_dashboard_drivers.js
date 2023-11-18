// Fetch all data from the database
function fetchAllData() {
    fetch('../../../driverController', {
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
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
            <td>${item.driver_id}</td>
            <td>${item.passenger_id}</td>
            <td>${item.licence_no}</td>
            <td>${item.name}</td>
            <td>${item.nic}</td>
            <td>${item.mobile}</td>
            <td>${item.email}</td>
            <td>${item.points}</td>

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

// Add new driver to the database
document.getElementById("busRegForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const driver_id = document.getElementById("add_driver_id").value;
    const passenger_id = document.getElementById("add_passenger_id").value;
    const licence_no = document.getElementById("add_licence_no").value;
    const name = document.getElementById("add_name").value;
    const nic = document.getElementById("add_nic").value;
    const mobile = document.getElementById("add_mobile").value;
    const email = document.getElementById("add_email").value;
    const points = document.getElementById("add_points").value;

    const userData = {
        driver_id: driver_id,
        passenger_id: passenger_id,
        licence_no: licence_no,
        name: name,
        nic: nic,
        mobile: mobile,
        email: email,
        points: points
    };
    console.log(userData)
    const jsonData = JSON.stringify(userData);

    fetch('../../../driverController', {
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
function updateRow(driver_id){
    openForm_update();

    let existingData = {};

    const urlParams = new URLSearchParams(window.location.search);

    document.getElementById("header_driver_id").innerHTML = driver_id
0
    fetch('../../../driverController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'driver_id': driver_id
        },
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    existingData = data[0];
                    console.log("existingData:", existingData);

                    document.getElementById("update_driver_id").value = existingData.driver_id;
                    document.getElementById("update_passenger_id").value = existingData.passenger_id;
                    document.getElementById("update_license_no").value = existingData.license_no;
                    document.getElementById("update_name").value = existingData.name;
                    document.getElementById("update_nic").value = existingData.nic;
                    document.getElementById("update_mobile").value = existingData.mobile;
                    document.getElementById("update_email").value = existingData.email;
                    document.getElementById("update_points").value = existingData.points;
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

        const driver_id = document.getElementById("update_driver_id").value;
        const passenger_id = document.getElementById("update_passenger_id").value;
        const license_no = document.getElementById("update_license_no").value;
        const name = document.getElementById("update_name").value;
        const nic = document.getElementById("update_nic").value;
        const mobile = document.getElementById("update_mobile").value;
        const email = document.getElementById("update_email").value;
        const points = document.getElementById("update_points").value;

        const updatedData = {
            driver_id: driver_id,
            passenger_id: passenger_id,
            license_no: license_no,
            name: name,
            nic: nic,
            mobile: mobile,
            email: email,
            points: points
        };

        const jsonData = JSON.stringify(updatedData);

        fetch(`../../../driverController`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'driver_id': driver_id
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
function deleteRow(driver_id){
    fetch(`../../../driverController`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'driver_id': driver_id
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
    window.location.href = "../html/owner_dashboard_drivers.html";
}

function openAlertFail(response) {
    document.getElementById("failMsg").innerHTML = "Operation failed (" + response + ")";
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_drivers.html";
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
                <label for="driver_id" class="bus_form_title">Driver ID <span class="bus_form_require">*</span></label>
                <input type="text" name="driver_id" id="driver_id" class="form_data" placeholder="Enter Driveri d" required="required" />
            </div>
            <div class="form_div">
                <label for="passenger_id" class="bus_form_title">Passenger ID <span class="bus_form_require">*</span></label>
                <input type="text" name="passenger_id" id="passenger_id" class="form_data" placeholder="Enter Passenger Id" required="required" />
            </div>
            <div class="form_div">
                <label for="license_no" class="bus_form_title">Driving License Number <span class="bus_form_require">*</span></label>
                <input type="text" name="license_no" id="license_no" class="form_data" placeholder="Enter driving license no" required="required" />
            </div>
            <div class="form_div">
                <label for="name" class="bus_form_title">Name <span class="bus_form_require">*</span></label>
                <input type="text" name="name" id="name" class="form_data" placeholder="Enter name" required="required" />
            </div>
        </div>
        <div class="bus_form_right">
            <div class="form_div">
                <label for="nic" class="bus_form_title">NIC <span class="bus_form_require">*</span></label>
                <input type="number" name="nic" id="nic" class="form_data" placeholder="Enter NIC" required="required" />
            </div>
            <div class="form_div">
                <label for="mobile" class="bus_form_title">Mobile number <span class="bus_form_require">*</span></label>
                <input type="text" name="mobile" id="mobile" class="form_data" placeholder="Enter mobile number" required="required" />
            </div>
            <div class="form_div">
                <label for="email" class="bus_form_title">Email <span class="bus_form_require">*</span></label>
                <input type="text" name="email" id="email" class="form_data" placeholder="Enter email" required="required" />
            </div>
            <div class="form_div">
                <label for="points" class="bus_form_title">Points <span class="bus_form_require">*</span></label>
                <input type="text" name="points" id="points" class="form_data" placeholder="Enter points" required="required" />
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

    fetch('../../../driverController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'driver_id': searchTerm
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





