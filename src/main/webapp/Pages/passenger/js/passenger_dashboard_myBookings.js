//isAuthenticated();

const p_id = "P0030";
let currentData = 1;
const dataSize = 3;
let allData = [];
let totalData = 1;
//document.addEventListener('DOMContentLoaded', function () {
//    isAuthenticated().then(() => fetchAllData());
//});

//function fetchAllData(){
    fetch(`${ url }/bookingController?p_id=${p_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
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
            console.log(data);
            handleBookings(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
//}

function handleBookings(bookings) {
    const currentBookings = bookings.filter(booking => booking.status === 0);
    const historyBookings = bookings.filter(booking => booking.status !== 0);

    displayCurrentBookings(currentBookings);
    displayHistoryBookings(historyBookings);
}

function displayCurrentBookings(currentBookings) {
    console.log('Current Bookings:', currentBookings);
    totalData = Math.ceil(currentBookings.length / 3) + 1;
    document.getElementById("noOfData").textContent = totalData;
    updateData(currentData);

}

function displayHistoryBookings(historyBookings) {
    // Handle history bookings here
    console.log('History Bookings:', historyBookings);
    // Call other functions or update UI as needed
}

function updateData(data){
//    const list = document.getElementById("schedule_list");
    const startIndex = (data - 1) * dataSize;
    const endIndex = startIndex + dataSize;
    const tableBody = document.querySelector("#dataTable tbody");
    const dataToShow = allData.slice(startIndex, endIndex);

    tableBody.innerHTML = "";
    displayDataAsTable(dataToShow);
    updateDataNumber(currentData);
}

function updateDataNumber(data) {
    document.getElementById("currentDataNumber").textContent = data;
}

const prevDataIcon = document.getElementById("prevDataIcon");
prevDataIcon.addEventListener("click", () => changeData(currentData))

const nextDataIcon = document.getElementById("nextDataIcon");
nextDataIcon.addEventListener("click", () => changeData(currentData));


function changeData(newData) {
    if(newData === totalData){
    document.getElementById("nextDataIcon").style.pointerEvents = "none";
    document.getElementById("nextDataIcon").style.opacity = "0.5";
    }
    else{
    document.getElementById("nextDataIcon").style.pointerEvents = "auto";
    document.getElementById("nextDataIcon").style.opacity = "1";
    }

    if (currentData !== newData) {
        currentData = Math.max(1, newData);
        updateData(currentData);
    }
}

function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    const rowCount = data.length;
    if(rowCount === 0){
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="8">No Bookings available</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.booking_id}</td>
            <td>${item.reg_no}</td>
            <td>${item.start}</td>
            <td>${item.destination}</td>
            <td>${item.date}</td>
            <td>${item.time}</td>
            <td>"Seat naa"</td>
        `;

        tableBody.appendChild(row);
    });
}














//function displayDataAsTable(data) {
//    const tableBody = document.querySelector("#dataTable tbody");
//    const rowCount = data.length;
//    if(rowCount >=10){
//        renderPageControl()
//    }
//    data.forEach(item => {
//        const row = document.createElement("tr");
//
//        row.innerHTML = `
//            <td>${item.booking_id}</td>
//            <td>${item.schedule_id}</td>
//            <td>${item.route_id}</td>
//            <td>${item.date}</td>
//            <td>${item.time}</td>
//            <td>${item.seat_no}</td>
//            <td>${item.price}</td>
//            <td>
//                <a class="bus-profile" href="./passenger_dashboard_myBookings_moreinfo.html">More info </a>
//            </td>
//        `;
//
//        tableBody.appendChild(row);
//    });
//}