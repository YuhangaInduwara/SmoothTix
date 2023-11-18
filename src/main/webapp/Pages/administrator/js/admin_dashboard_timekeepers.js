let timeKpr_id = "";
let searchOption = "timekpr_id";
let currentPage = 1;
const pageSize = 10;
let allData = [];

function fetchAllData() {
    fetch('/SmoothTix_war_exploded/timeKprController', {
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
    if (currentPage !== newPage) {
        currentPage = Math.max(1, newPage);
        updatePage(currentPage, false);
    }
}

function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    const rowCount = data.length;
    let existingData = {};
    console.log(rowCount)
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
                            <td>${item.timekpr_id}</td>
                            <td>${existingData.p_id}</td>
                            <td>${existingData.first_name} ${existingData.last_name}</td>
                            <td>${existingData.nic}</td>
                            <td>${existingData.email}</td>
                            <td>
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
    const userData = {
        nic: nic,
    };
    const jsonData = JSON.stringify(userData);
    fetch('../../../timeKprController', {
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
                        throw new Error("Login failed");
                    });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function createForm() {
    const form_add = document.createElement('div');
    form_add.classList.add('bus_add_form_body');

    const form_update = document.createElement('div');
    form_update.classList.add('bus_update_form_body');

    const form= `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="nic" class="bus_form_title">NIC<span class="bus_form_require">*</span></label>
                <input type="text" name="nic" id="nic" class="form_data" placeholder="Enter NIC" required="required" oninput="showSuggestions(event)"/>
                <ul id="nic_suggestions" class="autocomplete-list"></ul>
            </div>
        </div>
        `;

    form_add.innerHTML = form.replace(/id="/g, 'id="add_');
    form_update.innerHTML = form.replace(/id="/g, 'id="update_');
    const formContainer_add = document.getElementById('formContainer_add');

    formContainer_add.appendChild(form_add.cloneNode(true));
    showSuggestions({ target: document.getElementById('add_nic') });
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

function deleteRow(){
    fetch(`/SmoothTix_war_exploded/timeKprController`, {
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

const searchSelect = document.getElementById("searchSelect");
searchSelect.addEventListener("change", (event) => {
    searchOption = event.target.value;
    console.log(searchOption)
});

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);

function searchData() {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";

    const searchTerm = document.getElementById("searchInput").value;

    if (searchTerm.trim() === "") {
        fetchAllData();
        return;
    }

    fetch('/SmoothTix_war_exploded/timeKprController', {
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