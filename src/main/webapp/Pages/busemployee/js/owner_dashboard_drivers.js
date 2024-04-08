let Driver_id = "";
let searchOption = "driver_id";
let currentPage = 1;
const pageSize = 10;
let dataSearch = [];
let allData = [];

document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

function refreshPage() {
    location.reload();
}

function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;
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
            }
        })
        .then(data => {
            allData = data;
            console.log(allData)
            updatePage(currentPage, false);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function updatePage(page, search) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const tableBody = document.querySelector("#dataTable tbody");

    let dataToShow;
    if(search){
        console.log("hello: " + dataSearch)
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
function renderPageControl() {
    document.getElementById("page_control").style.display = "flex";
}

function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    const rowCount = data.length;
    let existingData = {};
    if (rowCount === 0) {
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="7">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    if (rowCount >= 10) {
        renderPageControl();
    }
    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
        `;

        fetch(`${url}/passengerController`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'p_id': item.p_id,
            },
        })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    existingData = data[0];
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

        tableBody.appendChild(row);
    });
}

function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}

document.getElementById("driverRegForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const nic = document.getElementById("add_nic").value;
    const license_no = document.getElementById("add_license_no").value;
    const review_points = document.getElementById("add_review_points").value;
    console.log(nic)
    const userData = {
        nic: nic,
        license_no: license_no,
        review_points: review_points,
    };
    const jsonData = JSON.stringify(userData);
    console.log("test: "+jsonData)

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

createForm('add');
createForm('update');

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
    const existingForm = document.querySelector(".driver_add_form_body");
    if (!existingForm) {
        createForm('add');
    }
    document.getElementById("driverRegForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_add() {
    document.getElementById("driverRegForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openForm_update(){
    const existingForm = document.querySelector(".driver_update_form_body");
    if (!existingForm) {
        createForm('update');
    }
    document.getElementById("driverUpdateForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_update(){
    document.getElementById("driverUpdateForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function createForm(action) {
    if(action === 'add'){
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
//        showSuggestions1({ target: document.getElementById('nic_suggestions') });

    }
    else if(action === 'update'){
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
}
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


