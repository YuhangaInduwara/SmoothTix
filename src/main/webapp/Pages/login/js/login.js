let landingPage= '../../passenger/html/passenger_dashboard_home.html'
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("hello")
    const nic = document.getElementById("nic").value;
    const password = document.getElementById("password").value;

    const userData = {
        nic: nic,
        password: password,
    };
    console.log(userData)
    const jsonData = JSON.stringify(userData);

    fetch('../../../loginController', {
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
                openAlertFail()
                throw new Error("Login failed");
            }
        })
        .then(parsedResponse => {


            const priority = parsedResponse.priority;
            openAlertSuccess(priority)
        })


        .catch(error => {
            console.error('Error:', error);
        });
});

function openAlertSuccess(priority) {
    if (priority === 1) {
        landingPage = '../../administrator/html/admin_dashboard_home.html';
    } else if (priority === 2) {
        landingPage = '../../timekeeper/html/timekpr_dashboard_home.html';
    } else if (priority === 3) {
        landingPage = '../../busemployee/html/owner_dashboard_home.html';
    } else if (priority === 4) {
        landingPage = '../../busemployee/html/driver_dashboard_home.html';
    } else if (priority === 5) {
        landingPage = '../../busemployee/html/conductor_dashboard_home.html';
    } else if (priority === 6) {
        landingPage = '../../passenger/html/passenger_dashboard_home.html';
    }
    document.getElementById("loginSuccess").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function openAlertFail() {
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
    // window.location.href = "../html/login.html";
}
