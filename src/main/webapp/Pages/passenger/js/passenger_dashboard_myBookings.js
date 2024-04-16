const p_id = "P0001";
let currentPage = 1;
const pageSize = 3;
let allData = [];

document.addEventListener('DOMContentLoaded', function () {
   isAuthenticated().then(() => fetchAllData());
});

function fetchAllData(){
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
            updatePage(currentPage);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updatePage(page) {
    const list = document.getElementById("schedule_list");
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataToShow = allData.slice(startIndex, endIndex);

    list.innerHTML = "";
    console.log(startIndex + " " +dataToShow + " " + endIndex)
    displayDataAsScheduleTiles(dataToShow);
    updatePageNumber(currentPage);
}

function updatePageNumber(page) {
    document.getElementById("currentPageNumber").textContent = page;
}

const prevPageIcon = document.getElementById("prevPageIcon");
prevPageIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    changePage(currentPage - 1);
}, true);

const nextPageIcon = document.getElementById("nextPageIcon");
nextPageIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    changePage(currentPage + 1);
}, true);

function changePage(newPage) {
    const data = getDataForPage(newPage);

    if (currentPage !== newPage) {
        if (data.length > 0) {
            currentPage = Math.max(1, newPage);
            document.getElementById("nextPageIcon").style.opacity = "1";
            updatePage(currentPage);
        } else {
            console.log(`Next page is empty`);
            document.getElementById("nextPageIcon").style.opacity = "0.5";
        }
    }
}

function getDataForPage(page) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allData.slice(startIndex, endIndex);
}

function displayDataAsScheduleTiles(data) {
    const scheduleList = document.getElementById("schedule_list");

    const dataCount = data.length;
    if(dataCount === 0){
        const noData = document.createElement("tr");
        noData.innerHTML = `<td colspan="6">No schedules available</td>`;
        scheduleList.appendChild(noData);
        return;
    }

    if(dataCount >= 3){
        renderPageControl();
    }

    data.forEach(item => {
        console.log(item.status)
        if(item.status !== 3){
            const scheduleElement = document.createElement("div");
            scheduleElement.classList.add("schedule_tiles");
            scheduleElement.innerHTML = `
            <div class="schedule_element_row1">
                <div class="busRegNo">
                    <h1 id="busRegNo">${item.booking_id}</h1>
                </div>
                <div>
                    <p>From: <span id="start">${item.start}</span></p>
                    <p>To: <span id="destination">${item.destination}</span></p>
                </div>
                <div>
                    <p>Date: <span id="bookingClosingDate">${item.date}</span></p>
                    <p>Time: <span id="bookingClosingTime">${item.time}</span></p>
                </div>
                <div class="seatAvailability">
                    <h2>Booked <br> Seat/Seats</h2>
                    <h1 id="seatAvailability">${item.seat_no}</h1>
                </div>
            </div>
            <div class="schedule_element_row2">
                <div class="routeNo">
                    <h1 id="busRegNo">${item.reg_no}</h1>
                </div>
                <div>
                    <h1>Status: ${item.status}</h1>
                </div>
                <div class="addBookingBtn">
                    <button class="button" onclick="openSeatSelection('${item.schedule_id}', '${item.start}', '${item.destination}', '${item.date}', '${item.time}', '${item.available_seats}', '${item.price_per_ride}')">Book Seat</button>
                </div>
            </div>
        `;

            scheduleList.appendChild(scheduleElement);
        }
    });
}

function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}











//
// function handleBookings(bookings) {
//     const currentBookings = bookings.filter(booking => booking.status === 0);
//     const historyBookings = bookings.filter(booking => booking.status === 1);
//
//     // console.log("Current Bookings:");
//     // currentBookings.forEach(booking => {
//     //     console.log(booking); // Print each current booking
//     // });
//     //
//     // console.log("History Bookings:");
//     // historyBookings.forEach(booking => {
//     //     console.log(booking); // Print each historical booking
//     // });
//
//     displayCurrentBookings(currentBookings);
//     // displayHistoryBookings(historyBookings);
// }
//
// function displayCurrentBookings(currentBookings) {
//     console.log('Current Bookings:', currentBookings);
//     totalData = Math.ceil(currentBookings.length / 3) + 1;
//     document.getElementById("noOfData").textContent = totalData;
//     updateData(currentBookings);
//
// }
//
// function displayHistoryBookings(historyBookings) {
//     // Handle history bookings here
//     console.log('History Bookings:', historyBookings);
//     // Call other functions or update UI as needed
// }
//
// function updateData(data){
// //    const list = document.getElementById("schedule_list");
//     const startIndex = (data - 1) * dataSize;
//     const endIndex = startIndex + dataSize;
//     const tableBody = document.querySelector("#dataTable tbody");
//     const dataToShow = allData.slice(startIndex, endIndex);
//
//     tableBody.innerHTML = "";
//     console.log(startIndex + " " +dataToShow + " " + endIndex)
//     displayDataAsTable(dataToShow);
//     updateDataNumber(currentData);
// }
//
// function updateDataNumber(data) {
//     document.getElementById("currentDataNumber").textContent = data;
// }
//
// const prevDataIcon = document.getElementById("prevDataIcon");
// prevDataIcon.addEventListener("click", () => changeData(currentData))
//
// const nextDataIcon = document.getElementById("nextDataIcon");
// nextDataIcon.addEventListener("click", () => changeData(currentData));
//
//
// function changeData(newData) {
//     if(newData === totalData){
//     document.getElementById("nextDataIcon").style.pointerEvents = "none";
//     document.getElementById("nextDataIcon").style.opacity = "0.5";
//     }
//     else{
//     document.getElementById("nextDataIcon").style.pointerEvents = "auto";
//     document.getElementById("nextDataIcon").style.opacity = "1";
//     }
//
//     if (currentData !== newData) {
//         currentData = Math.max(1, newData);
//         updateData(currentData);
//     }
// }
//
// function displayDataAsTable(data) {
//     const tableBody = document.querySelector("#dataTable tbody");
//     const rowCount = data.length;
//     if(rowCount === 0){
//         const noDataRow = document.createElement("tr");
//         noDataRow.innerHTML = `<td colspan="8">No Bookings available</td>`;
//         tableBody.appendChild(noDataRow);
//         return;
//     }
//
//     data.forEach(item => {
//         const row = document.createElement("tr");
//
//         row.innerHTML = `
//             <td>${item.booking_id}</td>
//             <td>${item.reg_no}</td>
//             <td>${item.start}</td>
//             <td>${item.destination}</td>
//             <td>${item.date}</td>
//             <td>${item.time}</td>
//             <td>${item.seat_no}</td>
//             <td>${item.status}</td>
//         `;
//
//         tableBody.appendChild(row);
//     });
// }














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