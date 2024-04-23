let currentPage = 1;
const pageSize = 10;
let allData = [];
let allSearchData = [];
let searchOption = 'booking_id';

document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

function refreshPage() {
    location.reload();
}

function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;
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
            allData = data;
            console.log(allData)
            updatePage(currentPage, false);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function updatePage(page, search) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const tableBody = document.querySelector("#bookingContainer tbody");

    let dataToShow;
    if(search){
        console.log("hello: " + allSearchData)
        dataToShow = allSearchData.slice(startIndex, endIndex);
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
    const tableBody = document.querySelector("#bookingContainer tbody");
    const rowCount = data.length;
    if(rowCount === 0){
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="7">No data available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }
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

function renderPageControl() {
    document.getElementById("page_control").style.display = "flex";
}

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);

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

const searchSelect = document.getElementById("searchSelect");
searchSelect.addEventListener("change", (event) => {
    searchOption = event.target.value;
});