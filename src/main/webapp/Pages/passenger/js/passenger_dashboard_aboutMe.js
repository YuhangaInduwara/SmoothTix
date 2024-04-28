let isMatched;

document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});

function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;
    fetch(`${ url }/passengerController`, {
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

    fetch(`${ url }/passengerController`, {
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

        fetch(`${ url }/passengerController`, {
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
                    openAlert( "Update Unsuccessful", "alertFail");
                } else {
                    openAlert( "Update Unsuccessful", "alertFail");
                }
            })
            .catch(error => {
                openAlert( "Update Unsuccessful", "alertFail");
            });
    });
}

document.getElementById("passengerPasswordForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const password = document.getElementById("current_password").value;
    const new_password = document.getElementById("new_password").value;
    const reenter_new_password = document.getElementById("reenter_new_password").value;

    fetch(`${ url }/passengerController`, {
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
                    openAlert( "Passwords Are Not Matching", "alertFail");
                    console.log('Passwords Don\'t Match');
                }
            }
            else{
                openAlert( "Enter Old Password Correctly", "alertFail");
            }
        })
        .catch(error => {
            openAlert( "Password Update Unsuccessful", "alertFail");
        });
});

function changePassword(jsonData) {
    console.log(session_p_id)
    fetch(`${ url }/passengerController`, {
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
            } else if (response.status === 401) {
                openAlert( "Password Update Failed", "alertFail");
            } else {
                openAlert( "Password Update Unsuccessful", "alertFail");
            }
        })
        .catch(error => {
            openAlert( "Password Update Failed", "alertFail");
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

function isStrongPassword(password) {
    if (password.length < 8) {
        return false;
    }
    if (!/[a-z]/.test(password)) {
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    if (!/\d/.test(password)) {
        return false;
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        return false;
    }
    return true;
}

const confirmPasswordInput = document.getElementById("reenter_new_password");
const confirmPasswordInputError = document.getElementById("reenter_new_password_error");
const passwordInput = document.getElementById("new_password");
const passwordInputError = document.getElementById("new_passwordError");

confirmPasswordInput.addEventListener("change", function() {
    if (document.getElementById("password").value !== document.getElementById("password_confirm").value) {
        confirmPasswordInput.setCustomValidity("Password should be matched.");
        confirmPasswordInputError.textContent = "Password should be matched.";
        confirmPasswordInputError.style.display = "block";
    } else {
        confirmPasswordInput.setCustomValidity("");
        confirmPasswordInputError.textContent = "";
        confirmPasswordInputError.style.display = "none";
    }
});

passwordInput.addEventListener("change", function() {
    if (!isStrongPassword(passwordInput.value)) {
        passwordInput.setCustomValidity("Password should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.");
        passwordInputError.textContent = "Password should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.";
        passwordInputError.style.display = "block";
    } else {
        passwordInput.setCustomValidity("");
        passwordInputError.textContent = "";
        passwordInputError.style.display = "none";
    }
});
