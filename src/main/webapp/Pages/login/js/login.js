// function checkSessionStatus() {
//     fetch("../../../checkSessionController")
//         .then(response => {
//             if (response.status === 200) {
//                 return response.json();
//             } else {
//                 window.location.href = "http://localhost:2000/SmoothTix_war_exploded/Pages/login/html/login.html"
//             }
//         })
//         .then(data => {
//             const privilege_level = data.user_role;
//             if (privilege_level === 1) {
//                 window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/administrator/html/admin_dashboard_home.html';
//             } else if (privilege_level === 2) {
//                 window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/timekeeper/html/timekpr_dashboard_home.html';
//             } else if (privilege_level === 3) {
//                 window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/busemployee/html/owner_dashboard_home.html';
//             } else if (privilege_level === 4) {
//                 window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/busemployee/html/driver_dashboard_home.html';
//             } else if (privilege_level === 5) {
//                 window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/busemployee/html/conductor_dashboard_home.html';
//             } else if (privilege_level === 6) {
//                 window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/passenger/html/passenger_dashboard_home.html';
//             }
//         });
// }

function isValidNIC(nic) {
    const nicRegex = /^(\d{9}[vV]|\d{12})$/;
    return nicRegex.test(nic);
}

const nicInput = document.getElementById("nic");
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

    fetch('/SmoothTix_war_exploded/loginController', {
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
        landingPage = 'http://localhost:2000/SmoothTix_war_exploded/Pages/passenger/html/passenger_dashboard_home.html';
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
