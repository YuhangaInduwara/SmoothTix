isAuthenticated();

function isValidNIC(nic) {
    const nicRegex = /^(\d{9}[vV]|\d{12})$/;
    return nicRegex.test(nic);
}

let email = '';
let pid = '';
const nicInput = document.getElementById("nic");
const nicError = document.getElementById("nicError");
const nicForgot = document.getElementById("nicForgot");
const nicForgotError = document.getElementById("nicForgotError");

nicInput.addEventListener("change", function() {
    if (!isValidNIC(nicInput.value)) {
        nicInput.setCustomValidity("Please enter a valid NIC number.");
        nicError.textContent = "Please enter a valid NIC number.";
        nicError.style.display = "block";
    } else {
        nicInput.setCustomValidity("");
        nicError.textContent = "";
        nicError.style.display = "none";
    }
});

nicForgot.addEventListener("change", function() {
    if (!isValidNIC(nicForgot.value)) {
        nicForgot.setCustomValidity("Please enter a valid NIC number.");
        nicForgotError.textContent = "Please enter a valid NIC number.";
        nicForgotError.style.display = "block";
    } else {
        nicForgot.setCustomValidity("");
        nicForgotError.textContent = "";
        nicForgotError.style.display = "none";
    }
});

let landingPage= '../../passenger/html/passenger_dashboard_home.html'
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const nic = document.getElementById("nic").value;
    const password = document.getElementById("password").value;

    const userData = {
        nic: nic,
        password: password,
    };
    const jsonData = JSON.stringify(userData);

    fetch(`${ url }/loginController`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json()
                    .then(data => {
                        const error_msg = data.error;
                        openAlertFail(error_msg);
                        throw new Error("Login failed");
                    });
            }
        })
        .then(parsedResponse => {
            const jwtToken = parsedResponse.token;
            localStorage.setItem('jwtToken', jwtToken);
            let user_role = parsedResponse.user_role;
            openAlertSuccess(user_role)
        })

        .catch(error => {
            console.error('Error:', error);
        });
});

function openAlertSuccess(user_role) {
    if (user_role === 1) {
        landingPage = 'http://localhost:2000/SmoothTix_war_exploded/Pages/administrator/html/admin_dashboard_home.html';
    } else if (user_role === 2) {
        landingPage = 'http://localhost:2000/SmoothTix_war_exploded/Pages/timekeeper/html/timekpr_dashboard_home.html';
    }
    // else if (user_role === 3) {
    //     landingPage = 'http://localhost:2000/SmoothTix_war_exploded/Pages/busemployee/html/owner_dashboard_home.html';
    // }
    else if (user_role === 4) {
        landingPage = 'http://localhost:2000/SmoothTix_war_exploded/Pages/busemployee/html/driver_dashboard_home.html';
    } else if (user_role === 5) {
        landingPage = 'http://localhost:2000/SmoothTix_war_exploded/Pages/busemployee/html/conductor_dashboard_home.html';
    } else if (user_role === 6) {
        landingPage = '../../passenger/html/passenger_dashboard_home.html';
    }
    document.getElementById("loginSuccess").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function openAlertFail(error_msg) {
    document.getElementById("failMsg").textContent = error_msg;
    document.getElementById("loginFail").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    document.getElementById("loginSuccess").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = landingPage;
}

function closeAlertFail() {
    document.getElementById("loginFail").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function forgotPassword(){
    document.getElementById("forgotPassword").style.display = "block";
    document.getElementById("overlay").style.display = "block";

}

document.querySelector(".getOTPButton").addEventListener("click", function(event) {
        event.preventDefault();
        const nic = document.getElementById("nicForgot").value;
        console.log(nic);
        if (!nic) {
            alert("Please enter your NIC.");
            return;
        }

        document.getElementById("loading-spinner").style.display = "block";

        fetch(`${ url }/passengerController`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'nic': nic
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }else {
                document.getElementById("loading-spinner").style.display = "none";
                openAlert("Invalid NIC", "alertFail");
            }
       })
            .then(data => {
                email = data.email;
                pid = data.p_id;
                sendOTP(email);
            })
        .catch(error => {
            console.error('Error:', error);
        });
});

function formatEmail(email) {
    const atIndex = email.indexOf("@");
    const formattedEmail = email.charAt(0) + "*".repeat(atIndex - 1) + email.substring(atIndex);
    return formattedEmail;
}

