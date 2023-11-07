function isValidNIC(nic) {
    const nicRegex = /^(\d{9}[vVxX]|\d{12})$/;
    return nicRegex.test(nic);
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

const nicInput = document.getElementById("nic");
const nicError = document.getElementById("nicError");

nicInput.addEventListener("change", function() {
    if (!isValidNIC(nicInput.value)) {
        nicInput.setCustomValidity("Please enter a valid NIC number.");
        nicError.textContent = "Please enter a valid NIC number.";
        nicError.style.display = "block";
    } else {
        nicInput.setCustomValidity("");
        nicError.textContent = "";
        nicError.style.display = "none";
    }
});

const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

emailInput.addEventListener("change", function() {
    if (!isValidEmail(emailInput.value)) {
        emailInput.setCustomValidity("Please enter a valid email address.");
        emailError.textContent = "Please enter a valid email address.";
        emailError.style.display = "block";
    } else {
        emailInput.setCustomValidity("");
        emailError.textContent = "";
        emailError.style.display = "none";
    }
});


document.getElementById("regForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const nic = document.getElementById("nic").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = {
        first_name: first_name,
        last_name: last_name,
        nic: nic,
        email: email,
        password: password,
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
                console.log('Registration unsuccessful');
            } else {
                openAlertFail()
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

