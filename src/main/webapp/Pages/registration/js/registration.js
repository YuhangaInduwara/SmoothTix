document.getElementById("regForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const nic = document.getElementById("nic").value;
    const mobileNo = document.getElementById("mobileNo").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const priority = 6;

    // Create a JavaScript object representing the user data
    const userData = {
        fname: fname,
        lname: lname,
        nic: nic,
        mobileNo: mobileNo,
        email: email,
        password: password,
        priority: priority
    };
    console.log(userData)
    // Convert the JavaScript object to JSON
    const jsonData = JSON.stringify(userData);

    // Send a POST request with JSON data to your backend
    fetch('../../../registerController', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                // Successful login (status code 200), redirect to UserRegister.js
                window.location.href = '../../login/html/login.html';
            } else if (response.status === 401) {
                // Unauthorized login (status code 401), display an error message
                console.log('Login unsuccessful');
            } else {
                // Handle other status codes or errors
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

