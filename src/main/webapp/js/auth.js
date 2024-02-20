let session_p_id = '';
let session_user_role = '6';
let session_user_name = 'UserName';

function isAuthenticated() {
     if(!(window.location.href.includes("login.html"))){
         const jwtToken = localStorage.getItem('jwtToken');

         if (!jwtToken) {
             window.location.href = `${url}/Pages/login/html/login.html`;
         }

         const headers = {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${jwtToken}`,
         };

         fetch('/SmoothTix_war_exploded/loginController?action=validate', {
             method: 'GET',
             headers: headers,
         })
             .then(response => {
                 console.log(response)
                 if(response.ok){
                     const decodedToken = decodeJWT(jwtToken);
                     session_p_id = decodedToken.p_id;
                     session_user_role = decodedToken.user_role;
                     session_user_name = decodedToken.user_name;

                     document.getElementById("userName").textContent = session_user_name;

                     if(window.location.href.includes("administrator") && session_user_role !== 1){
                         changePage(session_user_role);
                     }
                     else if(window.location.href.includes("timekpr") && session_user_role !== 2){
                         changePage(session_user_role);
                     }
                     else if(window.location.href.includes("owner") && session_user_role !== 3){
                         changePage(session_user_role);
                     }
                     else if(window.location.href.includes("driver") && session_user_role !== 4){
                         changePage(session_user_role);
                     }
                     else if(window.location.href.includes("conductor") && session_user_role !== 5){
                         changePage(session_user_role);
                     }
                     // else if(window.location.href.includes("passenger") && session_user_role !== 6){
                     //     changePage(session_user_role);
                     // }
                 }
                 else{
                     window.location.href = `${url}/Pages/login/html/login.html`;
                 }
             })
             .catch(error => {
                 console.error('Error in isAuthenticated:', error);
                 window.location.href = `${url}/Pages/login/html/login.html`;
             });
     }
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
        window.location.href = `${url}/Pages/login/html/login.html`;
        console.log("Unauthorized")
    }
}

function logout(){
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
        console.log("No session is created!")
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
    };

    fetch(`${ url }/loginController?action=logout`, {
        method: 'GET',
        headers: headers,
    })
        .then(response => {
            if(response.ok){
                window.location.href = `${url}/Pages/login/html/login.html`;
            }
            else{
                console.log("Logout failed: " + err);
            }
        })
        .catch(error => {
            console.error('Error in logout:', error);
        });
}