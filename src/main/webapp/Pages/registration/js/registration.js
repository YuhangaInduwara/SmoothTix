let counter = 3; // this is for check the attempts

// check the validity of the NIC
function isValidNIC(nic) {
    const nicRegex = /^(\d{9}[vVxX]|\d{12})$/;
    return nicRegex.test(nic);
}

// check the validity of the email
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// check for strong passwords function
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


const nicInput = document.getElementById("nic");
const nicError = document.getElementById("nicError");

// event listener for check the validity of the NIC
nicInput.addEventListener("change", function() {
    if (!isValidNIC(nicInput.value)) {
        nicInput.setCustomValidity("Please enter a valid NIC number.");
        nicError.textContent = "Please enter a valid NIC number.";
        nicError.style.display = "block";
    } else {
        fetch(`${ url }/passengerController?nic=${document.getElementById("nic").value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json()
                    .then(data => {
                        throw new Error("Login failed");
                    });
            }
        })
        .then(parsedResponse => {
            if(parsedResponse.length === 0){
                nicInput.setCustomValidity("");
                nicError.textContent = "";
                nicError.style.display = "none";
            }
            else{
                nicInput.setCustomValidity("This nic is already exist.");
                nicError.textContent = "This nic is already exist.";
                nicError.style.display = "block";
            }
        })

        .catch(error => {
            console.error('Error:', error);
        });

    }
});

const emailInput = document.getElementById("email");
const confirmPasswordInput = document.getElementById("password_confirm");
const confirmPasswordInputError = document.getElementById("password_confirm_error");
const emailError = document.getElementById("emailError");
const passwordInput = document.getElementById("password");
const passwordInputError = document.getElementById("passwordError");

// event listener for check the mismatching of the password
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

// event listener for check the password strong
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

// event listener for check the validity of the email
emailInput.addEventListener("change", function() {
    if (!isValidEmail(emailInput.value)) {
        emailInput.setCustomValidity("Please enter a valid email address.");
        emailError.textContent = "Please enter a valid email address.";
        emailError.style.display = "block";
    } else {
        emailInput.setCustomValidity("");
        emailError.textContent = "";
        emailError.style.display = "none";
    }
});

// when user click the register button this event listener called
let userEmail = '';
document.getElementById("regForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const nic = document.getElementById("nic").value;
    userEmail = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = {
        first_name: first_name,
        last_name: last_name,
        nic: nic,
        email: userEmail,
        password: password,
    };

    const jsonData = JSON.stringify(userData);
    localStorage.setItem("jsonData", jsonData);

    document.getElementById("loading-spinner").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    sendOTP(userEmail);
});

// function to generate OTP between 1000 and 9999
function generateOTP(){
    const OTP = Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("OTP", OTP);
    return OTP;
}

// if user's email is correct then this function called with that email
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
                document.getElementById("otpVerification").style.display = "flex";
            } else {
                document.getElementById("loading-spinner").style.display = "none";
                document.getElementById("loading-spinner2").style.display = "none";
                openAlert("Email Verification Failed!", "alertFail");
                document.getElementById("overlay").style.display = "none";
                setTimeout(function()
                {location.reload(true)},2000);
            }
            })
        .catch(error => {
            console.error('Error:', error);
        });
}

// function to verify the OTP
function verifyOTP(){
    const OTP = localStorage.getItem("OTP");
    const userOTP = document.getElementById("otp").value;

    // checking counter because below else if functions are reduce the counter
    if(OTP === userOTP && counter >= 1){
        document.getElementById("otpVerification").style.display = "none";
        const getJSON = localStorage.getItem("jsonData");

        fetch('/SmoothTix_war_exploded/registerController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: getJSON
        })
        .then(response => {
            if (response.ok) {
                openAlertSuccess()
            } else if (response.status === 401) {
                openAlertFail()
                console.log('Registration unsuccessful');
            } else {
                openAlertFail()
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    }else if(counter > 1){
        counter -= 1;
        // if user enter empty OTP counter reduced
        if(userOTP === ''){
            document.getElementById("empty_otp").textContent = "OTP can not be empty. Remaining attempts " + counter + "." ;
            return;
        }
        // if user enter incorrect OTP counter reduced
        document.getElementById("empty_otp").textContent = "Entered OTP is incorrect. Remaining attempts " + counter + ".";
    }else{
        openAlert("Too many attempts!", "alertFail");
            setTimeout(function() {
                location.reload(true);
            }, 2000);
            return;
    }
}

// resend OTP links here
document.querySelector(".resend").addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById("loading-spinner2").style.display = "block";
    sendOTP(userEmail);
    openAlert("OTP Has Sent To Your Email", "alertSuccess");
});

// function to limit the input to 4 digits
document.getElementById("otp").addEventListener("input", function() {
    if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
    }
});

// function to open success alert
function openAlertSuccess() {
    document.getElementById("registrationSuccess").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// function to open fail alert
function openAlertFail() {
    document.getElementById("registrationFail").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// function to close success alert
function closeAlertSuccess() {
    document.getElementById("registrationSuccess").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = '../../login/html/login.html';
}

// function to close fail alert
function closeAlertFail() {
    document.getElementById("registrationFail").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// function to close OTP verification
function closeOTPVerification(){
    document.getElementById("otpVerification").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// alert messages display here
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

// alert messages ok button
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