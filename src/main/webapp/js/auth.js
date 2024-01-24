function isAuthenticated() {
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
        return Promise.resolve(false);
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
    };

    return fetch('/SmoothTix_war_exploded/loginController?action=validate', {
        method: 'GET',
        headers: headers,
    })
        .then(response => {
            if(response.ok){
                return Promise.resolve(true);
            }
            else{
                return Promise.resolve(false);
            }
        })
        .catch(error => {
            console.error('Error in isAuthenticated:', error);
            return Promise.resolve(false);
        });
}

function decodeJWT(token) {
    const [header, payload, signature] = token.split('.');
    return JSON.parse(atob(payload));
}

function changePage(privilege_level){
    if (privilege_level === 1) {
        window.location.href = `${url}/Pages/administrator/html/admin_dashboard_home.html`;
    } else if (privilege_level === 2) {
        window.location.href = `${url}/Pages/timekeeper/html/timekpr_dashboard_home.html`;
    } else if (privilege_level === 3) {
        window.location.href = `${url}/Pages/busemployee/html/owner_dashboard_home.html`;
    } else if (privilege_level === 4) {
        window.location.href = `${url}/Pages/busemployee/html/driver_dashboard_home.html`;
    } else if (privilege_level === 5) {
        window.location.href = `${url}/Pages/busemployee/html/conductor_dashboard_home.html`;
    } else if (privilege_level === 6) {
        window.location.href = `${url}/Pages/passenger/html/passenger_dashboard_home.html`;
    }
    else{
        console.log("Unauthorized")
    }
}