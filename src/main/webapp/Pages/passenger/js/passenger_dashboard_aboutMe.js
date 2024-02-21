isAuthenticated();

let p_id = ""
// Fetch all data from the database
function fetchAllData() {

    fetch('../../../passengerController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': p_id
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
            <p class="data_box"><strong>First Name:</strong> ${item.first_name}</p>
            <p class="data_box"><strong>Last Name:</strong> ${item.last_name}</p>
            <p class="data_box"><strong>NIC:</strong> ${item.nic}</p>
            <p class="data_box"><strong>Email:</strong> ${item.email}</p>

            <div class="editDeleteButtons">
             <button class="okButton" onclick="update('${item.p_id}')" style="margin-right: 10px; margin-left: 10px">Edit</button>
             <button class="okButton" onclick="deleteEntity('${item.nic}')">Delete</button>
           </div>
        `;

        container.appendChild(paragraph);
    });
}

function update(p_id){
    openForm_update();

    let existingData = {};
<<<<<<< HEAD
=======

>>>>>>> c333b2a71d12dd2077ce963f3a05bd52fc34fa01

    const urlParams = new URLSearchParams(window.location.search);

    fetch('../../../passengerController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': p_id
        },
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    existingData = data[0];
<<<<<<< HEAD
                    console.log("existingData:", existingData);
                     document.getElementById("header_nic").innerHTML = existingData.first_name;

                    document.getElementById("update_first_name").value = existingData.first_name;
                    document.getElementById("update_last_name").value = existingData.last_name;
=======
                    document.getElementById("header_nic").innerHTML = existingData.first_name + " " + existingData.last_name + "'s";
                    document.getElementById("update_fname").value = existingData.first_name;
                    document.getElementById("update_lname").value = existingData.last_name;
>>>>>>> c333b2a71d12dd2077ce963f3a05bd52fc34fa01
                    document.getElementById("update_nic").value = existingData.nic;
                    document.getElementById("update_email").value = existingData.email;
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

        const first_name = document.getElementById("update_first_name").value;
        const last_name = document.getElementById("update_last_name").value;
        const nic = document.getElementById("update_nic").value;
        const email = document.getElementById("update_email").value;

        const updatedData = {
            first_name: first_name,
            last_name: last_name,
            nic: nic,
            email: email,
        };

        const jsonData = JSON.stringify(updatedData);

        fetch(`../../../passengerController`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'p_id': p_id
            },
            body: jsonData
        })
            .then(response => {
                if (response.ok) {
                    openAlertSuccess();
                    closeForm_update();
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
                <label for="first_name" class="passenger_form_title">First name <span class="passenger_form_require">*</span></label>
                <input type="text" name="first_name" id="first_name" class="form_data" placeholder="Enter first name" required="required" />
            </div>
           <div class="form_div">
                <label for="last_name" class="passenger_form_title">Last name <span class="passenger_form_require">*</span></label>
                <input type="text" name="last_name" id="last_name" class="form_data" placeholder="Enter last name" required="required" />
           </div>
           <div class="form_div">
                <label for="nic" class="passenger_form_title">NIC <span class="passenger_form_require">*</span></label>
                <input type="text" name="nic" id="nic" class="form_data" placeholder="Enter NIC" required="required" />
           </div>
           <div class="form_div">
                <label for="email" class="passenger_form_title">Email <span class="passenger_form_require">*</span></label>
                <input type="text" name="email" id="email" class="form_data" placeholder="Enter email" required="required" />
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


function checkSessionStatus() {
    fetch("../../../checkSessionController")
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                window.location.href = "http://localhost:2000/SmoothTix_war_exploded/Pages/login/html/login.html"
            }
        })
        .then(data => {
            p_id = data.p_id;
            fetchAllData();
        });
}

window.onload = function() {
    checkSessionStatus(); // Call the function when the page loads
    setInterval(checkSessionStatus, 60000); // Set up periodic checks
};