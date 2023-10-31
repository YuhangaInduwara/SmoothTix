// Fetch all data from the database
function fetchAllData() {
    let nic = "200028103322";
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
    const container = document.querySelector("#dataList");

    data.forEach(item => {
        const paragraph = document.createElement("p");

        paragraph.innerHTML = `
            <strong>First Name:</strong> ${item.fname}<br>
            <strong>Last Name:</strong> ${item.lname}<br>
            <strong>NIC:</strong> ${item.nic}<br>
            <strong>Mobile No:</strong> ${item.mobileNo}<br>
            <strong>Email:</strong> ${item.email}<br><br>

            <div class="editDeleteButtons">
             <button class="edit" onclick="update('${item.nic}')">Edit</button>
             <button class="delete" onclick="deleteEntity('${item.nic}')">Delete</button>
           </div>
        `;

        container.appendChild(paragraph);
    });
}



function update(nic){
    openForm_update();

    let existingData = {};

    const urlParams = new URLSearchParams(window.location.search);

    document.getElementById("header_nic").innerHTML = nic

    fetch('../../../passengerController', {
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
                    document.getElementById("update_password").value = "...........";
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

        fetch(`../../../passengerController`, {
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

function deleteEntity(nic){
    fetch(`../../../passengerController`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'nic': nic
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

function openForm_update() {
    const existingForm = document.querySelector(".passenger_update_form_body");

    if (!existingForm) {
        createForm();
    }

    document.getElementById("passengerUpdateForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_update() {
    document.getElementById("passengerUpdateForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/passenger_dashboard_aboutMe.html";
}

function openAlertSuccess() {
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function openAlertFail(response) {
    document.getElementById("failMsg").innerHTML = "Operation failed (" + response + ")";
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../../../index.html";
}

function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "./passenger_dashboard_aboutMe.html";
}

function createForm() {
//    const form_add = document.createElement('div');
//    form_add.classList.add('bus_add_form_body');

    const form_update = document.createElement('div');
    form_update.classList.add('passenger_update_form_body');

    var form= `
        <div class="passenger_form_left">

            <div class="form_div">
                <label for="fname" class="passenger_form_title">First name <span class="passenger_form_require">*</span></label>
                <input type="text" name="fname" id="fname" class="form_data" placeholder="Enter first name" required="required" />
            </div>
           <div class="form_div">
                <label for="lname" class="passenger_form_title">Last name <span class="passenger_form_require">*</span></label>
                <input type="text" name="lname" id="lname" class="form_data" placeholder="Enter last name" required="required" />
           </div>
           <div class="form_div">
                <label for="nic" class="passenger_form_title">NIC <span class="passenger_form_require">*</span></label>
                <input type="text" name="nic" id="nic" class="form_data" placeholder="Enter NIC" required="required" />
           </div>
           <div class="form_div">
                <label for="mobileNo" class="passenger_form_title">Mobile no <span class="passenger_form_require">*</span></label>
                <input type="text" name="mobileNo" id="mobileNo" class="form_data" placeholder="Enter mobile no" required="required" />
           </div>
           <div class="form_div">
                <label for="email" class="passenger_form_title">Email <span class="passenger_form_require">*</span></label>
                <input type="text" name="email" id="email" class="form_data" placeholder="Enter email" required="required" />
           </div>
           <div class="form_div">
                <label for="password" class="passenger_form_title">Password <span class="passenger_form_require">*</span></label>
                <input type="text" name="password" id="password" class="form_data" placeholder="Enter password" required="required" />
           </div>

        </div>

        `;

//    form_add.innerHTML = form.replace(/id="/g, 'id="add_');
    form_update.innerHTML = form.replace(/id="/g, 'id="update_');
//    const formContainer_add = document.getElementById('formContainer_add');
    const formContainer_update = document.getElementById('formContainer_update');

//    formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form
    formContainer_update.appendChild(form_update.cloneNode(true)); // Clone the form
}

// Attach the searchData function to the keyup event of the search input field
//const searchInput = document.getElementById("searchInput");
//searchInput.addEventListener("keyup", searchData);