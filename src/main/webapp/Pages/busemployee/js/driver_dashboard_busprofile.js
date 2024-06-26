// session management (authentication and authorization)
document.addEventListener('DOMContentLoaded', function () {
   isAuthenticated().then(() => fetchDriverId());
});

//fetch data about a driverr based on a provided passenger ID (p_id).
function fetchDriverId() {
    document.getElementById("userName").textContent = session_user_name;
    console.log(session_p_id)
    fetch(`${ url }/driverController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id,
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
                    fetchAllData(data[0].driver_id)
                    displayDataAsForms(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        //HTTP GET request to fetch all data related to a specific driver
function fetchAllData(driver_id) {
    document.getElementById("userName").textContent = session_user_name;
        fetch(`${ url }/busprofileController?driver_id=${driver_id}`, {
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

           //Each object represents an input field that will be rendered in the form
            const inputs = [
                { label: "Bus Number:", key: "reg_no" },
                { label: "Route:", key: "route" },
                { label: "Conductor's Name:", key: "conductor_name" },
                { label: "Driver's Name:", key: "driver_name" }
            ];

//dynamically creates HTML elements for each input field
            inputs.forEach(input => {
                const label = document.createElement("label");
                label.setAttribute("for", `${input.key}${index + 1}`);
                label.textContent = input.label;
                const inputField = document.createElement("input");
                inputField.setAttribute("type", "text");
                inputField.setAttribute("id", `${input.key}${index + 1}`);
                inputField.setAttribute("name", `${input.key}${index + 1}`);
                inputField.value = item[input.key];

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

