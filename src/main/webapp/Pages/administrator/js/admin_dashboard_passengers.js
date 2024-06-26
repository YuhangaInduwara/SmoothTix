let toBeFlagged = ""
let currentFlag = false
let currentPage = 1;
let currentFlagPage = 1;
const pageSize = 10;
let normalData = [];
let flagData = [];
let normalDataSearch = [];
let flagDataSearch = [];
let searchOption = 'p_id';

// session management (authentication and authorization)
document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAndDisplayData(false));
});

// refresh the page
function refreshPage() {
    location.reload();
}

// get all passenger data from database
async function fetchAndDisplayData(flag) {
    try {
        document.getElementById("userName").textContent = session_user_name;
        const url_fetch = `${ url }/passengerController`;
        const response = await fetch(url_fetch, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'flag': flag,
            },
        });

        if (!response.ok) {
            console.log(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (flag) {
            flagData = data;
        } else {
            normalData = data;
        }

        updatePage(flag ? currentFlagPage : currentPage, flag, false);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// create data chunks for each page and call display function for each of them
function updatePage(page, flag, search) {
    const tableBody = document.querySelector(flag ? "#flagTable tbody" : "#dataTable tbody");
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    let dataToShow;
    if(search){
        const data = flag ? flagDataSearch : normalDataSearch;
        dataToShow = data.slice(startIndex, endIndex);
    }
    else{
        const data = flag ? flagData : normalData;
        dataToShow = data.slice(startIndex, endIndex);
    }

    tableBody.innerHTML = "";
    displayDataAsTable(dataToShow, flag);
    flag ? updateFlagPageNumber(currentFlagPage) : updatePageNumber(currentPage);
}

// update the page number on page control icons for non flagged page
function updatePageNumber(page) {
    document.getElementById("currentPageNumber").textContent = page;
}

// update the page number on page control icons for flagged page
function updateFlagPageNumber(page) {
    document.getElementById("flag_currentPageNumber").textContent = page;
}

// event listeners for page control buttons
const prevPageIcon = document.getElementById("prevPageIcon");
prevPageIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    changePage(currentPage - 1, false);
}, true);

const nextPageIcon = document.getElementById("nextPageIcon");
nextPageIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    changePage(currentPage + 1, false);
}, true);

const flag_prevPageIcon = document.getElementById("flag_prevPageIcon");
flag_prevPageIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    changePage(currentFlagPage - 1, true);
}, true);

const flag_nextPageIcon = document.getElementById("flag_nextPageIcon");
flag_nextPageIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    changePage(currentFlagPage + 1, true);
}, true);

// change the page number
function changePage(newPage, isFlag) {
    const data = getDataForPage(newPage, isFlag);

    if (isFlag ? currentFlagPage !== newPage : currentPage !== newPage) {
        if (data.length > 0) {
            isFlag ? (currentFlagPage = Math.max(1, newPage)) : (currentPage = Math.max(1, newPage));
            isFlag ? (document.getElementById("flag_nextPageIcon").style.opacity = "1") : (document.getElementById("nextPageIcon").style.opacity = "1");
            updatePage(isFlag ? currentFlagPage : currentPage, isFlag);
        } else {
            isFlag ? (document.getElementById("flag_nextPageIcon").style.opacity = "0.5") : (document.getElementById("nextPageIcon").style.opacity = "0.5");
        }
    }
}

// select among flag and non flag pages
function getDataForPage(page, flag) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return flag ? flagData.slice(startIndex, endIndex) : normalData.slice(startIndex, endIndex);
}

