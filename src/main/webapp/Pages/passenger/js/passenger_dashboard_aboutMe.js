document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

fetchAllData();

function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;
    fetch('../../../passengerController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id
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
             <button class="okButton" onclick="update('${item.p_id}')" style="margin-right: 10px; margin-left: 10px">Edit Information</button>
             <button class="okButton" onclick="openForm_changePassword()" style="margin-right: 10px; margin-left: 10px">Change Password</button>
           </div>
        `;

        container.appendChild(paragraph);
    });
}

function update(p_id){
    openForm_update();

    let existingData = {};
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

                    console.log("existingData:", existingData);
                    document.getElementById("update_first_name").value = existingData.first_name;
                    document.getElementById("update_last_name").value = existingData.last_name;
                    document.getElementById("header_nic").innerHTML = existingData.first_name + " " + existingData.last_name + "'s";
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
                    closeForm_update();
                    openAlert( "Profile Successfully Updated!", "alertSuccess");
                } else if (response.status === 401) {
                    openAlert( "Update unsuccessful", "alertFail");
                    console.log('Update unsuccessful');
                } else {
                    openAlert( "Update unsuccessful", "alertFail");
                    console.error('Error:', response.status);
                }
            })
            .catch(error => {
                openAlert( "Update unsuccessful", "alertFail");
                console.error('Error:', error);
            });
    });
}

document.getElementById("passengerPasswordForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const password = document.getElementById("update_current_password").value;
    const new_password = document.getElementById("update_new_password").value;
    const reenter_new_password = document.getElementById("update_reenter_new_password").value;
    console.log(password + " " + reenter_new_password + " " + new_password )
    console.log(session_p_id)
    fetch('../../../passengerController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id,
            'password': password
        },
    })
        .then(response => {
            if(response.ok){
                if(new_password === reenter_new_password){
                    const updatedPassword = {
                        password: new_password,
                    };
                    const jsonData = JSON.stringify(updatedPassword);
                    changePassword(jsonData);
                }
                else{
                    openAlert( "Passwords don't match", "alertFail");
                    console.log('Passwords don\'t match');
                }
            }
            else{
                openAlert( "Enter old password correctly", "alertFail");
            }
        })
        .catch(error => {
            openAlert( "Password update unsuccessful", "alertFail");
        });
});

function changePassword(jsonData) {
    console.log(session_p_id)
    fetch(`../../../passengerController`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                closeForm_changePassword();
                openAlert( "Password Successfully Updated!", "alertSuccess");
                console.log('Update successful');
            } else if (response.status === 401) {
                openAlert( "Password update unsuccessful", "alertFail");
                console.log('Update unsuccessful');
            } else {
                openAlert( "Password update unsuccessful", "alertFail");
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            openAlert( "Password update unsuccessful", "alertFail");
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
}

function openForm_changePassword() {
    const existingForm = document.querySelector(".passenger_password_form_body");

    if (!existingForm) {
        createPasswordForm();
    }

    document.getElementById("passengerPasswordForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_changePassword() {
    document.getElementById("passengerPasswordForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openAlert(text, alertBody){
    if(alertBody === "alertFail"){
        document.getElementById("alertMsg").textContent = text;
    }
    else{
        document.getElementById("alertMsgSuccess").textContent = text;
    }
    document.getElementById(alertBody).style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlert(){
    const alertSuccess = document.getElementById("alertSuccess");
    const alertFail = document.getElementById("alertFail");
    if(alertSuccess.style.display === "block" && alertFail.style.display === "block"){
        alertSuccess.style.display = "none";
        alertFail.style.display = "none";
    }
    else if(alertSuccess.style.display === "block"){
        alertSuccess.style.display = "none";
    }
    else if(alertFail.style.display === "block"){
        alertFail.style.display = "none";
    }
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/passenger_dashboard_aboutMe.html";
    refreshPage();
}

function createForm() {
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

    form_update.innerHTML = form.replace(/id="/g, 'id="update_');
    const formContainer_update = document.getElementById('formContainer_update');
    formContainer_update.appendChild(form_update.cloneNode(true));
}

function createPasswordForm(){
    const form_update = document.createElement('div');
    form_update.classList.add('passenger_password_form_body');

    var form= `
        <div class="passenger_form_left">

            <div class="form_div">
                <label for="current_password" class="passenger_form_title">Current Password <span class="passenger_form_require">*</span></label>
                <div class="password_container">
                    <input type="password" name="current_password" id="current_password" class="form_data" placeholder="Enter current password" required="required" />
                    <i class="fas fa-eye password_toggle" toggle-target="current_password"></i>
                </div>
            </div>
            <div class="form_div">
                <label for="new_password" class="passenger_form_title">New Password <span class="passenger_form_require">*</span></label>
                <div class="password_container">
                    <input type="password" name="new_password" id="new_password" class="form_data" placeholder="Enter new password" required="required" />
                    <i class="fas fa-eye password_toggle" toggle-target="new_password"></i>
                </div>
            </div>
            <div class="form_div">
                <label for="reenter_new_password" class="passenger_form_title">ReEnter New Password <span class="passenger_form_require">*</span></label>
                <div class="password_container">
                    <input type="password" name="reenter_new_password" id="reenter_new_password" class="form_data" placeholder="ReEnter new password" required="required" />
                    <i class="fas fa-eye password_toggle" toggle-target="reenter_new_password"></i>
                </div>
            </div>
        </div>

        `;

    form_update.innerHTML = form.replace(/id="/g, 'id="update_');
    const formContainer_updates = document.getElementById('formContainer_updates');
    formContainer_updates.appendChild(form_update.cloneNode(true));

}

document.querySelectorAll('.password_toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function() {
        let targetId = this.getAttribute('toggle-target');
        let targetInput = document.getElementById(targetId);

        if (targetInput.getAttribute('type') === 'password') {
            targetInput.setAttribute('type', 'text');
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            targetInput.setAttribute('type', 'password');
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
});
