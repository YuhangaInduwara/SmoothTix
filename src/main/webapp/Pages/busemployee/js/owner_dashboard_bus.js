let bus_id = "";
let searchOption = "bus_id";
let currentPage = 1;
const pageSize = 10;
let allData = [];

// Fetch all data from the database
function fetchAllData() {
    fetch(`${ url }/busController`, {
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
function updatePage(page) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    let dataToShow= allData.slice(startIndex, endIndex);
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";
    displayDataAsTable(dataToShow);
    updatePageNumber(currentPage);
}

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
                <span class="icon-container">
                    <i onclick="updateRow('${item.bus_id}')"><img src="../../../images/vector_icons/update_icon.png" alt="update" class="action_icon"></i>
                </span>
                <span class="icon-container" style="margin-left: 1px;">
                    <i onclick="openFlagConfirm('${item.bus_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
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


    const userData = {
        bus_id: bus_id,
        owner_id: owner_id,
        reg_no: reg_no,
        route_id: route_id,
        no_of_Seats: no_of_Seats,
        reveiw_points: reveiw_points,
    };
    console.log(userData)
    const jsonData = JSON.stringify(userData);

    fetch(`${ url }/busController`, {
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

                    document.getElementById("update_bus_id").value = existingData.bus_id;
                    document.getElementById("update_owner_id").value = existingData.owner_id;
                    document.getElementById("update_reg_no").value = existingData.reg_no;
                    document.getElementById("update_route_id").value = existingData.route_id;
                    document.getElementById("update_no_of_Seats").value = existingData.no_of_Seats;
                    document.getElementById("update_reveiw_points").value = existingData.reveiw_points;
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


        const updatedData = {
            bus_id: bus_id,
            owner_id: owner_id,
            reg_no: reg_no,
            route_id: route_id,
            no_of_Seats: no_of_Seats,
            reveiw_points: reveiw_points,
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
    fetch(`${ url }/busController`, {
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

    fetch(`${ url }/busController`, {
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