function sendOTP(email){
    const OTP = generateOTP();

    const userData ={
        otp: OTP,
        email: email
    };
    const jsonData = JSON.stringify(userData);
    fetch(`${ url }/otpController`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                document.getElementById("loading-spinner").style.display = "none";
                document.getElementById("loading-spinner2").style.display = "none";
                document.getElementById("user_email").value = formatEmail(email);
                document.getElementById("otpVerification").style.display = "block";
                document.getElementById("forgotPassword").style.display = "none";
            } else {
                document.getElementById("loading-spinner").style.display = "none";
                document.getElementById("loading-spinner2").style.display = "none";
                openAlert("Invalid NIC", "alertFail");
                document.getElementById("overlay").style.display = "none";
                document.getElementById("forgotPassword").style.display = "none";
            }
            })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.querySelector(".resend").addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById("loading-spinner2").style.display = "block";
    sendOTP(email);
    openAlert("OTP Has Sent To Your Email", "alertSuccess");
});

function closeForgotPassword(){
    document.getElementById("forgotPassword").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function closeOTPVerification(){
    document.getElementById("otpVerification").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function closeChangePassword(){
    document.getElementById("changePassword").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

const confirmPasswordInput = document.getElementById("confirmPassword");
const confirmPasswordInputError = document.getElementById("confirmPasswordError");
const passwordInput = document.getElementById("newPassword");
const passwordInputError = document.getElementById("newPasswordError");

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

confirmPasswordInput.addEventListener("input", function() {
    if (document.getElementById("newPassword").value !== document.getElementById("confirmPassword").value) {
        confirmPasswordInput.setCustomValidity("Password should be matched.");
        confirmPasswordInputError.textContent = "Password should be matched.";
        confirmPasswordInputError.style.display = "block";
    } else {
        confirmPasswordInput.setCustomValidity("");
        confirmPasswordInputError.textContent = "";
        confirmPasswordInputError.style.display = "none";
    }
});

passwordInput.addEventListener("input", function() {
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


function generateOTP(){
    const OTP = Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("OTP", OTP);
    return OTP;
}

function verifyOTP(){
    const OTP = localStorage.getItem("OTP");
    const userOTP = document.getElementById("otp").value;

    if(OTP === userOTP){
        document.getElementById("otpVerification").style.display = "none";
        document.getElementById("changePassword").style.display = "block";

        document.getElementById("updatePassword"),addEventListener("submit", function(event) {
            event.preventDefault();
            const newPassword = document.getElementById("newPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if(newPassword === confirmPassword && newPassword != null){
                const updatedPassword = {
                    password: newPassword,
                };
                const jsonData = JSON.stringify(updatedPassword);
                fetch(`${ url }/passengerController`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'p_id': pid
                    },
                    body: jsonData
                })
                    .then(response => {
                        if (response.ok) {
                            openAlert( "Password Successfully Updated!", "alertSuccess");
                            document.getElementById("changePassword").style.display = "none";
                            document.getElementById("overlay").style.display = "none";
                            console.log('Update successful');
                            setTimeout(function()
                                {location.reload(true)},2000);

                        } else if (response.status === 401) {
                            openAlert( "Password Update Failed!", "alertFail");
                            document.getElementById("changePassword").style.display = "none";
                            document.getElementById("overlay").style.display = "none";
                            console.log('Update unsuccessful');
                        } else {
                            openAlert( "Password Update Unsuccessful", "alertFail");
                            document.getElementById("changePassword").style.display = "none";
                            document.getElementById("overlay").style.display = "none";
                            console.error('Error:', response.status);
                        }
                    })
                    .catch(error => {
                        openAlert( "Password Update Unsuccessful", "alertFail");
                        document.getElementById("changePassword").style.display = "none";
                        document.getElementById("overlay").style.display = "none";
                        console.error('Error:', error);
                    });
            }else{
                openAlert( "Passwords Unmatched", "alertFail");
                document.getElementById("changePassword").style.display = "none";
                document.getElementById("overlay").style.display = "none";
                console.log('Password mismatch');
            }
        });
    }else{
        openAlert("OTP Verification Failed !", "alertFail");
        document.getElementById("otpVerification").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        console.log('OTP mismatch');
        setTimeout(function()
            {location.reload(true)},2000);
    }
}

document.getElementById("otp").addEventListener("input", function() {
    if (this.value.length > 4) {
        this.value = this.value.slice(0, 4); // Limit the input to 4 digits
    }
});

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
}