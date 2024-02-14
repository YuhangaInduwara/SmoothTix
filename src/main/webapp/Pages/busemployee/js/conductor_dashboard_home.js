let conductor_id = ""
//
//if(isAuthenticated()){
//    const jwtToken = localStorage.getItem('jwtToken');
//    if(jwtToken){
//        const decodedToken = decodeJWT(jwtToken);
//        booking_p_id = decodedToken.p_id;
//    }
//    else{
//        window.location.href = `${url}/Pages/login/html/login.html`;
//    }
//}
//else{
//    window.location.href = `${url}/Pages/login/html/login.html`;
//}

function fetchPassengerDetails() {
    fetch(`${url}/passengerController/${p_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Error:', response.status);
            }
        })
        .then(data => {
            displayPassengerDetails(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

