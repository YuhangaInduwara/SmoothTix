function isAuthenticated() {
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
        // If token is not present, consider the user not authenticated
        return Promise.resolve(false);
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
    };

    return fetch('/SmoothTix_war_exploded/loginController', {
        method: 'GET',
        headers: headers,
    })
        .then(response => {
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        })
        .catch(error => {
            console.error('Error in isAuthenticated:', error);
            return false; // Consider the user not authenticated in case of an error
        });
}

function decodeJWT(token) {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
}
