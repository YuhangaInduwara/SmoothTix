let timeKpr_id = "";
let currentPage = 1;
const pageSize = 10;
let allData = [];
let dataSearch = [];
let searchOption = 'timekpr_id';

document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

function refreshPage() {
    location.reload();
}

function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;
    fetch(`${ url }/timekeeperController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
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

fetchAllData();

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
                            <td>${item.timekpr_id}</td>
                            <td>${item.stand}</td>
                            <td>${existingData.first_name} ${existingData.last_name}</td>
                            <td>${existingData.nic}</td>
                            <td>${existingData.email}</td>
                            <td>
                                <span class="icon-container">
                                    <i onclick="updateRow('${item.timekpr_id}')"><img src="../../../images/vector_icons/update_icon.png" alt="update" class="action_icon"></i>
                                </span>
                                <span class="icon-container" style="margin-left: 1px;">
                                    <i onclick="openFlagConfirm('${item.timekpr_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
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

document.getElementById("busRegForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const nic = document.getElementById("add_nic").value;
    const stand = document.getElementById("add_stand").value.toLowerCase();
    console.log(nic)
    const userData = {
        nic: nic,
        stand: stand,
    };
    const jsonData = JSON.stringify(userData);
    console.log("test: "+jsonData)

    fetch(`${ url }/timekeeperController`, {
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

function createForm(action) {
    if(action === 'add'){
        const form_add = document.createElement('div');
        form_add.classList.add('bus_add_form_body');

        const form= `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="nic" class="bus_form_title">NIC<span class="bus_form_require">*</span></label>
                <input type="text" name="nic" id="nic" class="form_data" placeholder="Enter NIC" required="required" oninput="showSuggestions1(event)"/>
                <ul id="nic_suggestions" class="autocomplete-list"></ul>
            </div>
            <div class="form_div">
                <label for="stand" class="bus_form_title">Bus Stand<span class="bus_form_require">*</span></label>
                <input type="text" name="stand" id="stand" class="form_data" placeholder="Enter the Bus Stand" required="required" oninput="showSuggestions2(event)"/>
                <ul id="stand_suggestions" class="autocomplete-list"></ul>
            </div>
        </div>
        `;

        form_add.innerHTML = form.replace(/id="/g, 'id="add_');
        const formContainer_add = document.getElementById('formContainer_add');
        formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form
        //
        // showSuggestions1({ target: document.getElementById('nic_suggestions') });
        // showSuggestions2({ target: document.getElementById('stand_suggestions') });
    }
    else if(action === 'update'){
        const form_update = document.createElement('div');
        form_update.classList.add('bus_update_form_body');

        const form= `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="nic" class="bus_form_title">NIC<span class="bus_form_require">*</span></label>
                <input type="text" name="nic" id="nic" class="form_data" placeholder="Enter NIC" required="required" disabled/>
            </div>
            <div class="form_div">
                <label for="stand" class="bus_form_title">Bus Stand<span class="bus_form_require">*</span></label>
                <input type="text" name="stand" id="stand" class="form_data" placeholder="Enter the Bus Stand" required="required" oninput="showSuggestions3(event)"/>
                <ul id="stand_suggestions" class="autocomplete-list"></ul>
            </div>
        </div>
        `;

        form_update.innerHTML = form.replace(/id="/g, 'id="update_');
        const formContainer_update = document.getElementById('formContainer_update');
        formContainer_update.appendChild(form_update.cloneNode(true)); // Clone the form

        // showSuggestions3({ target: document.getElementById('stand_suggestions') });
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
        fetch(`${url}/passengerController`, {
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
}

function showSuggestions2(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container2`);
    if(inputValue === ""){
        suggestionsContainer.innerHTML = '';
    }
    else {
        fetch(`${url}/routeController?request_data=stand_list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
                const suggestions = data.map(item => item.stand_list);
                suggestionsContainer.innerHTML = '';
                const filteredSuggestions = suggestions.filter(suggestion =>
                    suggestion.toUpperCase().includes(inputValue)
                );
                console.log(filteredSuggestions)
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

function showSuggestions3(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container3`);
    if(inputValue === ""){
        suggestionsContainer.innerHTML = '';
    }
    else {
        fetch(`${url}/routeController?request_data=stand_list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
                const suggestions = data.map(item => item.stand_list);
                suggestionsContainer.innerHTML = '';
                const filteredSuggestions = suggestions.filter(suggestion =>
                    suggestion.toUpperCase().includes(inputValue)
                );
                console.log(filteredSuggestions)
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

function updateRow(timekpr_id){
    console.log("test1: " + timekpr_id)
    openForm_update();

    let existingData = {};
    new URLSearchParams(window.location.search);
    document.getElementById("header_bus_id").innerHTML = timekpr_id

    fetch(`${ url }/timekeeperController?timekpr_id=${timekpr_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    existingData = data[0];
                    console.log("existingData:", existingData);
                    document.getElementById("update_nic").value = existingData.p_id;
                    document.getElementById("update_stand").value = existingData.stand;
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

        const stand = document.getElementById("update_stand").value;

        const updatedData = {
            stand: stand,
            timekpr_id: timekpr_id,
        };

        const jsonData = JSON.stringify(updatedData);
        console.log(jsonData)

        fetch(`${ url }/timekeeperController?timekpr_id=${timekpr_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData
        })
            .then(response => {
                if (response.ok) {
                    closeForm_update();
                    openAlertSuccess("Successfully Updated!");
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

function deleteRow(){
    fetch(`${ url }/timekeeperController`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'timekpr_id': timeKpr_id
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
    const existingForm = document.querySelector(".bus_add_form_body");
    if (!existingForm) {
        createForm('add');
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
        createForm('update');
    }
    document.getElementById("busUpdateForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_update() {
    document.getElementById("busUpdateForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openAlertSuccess(msg) {
    timeKpr_id = "";
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    timeKpr_id = "";
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/admin_dashboard_timekeepers.html";
}

function openAlertFail(response) {
    timeKpr_id = "";
    document.getElementById("failMsg").textContent = response;
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    timeKpr_id = "";
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openFlagConfirm(timekpr_id){
    timeKpr_id = timekpr_id;
    document.getElementById("confirmAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("deleteUser").textContent = timekpr_id;
}

function closeAlert(){
    timeKpr_id = "";
    document.getElementById("confirmAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
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