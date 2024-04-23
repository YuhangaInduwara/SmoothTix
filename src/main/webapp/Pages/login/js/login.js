isAuthenticated();

function isValidNIC(nic) {
    const nicRegex = /^(\d{9}[vV]|\d{12})$/;
    return nicRegex.test(nic);
}

let email = '';
const nicInput = document.getElementById("nic");
const nicForgot = document.getElementById("nicForgot");
const nicError = document.getElementById("nicError");

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
        nicError.textContent = "Please enter a valid NIC number.";
        nicError.style.display = "block";
    } else {
        nicForgot.setCustomValidity("");
        nicError.textContent = "";
        nicError.style.display = "none";
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
    } else if (user_role === 3) {
        landingPage = 'http://localhost:2000/SmoothTix_war_exploded/Pages/busemployee/html/owner_dashboard_home.html';
    } else if (user_role === 4) {
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

        const OTP = generateOTP();
        console.log(OTP);

        const userData ={
            otp: OTP,
        };
        const jsonData = JSON.stringify(userData);
        console.log(userData);
        fetch(`${ url }/otpController`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'nic': nic
                },
                body: jsonData
            })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                    email = data.email;
                    console.log("email : "+ email);
                    openAlert("OTP Has Sent To Your Email", "alertSuccess");
                    document.getElementById("otpVerification").style.display = "block";
                    document.getElementById("forgotPassword").style.display = "none";
                });
                } else {
                    openAlert("Invalid NIC", "alertFail");
                    document.getElementById("overlay").style.display = "none";
                    document.getElementById("forgotPassword").style.display = "none";
                }
                })
            .catch(error => {
                console.error('Error:', error);
            });


});

document.querySelector(".resend").addEventListener("click", function(event){
    event.preventDefault();
    

});

function closeForgotPassword(){
    document.getElementById("forgotPassword").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function closeOTPVerification(){
    document.getElementById("otpVerification").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function generateOTP(){
    const OTP = Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("OTP", OTP);
    return OTP;
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
}