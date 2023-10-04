fetch('../../../busController', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
})
    .then(response => {
        if (response.ok) {
            response.json().then(data => {
                displayDataAsTable(data);
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

function displayDataAsTable(data) {
    const table = document.getElementById("dataTable");

    const desiredOrder = ["bus_id", "owner_id", "engineNo", "chassisNo", "noOfSeats", "manufact_year", "brand", "model"];

    const thead = table.querySelector("thead");
    const headerRow = document.createElement("tr");
    desiredOrder.forEach(header => {
        const cell = document.createElement("th");
        cell.textContent = header;
        headerRow.appendChild(cell);
    });
    thead.appendChild(headerRow);

    const tbody = table.querySelector("tbody");
    data.forEach(item => {
        const row = document.createElement("tr");
        desiredOrder.forEach(header => {
            const cell = document.createElement("td");
            cell.textContent = item[header];
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
}
