// Fetch all data from the database
function fetchAllData() {
    let nic = "2000";
    fetch('../../../passengerController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'nic': nic
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
            displayDataAsList(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

fetchAllData();

// Display all data
function displayDataAsList(data) {
    const list = document.querySelector("#dataList");

    data.forEach(item => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <strong>First Name:</strong> ${item.fname}<br>
            <strong>Last Name:</strong> ${item.lname}<br>
            <strong>NIC:</strong> ${item.nic}<br>
            <strong>Mobile No:</strong> ${item.mobileNo}<br>
            <strong>Email:</strong> ${item.email}<br><br>
        `;

        list.appendChild(listItem);
    });
}
