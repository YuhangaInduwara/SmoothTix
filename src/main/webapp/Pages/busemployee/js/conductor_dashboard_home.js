
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

//function displayPassengerProfile(passengers) {
//    const formContainer = document.querySelector("#formContainer");
//
//    // Clear existing content
//    formContainer.innerHTML = '';
//
//    // Loop through each passenger
//    passengers.forEach(passenger => {
//        // Create a form element
//        const form = document.createElement("form");
//
//        // Create and append input elements for each field
//        const firstNameInput = createTextInput("first_name", "First Name", passenger.first_name);
//        const lastNameInput = createTextInput("last_name", "Last Name", passenger.last_name);
//        const nicInput = createTextInput("nic", "NIC", passenger.nic);
//        const emailInput = createTextInput("email", "Email", passenger.email);
//
//        // Append input elements to the form
//        form.append(firstNameInput, lastNameInput, nicInput, emailInput);
//
//        // Append the form to the form container
//        formContainer.appendChild(form);
//    });
//}
//
//// Helper function to create text input elements
//function createTextInput(id, label, value) {
//    const input = document.createElement("input");
//    input.type = "text";
//    input.id = id;
//    input.name = id;
//    input.value = value || ""; // Set the value of the input field
//    input.readOnly = true;
//
//    const inputLabel = document.createElement("label");
//    inputLabel.textContent = label;
//    inputLabel.appendChild(input);
//
//    return inputLabel;
//}
function displayPassengerProfile(passengers) {
    const formContainer = document.querySelector("#formContainer");

    // Clear existing content
    formContainer.innerHTML = '';

    // Loop through each passenger
    passengers.forEach(passenger => {
        // Create a form element
        const form = document.createElement("form");

        // Concatenate first_name and last_name into a single name
        const fullName = passenger.first_name + ' ' + passenger.last_name;

        // Create and append input elements for each field
        const nameInput = createTextInput("name", "Name", fullName); // Use fullName here
        const nicInput = createTextInput("nic", "NIC", passenger.nic);
        const emailInput = createTextInput("email", "Email", passenger.email);

        // Append input elements to the form
        form.append(nameInput, nicInput, emailInput);

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
    input.value = value || ""; // Set the value of the input field
    input.readOnly = true;

    const inputLabel = document.createElement("label");
    inputLabel.textContent = label;
    inputLabel.appendChild(input);

    return inputLabel;
}
