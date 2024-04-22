let Conductor_id = "";
let searchOption = "conductor_id";
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
    fetch(`${ url }/conductorController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'cp_id': session_p_id,
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
            console.log(allData);
            console.log(currentPage);
            currentPage = 1;
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
    console.log('Attempting to change from page ' + currentPage + ' to ' + newPage);
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

        fetch(`${ url }/passengerController`, {
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
                            <td>${item.conductor_id}</td>
                            <td>${existingData.first_name} ${existingData.last_name}</td>
                            <td>${existingData.nic}</td>
                            <td>${existingData.email}</td>
                            <td>${item.review_points}</td>
                            <td>
                                <span class="icon-container" style="margin-left: 1px;">
                                  <i onclick="openFlagConfirm('${item.conductor_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
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

//
document.getElementById("conductorForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nic = document.getElementById("add_nic").value;

    const userData = {
        nic: nic,
    };
    console.log(userData);
    const jsonData = JSON.stringify(userData);
    console.log(session_p_id);

    fetch(`${url}/conductorController`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id
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

// Handle delete
function deleteRow(){
    fetch(`${url}/conductorController`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'conductor_id': Conductor_id
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
    const existingForm = document.querySelector(".conductor_add_form_body");

    if (!existingForm) {
        createForm('add');
    }

    document.getElementById("conductorForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_add() {
    document.getElementById("conductorForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}


function openAlertSuccess(msg) {
    conductor_id = "";
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    conductor_id = "";
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/owner_dashboard_conductor.html";
}

function openAlertFail() {
    conductor_id = "";
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    conductor_id = "";
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openFlagConfirm(conductor_id){
    Conductor_id = conductor_id;
    document.getElementById("confirmAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("deleteUser").textContent = Conductor_id;
}
function closeAlert(){
    conductor_id = "";
    document.getElementById("confirmAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function createForm(action) {
    if(action === 'add'){
        const form_add = document.createElement('div');
        form_add.classList.add('conductor_add_form_body');

        const form= `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="nic" class="conductor_form_title">NIC<span class="conductor_form_require">*</span></label>
                <input type="text" name="nic" id="nic" class="form_data" placeholder="Enter NIC" required="required" oninput="showSuggestions1(event)"/>
                <ul id="nic_suggestions" class="autocomplete-list"></ul>
            </div>

        </div>
        `;

        form_add.innerHTML = form.replace(/id="/g, 'id="add_');
        const formContainer_add = document.getElementById('formContainer_add');
        formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form

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


// Attach the searchData function to the keyup event of the search input field
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);

// Handle search
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