// display chunked data on the UI
function displayDataAsTable(data, flag) {
    let tableBody = ""
    if (flag === true) {
        tableBody = document.querySelector("#flagTable tbody");
    } else {
        tableBody = document.querySelector("#dataTable tbody");
    }

    const rowCount = data.length;
    // check for empty pages
    if (rowCount === 0) {
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="6">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    // display page controls if row count is greater than 10
    if (rowCount >= 10) {
        renderPageControl(flag)
    }

    data.forEach(item => {
        if (!item.flag) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.p_id}</td>
                <td>${item.first_name} ${item.last_name}</td>
                <td>${item.nic}</td>
                <td>${item.email}</td>
                <td>${mapPrivilegeLevel(item.privilege_level)}</td>
                <td>
                  <span class="icon-container">
                    <i onclick="openFlagConfirm('${item.p_id}','${item.flag}')">
                      <img src="../../../images/vector_icons/flag_icon.png" 
                           alt="flag" 
                           class="action_icon">
                    </i>
                  </span>
                </td>

            `;

            tableBody.appendChild(row);
        } else if (item.flag) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.p_id}</td>
                <td>${item.first_name} ${item.last_name}</td>
                <td>${item.nic}</td>
                <td>${item.email}</td>
                <td>${mapPrivilegeLevel(item.privilege_level)}</td>
                <td>
                    <span class="icon-container">
                        <i onclick="openFlagConfirm('${item.p_id}','${item.flag}')"><img src="../../../images/vector_icons/unflag_icon.png" alt="unflag" class="action_icon"></i>
                    </span>
                </td>
            `;

            tableBody.appendChild(row);
        }
    });
}

// display page control icons according to flag or non flag
function renderPageControl(flag) {
    if (flag === true) {
        document.getElementById("flag_page_control").style.display = "flex";
    } else if (flag === false) {
        document.getElementById("page_control").style.display = "flex";
    }
}

// select the user roles according to the privilege_level
function mapPrivilegeLevel(privilege_level) {
    switch (privilege_level) {
        case 1:
            return "Administrator";
        case 2:
            return "Timekeeper";
        case 3:
            return "Owner";
        case 4:
            return "Driver";
        case 5:
            return "Conductor";
        case 6:
            return "Passenger";
        default:
            return "Unknown";
    }
}

// show confirmation for flag a passenger
function openFlagConfirm(p_id, flag) {
    toBeFlagged = p_id;
    currentFlag = flag;
    if (flag === "false") {
        console.log(flag)
        document.getElementById("confirmAlert").style.display = "block";
        document.getElementById("overlay").style.display = "block";
        document.getElementById("flagUser").innerHTML = p_id;
    } else if (flag === "true") {
        console.log(flag)
        document.getElementById("confirmFlagAlert").style.display = "block";
        document.getElementById("unFlagUser").innerHTML = p_id;
    }
}

// close the flag confirmation window
function closeFlagAlert(flag) {
    toBeFlagged = "";
    currentFlag = false;
    if (flag === false) {
        document.getElementById("confirmAlert").style.display = "none";
        document.getElementById("overlay").style.display = "none";
    } else if (flag === true) {
        document.getElementById("confirmFlagAlert").style.display = "none";
    }

}

// view flagged users
function openFlagged() {
    document.getElementById("flagTable").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    fetchAndDisplayData(true);
}

// close flagged users
function closeFlagged() {
    document.getElementById("flagTable").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    const tableBody = document.querySelector("#flagTable tbody");
    tableBody.innerHTML = "";
    fetchAndDisplayData(false);
}

// show success message
function openFlagSuccess(flag) {
    if (flag === "true") {
        document.getElementById("confirmFlagAlert").style.display = "none";
        document.getElementById("successFlagAlert").style.display = "block";
    } else if (flag === "false") {
        document.getElementById("confirmAlert").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        document.getElementById("successAlert").style.display = "block";
        document.getElementById("overlay").style.display = "block";
    }
}

// close success message
function closeAlertSuccess(flag) {
    if (flag === false) {
        document.getElementById("successFlagAlert").style.display = "none";
        window.location.href = "../html/admin_dashboard_passengers.html";
    } else if (flag === true) {
        document.getElementById("successAlert").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        window.location.href = "../html/admin_dashboard_passengers.html";
    }
}

