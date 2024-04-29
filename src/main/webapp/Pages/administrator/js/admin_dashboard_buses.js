let currentPage = 1;
const pageSize = 10;
let allData = [];
let allRequestData = [];
let dataSearch = [];
let searchOption = 'bus_id';

// session management (authentication and authorization)
document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

// refresh the page
function refreshPage() {
    location.reload();
}

// get all bus data from database
function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name; // set username in dashboard
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

// create data chunks for each page and call display function for each of them
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

// update the page number on page control icons
function updatePageNumber(page) {
    document.getElementById("currentPageNumber").textContent = page;
}

// event listeners for page control buttons
const prevPageIcon = document.getElementById("prevPageIcon");
prevPageIcon.addEventListener("click", () => changePage(currentPage))

const nextPageIcon = document.getElementById("nextPageIcon");
nextPageIcon.addEventListener("click", () => changePage(currentPage));

// change the page number
function changePage(newPage) {
    if (currentPage !== newPage) {
        currentPage = Math.max(1, newPage);
        updatePage(currentPage, false);
    }
}

// display chunked data on the UI
function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    const rowCount = data.length;

    // check for empty pages
    if(rowCount === 0){
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="8">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    // display page controls if row count is greater than 10
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

// display page control icons
function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}

// event listener for search button
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);

// handle search data
function searchData() {
    const searchTerm = document.getElementById("searchInput").value;
    const search = searchTerm.toLowerCase();
    
    dataSearch = allData.filter(user =>
        user[searchOption].toLowerCase().includes(search)
    );

    updatePage(currentPage, true);
}

// event listener for filter drop down
const searchSelect = document.getElementById("searchSelect");
searchSelect.addEventListener("change", (event) => {
    searchOption = event.target.value;
});

// view bus requests sent by owner
function openBusRequests(){
    fetchRequestData()
    document.getElementById("requestTable").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// close bus requests container
function closeBusRequests(){
    document.getElementById("requestTable").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// get all bus requests sent by owners
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

// view fetched request data in the container
function displayRequestDataAsTable(data) {
    const tableBody = document.querySelector("#requestTable tbody");
    tableBody.innerHTML = ''
    const rowCount = data.length;

    // check for empty pages
    if(rowCount === 0){
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="8">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    // display page controls if row count is greater than 10
    if(rowCount >= 10){
        renderPageControl()
    }

    data.forEach(item => {
        if(item.status === 0){
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${item.nic}</td>
            <td>${item.reg_no}</td>
            <td>${item.route_no}</td>
            <td>${item.route}</td>
            <td>${item.no_of_Seats}</td>
            <td>
                <span class="icon-container">
                    <i onclick="updateBusRequest('${item.bus_id}','decline')"><img src="../../../images/vector_icons/decline_icon.png" alt="decline" class="action_icon"></i>
                </span>
                <span class="icon-container">
                    <i onclick="updateBusRequest('${item.bus_id}','accept')"><img src="../../../images/vector_icons/accept_icon.png" alt="accept" class="action_icon"></i>
                </span>
            </td>
        `;

            tableBody.appendChild(row);
        }
    });
}

// fetch a post request for accepting the bus requests
function updateBusRequest(bus_id, action){
    fetch(`${ url }/busVerifyController?action=${action}&bus_id=${bus_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                if(action === 'decline'){
                    openAlert( "Request Declined", "alertSuccess");
                }
                else if(action === 'accept'){
                    openAlert( "Successfully accepted", "alertSuccess");
                }
            } else if (response.status === 401) {
                if(action === 'decline'){
                    openAlert( "Request Decline Failed", "alertFail");
                }
                else if(action === 'accept'){
                    openAlert( "Request Accept Failed", "alertFail");
                }
            } else {
                if(action === 'decline'){
                    openAlert( "Request Decline Failed", "alertFail");
                }
                else if(action === 'accept'){
                    openAlert( "Request Accept Failed", "alertFail");
                }
            }
        })
        .catch(error => {
            if(action === 'decline'){
                openAlert( "Request Decline Failed", "alertFail");
            }
            else if(action === 'accept'){
                openAlert( "Request Accept Failed", "alertFail");
            }
        });
}

// view success and failure alerts with a given message
function openAlert(text, alertBody){
    if(alertBody === "alertFail"){
        document.getElementById("alertMsg").textContent = text;
    }
    else{
        document.getElementById("alertMsgSuccess").textContent = text;
    }
    document.getElementById(alertBody).style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// close alert messages
function closeAlert(){
    const alertSuccess = document.getElementById("alertSuccess");
    const alertFail = document.getElementById("alertFail");
    if(alertSuccess.style.display === "block" && alertFail.style.display === "block"){
        alertSuccess.style.display = "none";
        alertFail.style.display = "none";
    }
    else if(alertSuccess.style.display === "block"){
        alertSuccess.style.display = "none";
    }
    else if(alertFail.style.display === "block"){
        alertFail.style.display = "none";
    }
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/passenger_dashboard_aboutMe.html";
    refreshPage();
}