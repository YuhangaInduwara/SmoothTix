let driver_id = "";
let searchOption = "driver_id";
let currentPage = 1;
const pageSize = 10;
let allData = [];

function fetchAllData() {
    fetch('/SmoothTix_war_exploded/driverController', {
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
        })
        .then(data => {
            allData = data;
            updatePage(currentPage);
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
        `;

        fetch('../../../passengerController', {
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
                                <td>${existingData.p_id}</td>
                                <td>${item.license_no}</td>
                                <td>${item.review_points}</td>
                                <td>
                                    <span class="icon-container">
                                        <i class="fas fa-pencil-alt" style="color: #ff0202" onclick="updateRow('${item.driver_id}')"></i>
                                    </span>
                                    <span class="icon-container" style="margin-left: 10px;"> <!-- Adjust the margin as needed -->
                                        <i class="fas fa-trash-alt" style="color: #ff0202" onclick="deleteRow('${item.driver_id}')"></i>
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

//
document.getElementById("driverForm").addEventListener("submit", function(event) {
    event.preventDefault();

//    const driver_id = document.getElementById("add_driver_id").value;
    const p_id = document.getElementById("add_p_id").value;
//    const license_no = document.getElementById("add_license_no").value;
//    const review_points = document.getElementById("add_review_points").value;

    const userData = {
//        driver_id: driver_id,
        p_id: p_id,
//        license_no :license_no,
//        review_points: review_points,
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
function updateRow(driver_id){
    openForm_update();

    let existingData = {};

    const urlParams = new URLSearchParams(window.location.search);

    document.getElementById("header_driver_id").innerHTML = driver_id

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
            license_no :license_no,
            review_points: review_points,

        };

        const jsonData = JSON.stringify(updatedData);

    fetch('../../../driverController', {
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
function deleteRow(){
    fetch(`/SmoothTix_war_exploded/driverController`, {
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
    const existingForm = document.querySelector(".driver_add_form_body");
    if (!existingForm) {
        createForm();
    }

    document.getElementById("driverForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_add() {
    document.getElementById("driverForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openForm_update() {
    const existingForm = document.querySelector(".driver_update_form_body");

    if (!existingForm) {
        createForm();
    }

    document.getElementById("driverUpdateForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_update() {
    document.getElementById("driverUpdateForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openAlertSuccess(msg) {
    driver_id = "";
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
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

// Create the add and update forms
function createForm() {
    const form_add = document.createElement('div');
    form_add.classList.add('driver_add_form_body');

    const form_update = document.createElement('div');
    form_update.classList.add('driver_update_form_body');

    var form= `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="driver_id" class="driver_form_title">Driver Id <span class="driver_form_require">*</span></label>
                <input type="text" name="driver_id" id="driver_id" class="form_data" placeholder="Enter the Driver ID" required="required"  />
            </div>
            <div class="form_div">
                <label for="p_id" class="driver_form_title">Passenger Id <span class="driver_form_require">*</span></label>
                <input type="text" name="p_id" id="p_id" class="form_data" placeholder="Enter the Passenger ID" required="required" oninput="showSuggestions(event)" />
                <ul id="p_id_suggestions" class="autocomplete-list"></ul>
            </div>
            <div class="form_div">
                <label for="license_no" class="driver_form_title">License No. <span class="driver_form_require">*</span></label>
                <input type="text" name="license_no" id="license_no" class="form_data" placeholder="Enter the License No." required="required" />
            </div>
            <div class="form_div">
                <label for="review_points" class="driver_form_title">CONDUCTOR POINTS <span class="driver_form_require">*</span></label>
                <input type="text" name="review_points" id="review_points" class="form_data" placeholder="Enter Driver Points" required="required"/>
            </div>
        </div>
        `;

    form_add.innerHTML = form.replace(/id="/g, 'id="add_');
    form_update.innerHTML = form.replace(/id="/g, 'id="update_');
    const formContainer_add = document.getElementById('formContainer_add');
    const formContainer_update = document.getElementById('formContainer_update');

    formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form
    formContainer_update.appendChild(form_update.cloneNode(true)); // Clone the form
    howSuggestions({ target: document.getElementById('add_p_id') });
}

function showSuggestions(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container`);
    fetch('/SmoothTix_war_exploded/passengerController', {
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
            const suggestions = data.map(item => item.p_id);
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





