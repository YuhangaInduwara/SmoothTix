
isAuthenticated();
fetchPassengerData();

function fetchPassengerData() {
console.log(session_p_id)
fetch(`${url}/passengerController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id,
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
        console.log(passengerData)
        displayPassengerProfile(passengerData);
    })
    .catch(error => {
        console.error('Error fetching last passenger:', error);
    });
}

function displayPassengerProfile(passengers) {
    const formContainer = document.querySelector("#formContainer");

    console.log(passengers.last_name)

    // Clear existing content
    formContainer.innerHTML = '';

    // Create a form element
    passengers.forEach(passenger => {
    const form = document.createElement("form");

    // Create and append input elements for each field
    const firstNameInput = createTextInput("first_name", "First Name", passenger.first_name);
    const lastNameInput = createTextInput("last_name", "Last Name", passenger.last_name);
    const nicInput = createTextInput("nic", "NIC", passenger.nic);
    const emailInput = createTextInput("email", "Email", passenger.email);
   console.log(passenger.first_name)
    // Append input elements to the form
   form.append(firstNameInput, lastNameInput, nicInput, emailInput);

    // Append the form to the form container
    formContainer.appendChild(form);
     });

}

// Helper function to create text input elements
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


