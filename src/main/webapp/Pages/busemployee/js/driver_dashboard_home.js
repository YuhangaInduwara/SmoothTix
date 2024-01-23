let driver_id = ""
// Fetch all data from the database
function fetchAllData() {

    fetch('../../../driverController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'driver_id': driver_id
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

// Display all data
function displayDataAsParagraphs(data) {
    const container = document.querySelector("#dataList");
    container.innerHTML = '';

    data.forEach(item => {
        const paragraph = document.createElement("p");
         paragraph.classList.add("dataParagraph");

        paragraph.innerHTML = `
            <p class="data_box"><strong>Driver ID:</strong> ${item.driver_id}</p>
            <p class="data_box"><strong>Passenger ID:</strong> ${item.passenger_id}</p>
            <p class="data_box"><strong>Licecse number:</strong> ${item.licence_no}</p>
            <p class="data_box"><strong>Name:</strong> ${item.name}</p>
            <p class="data_box"><strong>NIC Name:</strong> ${item.nic}</p>
            <p class="data_box"><strong>Mobile Number:</strong> ${item.mobile}</p>
            <p class="data_box"><strong>Email:</strong> ${item.email}</p>
            <p class="data_box"><strong>Points:</strong> ${item.points}</p>

            <div class="editDeleteButtons">
             <button class="okButton" onclick="update('${item.driver_id}')" style="display: center; margin-right: 10px; margin-left: 10px">Edit</button>
             <button class="okButton" onclick="deleteEntity('${item.nic}')">Delete</button>
           </div>
        `;

        container.appendChild(paragraph);
    });
}

function update(driver_id){
    openForm_update();

    let existingData = {};


    const urlParams = new URLSearchParams(window.location.search);

    document.getElementById("header_nic").innerHTML = existingData.first_name;

    fetch('../../../driverController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'driver_id': driver_id
        },
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    existingData = data[0];
                    console.log("existingData:", existingData);

                    document.getElementById("update_driver_id").value = existingData.driver_id;
                    document.getElementById("update_passenger_id").value = existingData.passenger_id;
                    document.getElementById("update_licence_no").value = existingData.licence_no;
                    document.getElementById("update_name").value = existingData.name;
                    document.getElementById("update_nic").value = existingData.nic;
                    document.getElementById("update_mobile").value = existingData.mobile;
                    document.getElementById("update_email").value = existingData.email;
                    document.getElementById("update_points").value = existingData.points;
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

        const driver_id = document.getElementById("update_driver_id").value;
        const passenger_id = document.getElementById("update_passenger_id").value;
        const licence_no = document.getElementById("update_licence_no").value;
        const name = document.getElementById("update_name").value;
        const nic = document.getElementById("update_nic").value;
        const mobile = document.getElementById("update_mobile").value;
        const email = document.getElementById("update_email").value;
        const points = document.getElementById("update_points").value;

        const updatedData = {
            driver_id: driver_id,
            passenger_id: passenger_id,
            licence_no: licence_no,
            name: name,
            nic: nic,
            mobile: mobile,
            email: email,
            points: points,
        };

        const jsonData = JSON.stringify(updatedData);

        fetch(`../../../driverController`, {
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
    fetch(`../../../driverController`, {
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
    window.location.href = "../html/driver_dashboard_home.html";
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
    window.location.href = "./driver_dashboard_home.html";
}

function createForm() {
//    const form_add = document.createElement('div');
//    form_add.classList.add('bus_add_form_body');

    const form_update = document.createElement('div');
    form_update.classList.add('passenger_update_form_body');

    var form= `
        <div class="passenger_form_left">

            <div class="form_div">
                <label for="driver_id" class="passenger_form_title">Driver Id <span class="passenger_form_require">*</span></label>
                <input type="text" name="driver_id" id="driver_id" class="form_data" placeholder="Enter Driver ID" required="required" />
            </div>
           <div class="form_div">
                <label for="passenger_id" class="passenger_form_title">Passenger ID <span class="passenger_form_require">*</span></label>
                <input type="text" name="passenger_id" id="passenger_id" class="form_data" placeholder="Enter Passenger ID" required="required" />
           </div>
           <div class="form_div">
                <label for="licence_no" class="passenger_form_title">License No <span class="passenger_form_require">*</span></label>
                <input type="text" name="licence_no" id="licence_no" class="form_data" placeholder="Enter License no" required="required" />
           </div>
           <div class="form_div">
                <label for="name" class="passenger_form_title">Name<span class="passenger_form_require">*</span></label>
                <input type="text" name="name" id="name" class="form_data" placeholder="Enter name" required="required" />
           </div>
           <div class="form_div">
                <label for="nic" class="passenger_form_title">Nic<span class="passenger_form_require">*</span></label>
                <input type="text" name="nic" id="nic" class="form_data" placeholder="Enter nic" required="required" />
           </div>
           <div class="form_div">
                <label for="mobile" class="passenger_form_title">Mobile number<span class="passenger_form_require">*</span></label>
                <input type="text" name="mobile" id="mobile" class="form_data" placeholder="Enter mobile number" required="required" />
           </div>
           <div class="form_div">
                <label for="email" class="passenger_form_title">Email<span class="passenger_form_require">*</span></label>
                <input type="text" name="email" id="email" class="form_data" placeholder="Enter Email" required="required" />
           </div>
           <div class="form_div">
                 <label for="points" class="passenger_form_title">Points <span class="passenger_form_require">*</span></label>
                 <input type="text" name="points" id="points" class="form_data" placeholder="Enter points" required="required" />
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


//function checkSessionStatus() {
//    fetch("../../../checkSessionController")
//        .then(response => {
//            if (response.status === 200) {
//                return response.json();
//            } else {
//                window.location.href = "http://localhost:2000/SmoothTix_war_exploded/Pages/login/html/login.html"
//            }
//        })
//        .then(data => {
//            p_id = data.p_id;
//            fetchAllData();
//        });
//}
//
//window.onload = function() {
//    checkSessionStatus(); // Call the function when the page loads
//    setInterval(checkSessionStatus, 60000); // Set up periodic checks
//};