// session management (authentication and authorization)
document.addEventListener('DOMContentLoaded', function () {
   isAuthenticated().then(() => fetchPassengerData());
});

function fetchPassengerData() {
fetch(`${url}/passengerController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id, // header includes the passenger ID (session_p_id)
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .then(passengerData => {
        displayPassengerProfile(passengerData);
    })
    .catch(error => {
        console.error('Error fetching last passenger:', error);
    });
}

//iterates over an array of passenger objects (passengers) and creates a form for each passenger
function displayPassengerProfile(passengers) {
    const formContainer = document.querySelector("#formContainer");
    formContainer.innerHTML = '';
    passengers.forEach(passenger => {
    const form = document.createElement("form");
    const fullName = passenger.first_name + ' ' + passenger.last_name;
    const nameInput = createTextInput("name", "Name", fullName);
    const nicInput = createTextInput("nic", "NIC", passenger.nic);
    const emailInput = createTextInput("email", "Email", passenger.email);
    form.append(nameInput, nicInput, emailInput);
    formContainer.appendChild(form);
    });
}

//createTextInput function creates a text input field with a corresponding label
function createTextInput(id, label, value) {
    const input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.name = id;
    input.value = value || "";
    input.readOnly = true;
    const inputLabel = document.createElement("label");
    inputLabel.textContent = label;
    inputLabel.appendChild(input);
    return inputLabel;
}
