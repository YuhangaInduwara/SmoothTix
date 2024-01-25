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
            <td>${item.reg_no}</td>
            <td>${item.route_id}</td>
            <td>${item.no_of_Seats}</td>
            <td>${item.reveiw_points}</td>

             <td>

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

    const bus_id = document.getElementById("add_bus_id").value;
    const owner_id = document.getElementById("add_owner_id").value;
    const reg_no = document.getElementById("add_reg_no").value;
    const route_id = document.getElementById("add_route_id").value;
    const no_of_Seats = document.getElementById("add_no_of_Seats").value;
    const reveiw_points = document.getElementById("add_reveiw_points").value;

    const route = document.getElementById("add_route").value;
    const engineNo = document.getElementById("add_engineNo").value;
    const chassisNo = document.getElementById("add_chassisNo").value;
    const noOfSeats = document.getElementById("add_noOfSeats").value;
    const manufact_year = document.getElementById("add_manufact_year").value;
    const brand = document.getElementById("add_brand").value;
    const model = document.getElementById("add_model").value;

    const userData = {
        bus_id: bus_id,
        owner_id: owner_id,
        reg_no: reg_no,
        route_id: route_id,
        no_of_Seats: no_of_Seats,
        reveiw_points: reveiw_points,
        route:route,
        engineNo: engineNo,
        chassisNo: chassisNo,
        noOfSeats: noOfSeats,
        manufact_year: manufact_year,
        brand: brand,
        model: model
    };
    console.log(userData)
    const jsonData = JSON.stringify(userData);

    fetch('/SmoothTix_war_exploded/busController', {
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

    fetch('/SmoothTix_war_exploded/busController', {
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

                    document.getElementById("update_bus_id").value = existingData.bus_id;
                    document.getElementById("update_owner_id").value = existingData.owner_id;
                    document.getElementById("update_reg_no").value = existingData.reg_no;
                    document.getElementById("update_route_id").value = existingData.route_id;
                    document.getElementById("update_no_of_Seats").value = existingData.no_of_Seats;
                    document.getElementById("update_reveiw_points").value = existingData.reveiw_points;
                    document.getElementById("update_route").value = existingData.route;
                    document.getElementById("update_engineNo").value = existingData.engineNo;
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

        const bus_id = document.getElementById("update_bus_id").value;
        const owner_id = document.getElementById("update_owner_id").value;
        const reg_no = document.getElementById("update_reg_no").value;
        const route_id = document.getElementById("update_route_id").value;
        const no_of_Seats = document.getElementById("update_no_of_Seats").value;
        const reveiw_points = document.getElementById("update_reveiw_points").value;

        const route = document.getElementById("update_route").value;
        const engineNo = document.getElementById("update_engineNo").value;
        const chassisNo = document.getElementById("update_chassisNo").value;
        const noOfSeats = document.getElementById("update_noOfSeats").value;
        const manufact_year = document.getElementById("update_manufact_year").value;
        const brand = document.getElementById("update_brand").value;
        const model = document.getElementById("update_model").value;

        const updatedData = {
            bus_id: bus_id,
            owner_id: owner_id,
            reg_no: reg_no,
            route_id: route_id,
            no_of_Seats: no_of_Seats,
            reveiw_points: reveiw_points,
            route:route,
            engineNo: engineNo,
            chassisNo: chassisNo,
            noOfSeats: noOfSeats,
            manufact_year: manufact_year,
            brand: brand,
            model: model
        };

        const jsonData = JSON.stringify(updatedData);

    fetch('/SmoothTix_war_exploded/busController', {
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
    fetch('/SmoothTix_war_exploded/busController', {
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
    window.location.href = "../html/owner_dashboard_bus.html";
}

function openAlertFail(response) {
    document.getElementById("failMsg").innerHTML = "Operation failed (" + response + ")";
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_bus.html";
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
                <label for="bus_id" class="bus_form_title">Bus Id <span class="bus_form_require">*</span></label>
                <input type="text" name="bus_id" id="bus_id" class="form_data" placeholder="Enter the Bus ID" required="required" />
            </div>
            <div class="form_div">
                <label for="owner_id" class="bus_form_title">Owner NIC <span class="reg_form_require">*</span></label>
                <input type="text" name="owner_id" id="owner_id" class="form_data" placeholder="Enter Owner NIC" required="required" />
            </div>
            <div class="form_div">
                <label for="reg_no" class="bus_form_title">Registration No <span class="bus_form_require">*</span></label>
                <input type="text" name="reg_no" id="reg_no" class="form_data" placeholder="Enter Registration No" required="required" />
                 <label for="route" class="bus_form_title">Route<span class="reg_form_require">*</span></label>
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
                <label for="route_id" class="bus_form_title">Route Id <span class="bus_form_require">*</span></label>
                <input type="text" name="route_id" id="route_id" class="form_data" placeholder="Enter Route_id" required="required" />
            </div>
            <div class="form_div">
                <label for="no_of_Seats" class="bus_form_title">Number of Seats <span class="bus_form_require">*</span></label>
                <input type="number" name="no_of_Seats" id="no_of_Seats" class="form_data" placeholder="Enter Number of Seats" required="required" />
            </div>
            <div class="form_div">
                <label for="reveiw_points" class="bus_form_title">Reveiw Points <span class="bus_form_require">*</span></label>
                <input type="text" name="reveiw_points" id="reveiw_points" class="form_data" placeholder="Enter Reveiw points" required="required" />
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


