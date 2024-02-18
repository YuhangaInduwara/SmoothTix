isAuthenticated();
fetch('../../../bookingController', {
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
        displayDataAsTable(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    const rowCount = data.length;
    if(rowCount >=10){
        renderPageControl()
    }
    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.booking_id}</td>
            <td>${item.schedule_id}</td>
            <td>${item.route_id}</td>
            <td>${item.date}</td>
            <td>${item.time}</td>
            <td>${item.seat_no}</td>
            <td>${item.price}</td>
            <td>
                <a class="bus-profile" href="./passenger_dashboard_myBookings_moreinfo.html">More info </a>
            </td>
        `;

        tableBody.appendChild(row);
    });
}