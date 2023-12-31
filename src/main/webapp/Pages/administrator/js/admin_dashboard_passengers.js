let toBeFlagged = ""
let currentFlag = false
let currentPage = 1;
let currentFlagPage = 1;
const pageSize = 10;
let normalData = [];
let flagData = [];

fetchAndDisplayData(false);

async function fetchAndDisplayData(flag) {
    try {
        const url = `/SmoothTix_war_exploded/passengerController`;
        const response =  await fetch(url, {
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

        updatePage(flag ? currentFlagPage : currentPage, flag);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function updatePage(page, flag) {
    const data = flag ? flagData : normalData;
    const tableBody = document.querySelector(flag ? "#flagTable tbody" : "#dataTable tbody");
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataToShow = data.slice(startIndex, endIndex);

    tableBody.innerHTML = "";
    displayDataAsTable(dataToShow, flag);
    flag ? updateFlagPageNumber(currentFlagPage) : updatePageNumber(currentPage);
}


function updatePageNumber(page) {
    document.getElementById("currentPageNumber").textContent = page;
}

function updateFlagPageNumber(page) {
    document.getElementById("flag_currentPageNumber").textContent = page;
}

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



function changePage(newPage, isFlag) {
    const data = getDataForPage(newPage, isFlag);

    if (isFlag ? currentFlagPage !== newPage : currentPage !== newPage) {
        if (data.length > 0) {
            isFlag ? (currentFlagPage = Math.max(1, newPage)) : (currentPage = Math.max(1, newPage));
            isFlag ? (document.getElementById("flag_nextPageIcon").style.opacity = "1") : (document.getElementById("nextPageIcon").style.opacity = "1");
            updatePage(isFlag ? currentFlagPage : currentPage, isFlag);
        } else {
            console.log(`Next ${isFlag ? 'flag ' : ''}page is empty`);
            isFlag ? (document.getElementById("flag_nextPageIcon").style.opacity = "0.5") : (document.getElementById("nextPageIcon").style.opacity = "0.5");
        }
    }
}


function getDataForPage(page, flag) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return flag ? flagData.slice(startIndex, endIndex) : normalData.slice(startIndex, endIndex);
}

function displayDataAsTable(data, flag) {
    let tableBody = ""
    if(flag === true){
        tableBody = document.querySelector("#flagTable tbody");
    }
    else{
        tableBody = document.querySelector("#dataTable tbody");
    }

    const rowCount = data.length;
    if(rowCount === 0){
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="6">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    if(rowCount >=10){
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
                            <img src="${(item.privilege_level === 2) ? '../../../images/vector_icons/delete_icon.png' : '../../../images/vector_icons/flag_icon.png'}" 
                                 alt="${(item.privilege_level === 2) ? 'delete' : 'flag'}" 
                                 class="action_icon">
                        </i>
                    </span>
                </td>
            `;

            tableBody.appendChild(row);
        }
        else if (item.flag) {
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

function renderPageControl(flag){
    if(flag === true){
        document.getElementById("flag_page_control").style.display = "flex";
    }
    else if(flag === false){
        document.getElementById("page_control").style.display = "flex";
    }
}

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

function openFlagConfirm(p_id, flag){
    toBeFlagged = p_id;
    currentFlag = flag;
    if(flag === "false"){
        console.log(flag)
        document.getElementById("confirmAlert").style.display = "block";
        document.getElementById("overlay").style.display = "block";
        document.getElementById("flagUser").innerHTML = p_id;
    }
    else if(flag === "true"){
        console.log(flag)
        document.getElementById("confirmFlagAlert").style.display = "block";
        document.getElementById("unFlagUser").innerHTML = p_id;
    }
}

function closeFlagAlert(flag) {
    toBeFlagged = "";
    currentFlag = false;
    if(flag === false){
        document.getElementById("confirmAlert").style.display = "none";
        document.getElementById("overlay").style.display = "none";
    }
    else if(flag === true){
        document.getElementById("confirmFlagAlert").style.display = "none";
    }

}

function openFlagged() {
    document.getElementById("flagTable").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    fetchAndDisplayData(true);
}

function closeFlagged() {
    document.getElementById("flagTable").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    const tableBody = document.querySelector("#flagTable tbody");
    tableBody.innerHTML = "";
    fetchAndDisplayData(false);
}

function openFlagSuccess(flag) {
    if(flag === "true"){
        document.getElementById("confirmFlagAlert").style.display = "none";
        document.getElementById("successFlagAlert").style.display = "block";
    }
    else if(flag === "false"){
        document.getElementById("confirmAlert").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        document.getElementById("successAlert").style.display = "block";
        document.getElementById("overlay").style.display = "block";
    }
}

function closeAlertSuccess(flag) {
    if(flag === false){
        document.getElementById("successFlagAlert").style.display = "none";
        window.location.href = "../html/admin_dashboard_passengers.html";
    }
    else if(flag === true){
        document.getElementById("successAlert").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        window.location.href = "../html/admin_dashboard_passengers.html";
    }
}

function openFlagFail(response, flag) {
    if(flag === "true"){
        document.getElementById("failFlagMsg").innerHTML = "Operation failed (" + response + ")";
        document.getElementById("failFlagAlert").style.display = "block";
    }
    else if(flag === "false"){
        document.getElementById("failMsg").innerHTML = "Operation failed (" + response + ")";
        document.getElementById("failAlert").style.display = "block";
        document.getElementById("overlay").style.display = "block";
    }

}

function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/admin_dashboard_buses.html";
}

function FlagConfirm(){
    const updatedFlag = {
        flag: currentFlag,
    };

    const jsonData = JSON.stringify(updatedFlag);

    fetch(`../../../passengerController`, {
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
                // closeFlagAlert(currentFlag)
            } else if (response.status === 401) {
                openFlagFail(response.status,currentFlag);
            } else {
                openFlagFail(response.status,currentFlag);
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// const searchInput = document.getElementById("searchInput");
// searchInput.addEventListener("keyup", searchData);
//
// // Handle search
// function searchData() {
//     const tableBody = document.querySelector("#dataTable tbody");
//     tableBody.innerHTML = "";
//
//     const searchTerm = document.getElementById("searchInput").value;
//
//     if (searchTerm.trim() === "") {
//         fetchAllData();
//         return;
//     }
//
//     fetch('../../../passengerController', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'p_id': searchTerm
//         },
//     })
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 console.error('Error:', response.status);
//             }
//         })
//         .then(data => {
//             displayDataAsDataTable(data);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }
//
// const searchInputFlag = document.getElementById("searchInputFlag");
// searchInputFlag.addEventListener("keyup", searchFlagData);
//
// // Handle search
// function searchFlagData() {
//     const tableBody = document.querySelector("#flaggedTable tbody");
//     tableBody.innerHTML = "";
//
//     const searchTerm = document.getElementById("searchInputFlag").value;
//
//     if (searchTerm.trim() === "") {
//         fetchAllData();
//         return;
//     }
//
//     fetch('../../../passengerController', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'p_id': searchTerm
//         },
//     })
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 console.error('Error:', response.status);
//             }
//         })
//         .then(data => {
//             displayDataAsFlagTable(data);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }
