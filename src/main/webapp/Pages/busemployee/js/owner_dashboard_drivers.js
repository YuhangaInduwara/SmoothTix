    let driver_id = "";
    let searchOption = "driver_id";
    let currentPage = 1;
    const pageSize = 10;
    let allData = [];

function fetchAllData() {
    fetch(`${url}/driverController`, {
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
                throw new Error('Network response was not ok.');
            }
        })
        .then(data => {
            if (data) {
                allData = data;
                updatePage(currentPage);
            } else {
                console.error('Error: Empty response or invalid JSON');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }

fetchAllData();

function updatePage(page) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    let dataToShow = allData.slice(startIndex, endIndex);
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
function renderPageControl() {
    document.getElementById("page_control").style.display = "flex";
}

function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    const rowCount = data.length;

    if (rowCount === 0) {
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="8">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    if (rowCount >= 10) {
        renderPageControl();
    }

    // Array to store promises
    const fetchPromises = [];

    data.forEach(item => {
        // Push each fetch call as a promise
        fetchPromises.push(
            fetch(`${url}/passengerController`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'p_id': item.p_id,
                },
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Error:', response.status);
                    return null; // Handle error case
                }
            })
            .then(passengerData => {
                // Create a row after fetching passenger data
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${item.driver_id}</td>
                    <td>${item.p_id}</td>
                    <td>${item.license_no}</td>
                    <td>${passengerData ? `${passengerData[0].first_name} ${passengerData[0].last_name}` : 'N/A'}</td>
                    <td>${passengerData ? passengerData[0].nic : 'N/A'}</td>
                    <td>${passengerData ? passengerData[0].email : 'N/A'}</td>
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

                tableBody.appendChild(row);
            })
            .catch(error => {
                console.error('Error:', error);
            })
        );
    });

    // Wait for all promises to resolve
    Promise.all(fetchPromises)
        .then(() => {
            // All fetch calls are completed
            updatePageNumber(currentPage);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.getElementById("driverRegForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const p_id = document.getElementById("add_p_id").value;
    const license_no = document.getElementById("add_license_no").value;
    const review_points = document.getElementById("add_review_points").value;
    const userData = {
        p_id: p_id,
        license_no: license_no,
        review_points: review_points,
    };
    console.log(userData);
    const jsonData = JSON.stringify(userData);
    fetch(`${url}/driverController`, {
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
            } else if (response.status === 401) {
                openAlertFail(response.status);
                console.log('Update unsuccessful');
            } else {
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
function updateRow(driver_id){
    openForm_update();

    let existingData = {};

    const urlParams = new URLSearchParams(window.location.search);

    document.getElementById("header_driver_id").innerHTML = driver_id

    fetch(`${ url }/driverController`, {
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
                    document.getElementById("update_license_no").value = existingData.license_no;
                    document.getElementById("update_review_points").value = existingData.review_points;
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

    document.getElementById("driverUpdateForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const license_no = document.getElementById("update_license_no").value;
        const review_points = document.getElementById("update_review_points").value;

        const updatedData = {
            license_no: license_no,
            review_points: review_points
        };

        const jsonData = JSON.stringify(updatedData);

    fetch(`${ url }/driverController`, {
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
}

function openForm_add(){
    createAddForm();
    document.getElementById("driverRegForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_add() {
    document.getElementById("driverRegForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openForm_update(){
    createUpdateForm();
    document.getElementById("driverUpdateForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_update(){
    document.getElementById("driverUpdateForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
// Create the add form
function createAddForm(){
    const form_add = document.createElement('div');
    form_add.classList.add('driver_add_form_body');

    const form = `
        <div class="driver_form_left">
            <div class="form_div">
                <label for="p_id" class="driver_form_title">Passenger Id <span class="driver_form_require">*</span></label>
                <input type="text" name="p_id" id="p_id" class="form_data" placeholder="Enter the Passenger ID" required="required"/>
            </div>
            <div class="form_div">
                <label for="license_no" class="driver_form_title">Driving License Number <span class="driver_form_require">*</span></label>
                <input type="text" name="license_no" id="license_no" class="form_data" placeholder="Enter driving license no" required="required" />
            </div>
            <div class="form_div">
                <label for="review_points" class="driver_form_title">CONDUCTOR POINTS <span class="driver_form_require">*</span></label>
                <input type="text" name="review_points" id="review_points" class="form_data" placeholder="Enter Driver Points" required="required"/>
            </div>
        </div>
    `;

    form_add.innerHTML = form.replace(/id="/g, 'id="add_');
    const formContainer_add = document.getElementById('formContainer_add');
    formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form
}

// Create the update form
function createUpdateForm() {
    const form_update = document.createElement('div');
    form_update.classList.add('driver_update_form_body');

    const form = `
        <div class="driver_form_left">
            <div class="form_div">
                <label for="license_no" class="driver_form_title">Driving License Number <span class="driver_form_require">*</span></label>
                <input type="text" name="license_no" id="license_no" class="form_data" placeholder=" update driving License Number"  />
            </div>
            <div class="form_div">
                <label for="review_points" class="driver_form_title"> Driver Points <span class="driver_form_require">*</span></label>
                <input type="text" name="review_points" id="review_points" class="form_data" placeholder=" Update Driver Points" />
            </div>
        </div>
    `;

    form_update.innerHTML = form.replace(/id="/g, 'id="update_');
    const formContainer_update = document.getElementById('formContainer_update');
    formContainer_update.appendChild(form_update.cloneNode(true)); // Clone the form
}

function openAlertSuccess(msg) {
    driver_id = "";
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    driver_id = "";
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_drivers.html";
}

function openAlertFail(response) {
    driver_id = "";
    document.getElementById("failMsg").textContent = response;
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    driver_id = "";
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_drivers.html";
}
function closeAlert(){
    driver_id = "";
    document.getElementById("confirmAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
function openFlagConfirm(driver_id){
    Driver_id = driver_id;
    document.getElementById("confirmAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("deleteUser").textContent = driver_id;
}

// Handle delete
function deleteRow() {
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

const searchSelect = document.getElementById("searchSelect");
searchSelect.addEventListener("change", (event) => {
    searchOption = event.target.value;
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

    fetch(`${ url }/driverController`, {
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


