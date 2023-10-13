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
                throw new Error("Login failed");
            }
        })
        .then(parsedResponse => {
            const priority = parsedResponse.priority;
            if (priority === 1) {
                window.location.href = '../../administrator/html/admin_dashboard_home.html';
            } else if (priority === 2) {
                window.location.href = '../../timekeeper/html/timekpr_dashboard_home.html';
            } else if (priority === 3) {
                window.location.href = '../../busemployee/html/owner_dashboard_home.html';
            } else if (priority === 4) {
                window.location.href = '../../busemployee/html/driver_dashboard_home.html';
            } else if (priority === 5) {
                window.location.href = '../../busemployee/html/conductor_dashboard_home.html';
            } else if (priority === 6) {
                window.location.href = '../../passenger/html/passenger_dashboard_home.html';
            }
        })

        .catch(error => {
            console.error('Error:', error);
        });
});
