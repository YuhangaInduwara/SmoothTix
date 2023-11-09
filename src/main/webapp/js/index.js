function checkSessionStatus() {
    fetch("./checkSessionController")
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                window.location.href = "http://localhost:2000/SmoothTix_war_exploded/Pages/login/html/login.html"
            }
        })
        .then(data => {
            const privilege_level = data.user_role;
            if (privilege_level === 1) {
                window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/administrator/html/admin_dashboard_home.html';
            } else if (privilege_level === 2) {
                window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/timekeeper/html/timekpr_dashboard_home.html';
            } else if (privilege_level === 3) {
                window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/busemployee/html/owner_dashboard_home.html';
            } else if (privilege_level === 4) {
                window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/busemployee/html/driver_dashboard_home.html';
            } else if (privilege_level === 5) {
                window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/busemployee/html/conductor_dashboard_home.html';
            } else if (privilege_level === 6) {
                window.location.href = 'http://localhost:2000/SmoothTix_war_exploded/Pages/passenger/html/passenger_dashboard_home.html';
            }
        });
}




