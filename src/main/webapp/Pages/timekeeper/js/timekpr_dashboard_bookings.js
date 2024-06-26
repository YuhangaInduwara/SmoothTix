let currentPage = 1;
const pageSize = 10;
let allData = [];
let allSearchData = [];
let searchOption = 'booking_id';

// Function to capitalize the first letter of stand
function capitalizeStartAndDestination(data) {
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    if (data) {
        data.forEach(row => {
            if (row.start) {
                row.start = capitalizeFirstLetter(row.start);
            }

            if (row.destination) {
                row.destination = capitalizeFirstLetter(row.destination);
            }

            if (row.stand_list) {
                row.stand_list = capitalizeFirstLetter(row.stand_list);
            }
        });
    }

    return data;
}

// session management (authentication and authorization)
document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

// refresh the page
function refreshPage() {
    location.reload();
}

// get all booking data from database
function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name; // set username in dashboard
    fetch(`${ url }/bookingController?timeKeeper_id=TK001`, {
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
            allData = capitalizeStartAndDestination(data);
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
    const tableBody = document.querySelector("#bookingContainer tbody");

    let dataToShow;
    if(search){
        dataToShow = allSearchData.slice(startIndex, endIndex);
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
    const tableBody = document.querySelector("#bookingContainer tbody");
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
        <td>${item.booking_id}</td>
        <td>${item.nic}</td>
        <td>${item.date_time}</td>
        <td>${item.route_no}</td>
        <td>${item.route}</td>
        <td>${item.reg_no}</td>
        <td>${item.seat_no}</td>
        <td>${item.status}</td>
    `;

        tableBody.appendChild(row);
    });
}

// display page control icons
function renderPageControl() {
    document.getElementById("page_control").style.display = "flex";
}

// event listener for search button
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);

// handle search data
function searchData() {
    const searchTerm = document.getElementById("searchInput").value;
    const search = searchTerm.toLowerCase();

    if(searchOption === 'name'){
        allSearchData = allData.filter(user => {
            const fullName = `${user.first_name} ${user.last_name} `;
            return fullName.toLowerCase().includes(search);
        });
    }
    else if(searchOption === 'privilege_level'){

        allSearchData = allData.filter(user =>
            user.privilege_level === privilege_number
        );
    }
    else if(searchOption === "nic" || searchOption === "booking_id" || searchOption === "status" || searchOption === "route_no" || searchOption === "reg_no"){
        allSearchData = allData.filter(user =>
            user[searchOption].toLowerCase().includes(search)
        );
    }
    else if(searchOption === ''){
        return;
    }

    updatePage(currentPage, true);
}

// event listener for filter drop down
const searchSelect = document.getElementById("searchSelect");
searchSelect.addEventListener("change", (event) => {
    searchOption = event.target.value;
});