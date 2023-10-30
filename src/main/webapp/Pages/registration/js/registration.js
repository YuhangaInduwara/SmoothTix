document.getElementById("regForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const nic = document.getElementById("nic").value;
    const mobileNo = document.getElementById("mobileNo").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const priority = 6;

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
    const jsonData = JSON.stringify(userData);

    fetch('../../../registerController', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                openAlertSuccess()
            } else if (response.status === 401) {
                openAlertFail()
                console.log('Login unsuccessful');
            } else {
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function openAlertSuccess() {
    document.getElementById("registrationSuccess").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function openAlertFail() {
    document.getElementById("registrationFail").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    document.getElementById("registrationSuccess").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = '../../login/html/login.html';
}

function closeAlertFail() {
    document.getElementById("registrationFail").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
