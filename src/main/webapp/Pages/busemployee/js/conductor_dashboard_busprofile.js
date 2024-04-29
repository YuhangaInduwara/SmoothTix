// session management (authentication and authorization)
document.addEventListener('DOMContentLoaded', function () {
   isAuthenticated().then(() => fetchConductorId());
});

//fetch data about a conductor based on a provided passenger ID (p_id).
function fetchConductorId() {
    document.getElementById("userName").textContent = session_user_name;
    fetch(`${ url }/conductorController?p_id=${session_p_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    //if the response is OK parses the response body as JSON and returns the parsed data
        .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error fetching data:', response.status);
                }
        })

//handles the parsed data received from the server
        .then(data => {
                 fetchAllData(data[0].conductor_id)
                 displayDataAsForms(data);

            })
        .catch(error => {
                console.error('Error:', error);
        });
}

//HTTP GET request to fetch all data related to a specific conductor
function fetchAllData(conductor_id) {
    fetch(`${url}/busprofileController?conductor_id=${conductor_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error fetching data:', response.status);
        }
    })
    .then(data => {
        displayDataAsForms(data);
    })
    //handles errors that occur during the fetch request
    .catch(error => {
        console.error('Error:', error);

        const errorMessageForm = document.createElement("div");
        errorMessageForm.classList.add("box");
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error fetching data. Please try again later.";
        errorMessageForm.appendChild(errorMessage);
        document.getElementById("formContainer").appendChild(errorMessageForm);
    });
}

function displayDataAsForms(data) {
    const formContainer = document.getElementById("formContainer");
    formContainer.innerHTML = "";

//this responsible for rendering data received from the server as forms on the webpage
    if (Array.isArray(data) && data.length > 0) {
        data.forEach((item, index) => {
            const form = document.createElement("div");
            form.classList.add("box");
            const heading = document.createElement("h2");
            heading.classList.add("form-heading");
            heading.textContent = `Bus Profile ${index + 1}`;
            form.appendChild(heading);
            const innerForm = document.createElement("form");
            innerForm.id = `form${index + 1}`;

            const inputs = [
            //Each object represents an input field that will be rendered in the form
                { label: "Bus Number:", key: "reg_no" },
                { label: "Route:", key: "route" },
                { label: "Conductor's Name:", key: "conductor_name" },
                { label: "Driver's Name:", key: "driver_name" }
            ];

      //dynamically creates HTML elements for each input field
            inputs.forEach(input => {
                const label = document.createElement("label"); //For each input object, it creates a <label>
                label.setAttribute("for", `${input.key}${index + 1}`);//generates a unique identifier for the input field by combining the key property from the inputs
                label.textContent = input.label; //sets the text content of the <label> element to the value specified in the label property of the current input object
                const inputField = document.createElement("input"); //create new input
                inputField.setAttribute("type", "text"); //sets the type attribute of the input field to "text"
                inputField.setAttribute("id", `${input.key}${index + 1}`);
                inputField.setAttribute("name", `${input.key}${index + 1}`);
                inputField.value = item[input.key];  // sets the value of the input field to the value of the corresponding property in the item object

                innerForm.appendChild(label);
                innerForm.appendChild(inputField);
            });

            form.appendChild(innerForm);
            formContainer.appendChild(form);

        });
    } else {

        const errorMessageForm = document.createElement("div");
        errorMessageForm.classList.add("box", "errorMgForm");
        const errorMessage = document.createElement("h2");
        errorMessage.classList.add("errorMgText");
        errorMessage.textContent = "You are not assigned to any bus !";
        errorMessageForm.appendChild(errorMessage);
        formContainer.appendChild(errorMessageForm);
    }
}

