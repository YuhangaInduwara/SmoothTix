

//if (isAuthenticated()) {
//    const jwtToken = localStorage.getItem('jwtToken');
//    if (jwtToken) {
//        const decodedToken = decodeJWT(jwtToken);
//        p_id = decodedToken.p_id; // Assuming p_id is stored in the JWT payload
//    } else {
//        window.location.href = `${url}/Pages/login/html/login.html`;
//    }
//} else {
//    window.location.href = `${url}/Pages/login/html/login.html`;
//}

function fetchPassengerDetails(p_id) {
    fetch(`${url}/passengerController/${p_id}`)
        .then(response => response.json())
        .then(data => {
            // Populate HTML elements with passenger details
            document.getElementById('firstName').textContent = data.first_name;
            document.getElementById('lastName').textContent = data.last_name;
            document.getElementById('email').textContent = data.email;
            document.getElementById('nic').textContent = data.nic;
        })
        .catch(error => {
            console.error('Error fetching passenger details:', error);
            // Handle the error appropriately, e.g., display an error message to the user
        });
}

function getConductorPId() {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
        // Decode the JWT token and extract the p_id
        const decodedToken = decodeJWT(jwtToken);
        const p_id = decodedToken.po_id;
        if (p_id) {
            return p_id;
        } else {
            // Handle the case where p_id is not available in the token
            throw new Error('p_id not found in authentication token');
        }
    } else {
        // Handle the case where the conductor is not logged in
        throw new Error('Conductor is not logged in');
    }
}

window.onload = function() {
    try {
        const conductorPId = getConductorPId();
        fetchPassengerDetails(conductorPId);
    } catch (error) {
        // Handle the error appropriately, e.g., redirect to login page
    }
};
