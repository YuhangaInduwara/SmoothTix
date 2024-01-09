isAuthenticated().then(result => {
    if (result === true) {
        const jwtToken = localStorage.getItem('jwtToken');
        const decodedToken = decodeJWT(jwtToken);
        const privilege_level = decodedToken.user_role;
        // console.log(privilege_level)
        // changePage(privilege_level)
    } else {
        console.log('Unauthenticated');
        window.location.href = `${url}/Pages/login/html/login.html`;
    }
});


function logout(){
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
        console.log("No session is created!")
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
    };

    fetch('/SmoothTix_war_exploded/loginController?action=logout', {
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

