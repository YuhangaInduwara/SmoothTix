let currentPage = 1;
const pageSize = 10;
let allData = [];
let allRequestData = [];
let dataSearch = [];
let searchOption = 'bus_id';

document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

function refreshPage() {
    location.reload();
}

function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;
    fetch(`${ url }/busController`, {
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
    if (currentPage !== newPage) {
        currentPage = Math.max(1, newPage);
        updatePage(currentPage, false);
    }
}

function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    const rowCount = data.length;
    if(rowCount === 0){
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="8">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }
    if(rowCount >= 10){
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
            <td>${item.review_points}</td>
        `;

        tableBody.appendChild(row);
    });
}

function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
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

function openBusRequests(){
    fetchRequestData()
    document.getElementById("requestTable").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeBusRequests(){
    document.getElementById("requestTable").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function fetchRequestData() {
    fetch(`${ url }/busVerifyController`, {
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
            allRequestData = data;
            console.log(allRequestData)
            displayRequestDataAsTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayRequestDataAsTable(data) {
    const tableBody = document.querySelector("#requestTable tbody");
    const rowCount = data.length;
    if(rowCount === 0){
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="8">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }
    if(rowCount >= 10){
        renderPageControl()
    }
    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.nic}</td>
            <td>${item.reg_no}</td>
            <td>${item.route_no}</td>
            <td>${item.route}</td>
            <td>${item.no_of_Seats}</td>
            <td>
                <span class="icon-container">
                    <i onclick="updateBusRequest('${item.bus_id}','decilne')"><img src="../../../images/vector_icons/decline_icon.png" alt="decline" class="action_icon"></i>
                </span>
                <span class="icon-container">
                    <i onclick="updateBusRequest('${item.bus_id}','accept')"><img src="../../../images/vector_icons/accept_icon.png" alt="accept" class="action_icon"></i>
                </span>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function updateBusRequest(bus_id, action){
    fetch(`${ url }/busVerifyController?action=${action}&bus_id=${bus_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                console.log('success');
            } else if (response.status === 401) {
                console.log('Unauthorized');
            } else {
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}