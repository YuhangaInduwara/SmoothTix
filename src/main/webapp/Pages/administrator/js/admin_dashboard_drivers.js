let currentPage = 1;
const pageSize = 10;
let allData = [];
let dataSearch = [];
let searchOption = 'driver_id';

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
    document.getElementById("userName").textContent = session_user_name;
    fetch(`${ url }/driverController`, {
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
    let existingData = {};

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
                            <td>${item.driver_id}</td>
                            <td>${existingData.first_name} ${existingData.last_name}</td>
                            <td>${existingData.nic}</td>
                            <td>${item.license_no}</td>
                            <td>${existingData.email}</td>
                            <td>${item.review_points}</td>
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

