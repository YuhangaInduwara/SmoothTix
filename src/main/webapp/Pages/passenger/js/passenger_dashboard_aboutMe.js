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
            displayDataAsParagraphs(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

fetchAllData();

// Display all data
function displayDataAsParagraphs(data) {
    const container = document.querySelector("#dataContainer");

    data.forEach(item => {
        const paragraph = document.createElement("p");

        paragraph.innerHTML = `
            <strong>First Name:</strong> ${item.fname}<br>
            <strong>Last Name:</strong> ${item.lname}<br>
            <strong>NIC:</strong> ${item.nic}<br>
            <strong>Mobile No:</strong> ${item.mobileNo}<br>
            <strong>Email:</strong> ${item.email}<br><br>
        `;

        container.appendChild(paragraph);
    });
}


function update(nic){
    openForm_update();

    let existingData = {};

    const urlParams = new URLSearchParams(window.location.search);

    document.getElementById("header_nic").innerHTML = nic

    fetch('../../../busController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'nic': nic
        },
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    existingData = data[0];
                    console.log("existingData:", existingData);

                    document.getElementById("update_fname").value = existingData.fname;
                    document.getElementById("update_lname").value = existingData.lname;
                    document.getElementById("update_nic").value = existingData.nic;
                    document.getElementById("update_mobileNo").value = existingData.mobileNo;
                    document.getElementById("update_email").value = existingData.email;
                    document.getElementById("update_password").value = existingData.password;
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

    document.getElementById("passengerUpdateForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const fname = document.getElementById("update_fname").value;
        const lname = document.getElementById("update_lname").value;
        const nic = document.getElementById("update_nic").value;
        const mobileNo = document.getElementById("update_mobileNo").value;
        const email = document.getElementById("update_email").value;
        const password = document.getElementById("update_password").value;

        const updatedData = {
            fname: fname,
            lname: lname,
            nic: nic,
            mobileNo: mobileNo,
            email: email,
            password: password,
        };

        const jsonData = JSON.stringify(updatedData);

        fetch(`../../../busController`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'nic': nic
            },
            body: jsonData
        })
            .then(response => {
                if (response.ok) {
                    closeForm_update();
                    openAlertSuccess();
                } else if (response.status === 401) {
                    openAlertFail(response.status);
                    console.log('Update unsuccessful');
                } else {
                    openAlertFail(response.status);
                    console.error('Error:', response.status);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}

function deleteRow(nic){
    fetch(`../../../busController`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'bus_id': bus_id
        },
    })
        .then(response => {
            if (response.ok) {
                openAlertSuccess();
            } else if (response.status === 401) {
                openAlertFail(response.status);
                console.log('Delete unsuccessful');
            } else {
                openAlertFail(response.status);
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}