// show fail message
function openFlagFail(response, flag) {
    if (flag === "true") {
        document.getElementById("failFlagMsg").innerHTML = "Operation failed (" + response + ")";
        document.getElementById("failFlagAlert").style.display = "block";
    } else if (flag === "false") {
        document.getElementById("failMsg").innerHTML = "Operation failed (" + response + ")";
        document.getElementById("failAlert").style.display = "block";
        document.getElementById("overlay").style.display = "block";
    }

}

// close fail message
function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/admin_dashboard_buses.html";
}

// flag a selected passenger
function FlagConfirm() {
    const updatedFlag = {
        flag: currentFlag,
    };

    const jsonData = JSON.stringify(updatedFlag);

    fetch(`${ url }/passengerController`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'p_id': toBeFlagged
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                openFlagSuccess(currentFlag)
            } else if (response.status === 401) {
                openFlagFail(response.status, currentFlag);
            } else {
                openFlagFail(response.status, currentFlag);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// event listener for search button
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);

// filter data according to the search options
function searchData() {
    const searchTerm = document.getElementById("searchInput").value;
    const search = searchTerm.toLowerCase();

    if(searchOption === 'name'){
        normalDataSearch = normalData.filter(user => {
            const fullName = `${user.first_name} ${user.last_name} `;
            return fullName.toLowerCase().includes(search);
        });
    }
    else if(searchOption === 'privilege_level'){
        let privilege_number = 0;
        if(searchTerm === "a" || searchTerm === "ad" || searchTerm === "adm" || searchTerm === "admi" || searchTerm === "admin" || searchTerm === "admini" || searchTerm === "adminis" || searchTerm === "administ" || searchTerm === "administr" || searchTerm === "administra" || searchTerm === "administrat" || searchTerm === "administrato" || searchTerm === "administrator" || searchTerm === "administrator "){
            privilege_number = 1;
        }
        else if(searchTerm === "p" || searchTerm === "pa" || searchTerm === "pas" || searchTerm === "pass" || searchTerm === "passe" || searchTerm === "passen" || searchTerm === "passeng" || searchTerm === "passenge" || searchTerm === "passenger" || searchTerm === "passenger "){
            privilege_number = 6;
        }
        else if(searchTerm === "t" || searchTerm === "ti" || searchTerm === "tim" || searchTerm === "time" || searchTerm === "timek" || searchTerm === "timeke" || searchTerm === "timekee" || searchTerm === "timekeep" || searchTerm === "timekeepe" || searchTerm === "timekeeper" || searchTerm === "timekeeper " || searchTerm === "timekpr" || searchTerm === "timekpr "){
            privilege_number = 2;
        }
        else if(searchTerm === "d" || searchTerm === "dr" || searchTerm === "dri" || searchTerm === "driv" || searchTerm === "drive" || searchTerm === "driver" || searchTerm === "driver "){
            privilege_number = 4;
        }
        else if(searchTerm === "o" || searchTerm === "ow" || searchTerm === "own" || searchTerm === "owne" || searchTerm === "owner" || searchTerm === "owner "){
            privilege_number= 3;
        }
        else if(searchTerm === "c" || searchTerm === "co" || searchTerm === "con" || searchTerm === "cond" || searchTerm === "condu" || searchTerm === "conduc" || searchTerm === "conduct"|| searchTerm === "conducto"|| searchTerm === "conductor"|| searchTerm === "conductor "){
            privilege_number= 5;
        }

        normalDataSearch = normalData.filter(user =>
            user.privilege_level === privilege_number
        );
    }
    else if(searchOption === "nic" || searchOption === "p_id"){
        normalDataSearch = normalData.filter(user =>
            user[searchOption].toLowerCase().includes(search)
        );
    }
    else if(searchOption === ''){
        return;
    }

    updatePage(currentPage, false, true);
}

// event listener for search option drop down
const searchSelect = document.getElementById("searchSelect");
searchSelect.addEventListener("change", (event) => {
    searchOption = event.target.value;
});