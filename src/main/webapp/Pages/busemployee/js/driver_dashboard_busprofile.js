document.addEventListener('DOMContentLoaded', function () {
   isAuthenticated().then(() => fetchDriverId());
});

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
        .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error fetching data:', response.status);
                }
            })
            .then(data => {
            console.log(data[0].driver_id);
            console.log(session_p_id);
            fetchAllData(data[0].driver_id)
//                if (data && data.length > 0) {
                    displayDataAsForms(data);
//                } else {
//                    console.log('No data available.');
//                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
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
  console.log(data);
                        displayDataAsForms(data);
    //                } else {
    //                    console.log('No data available.');
    //                }
                })
                .catch(error => {
                    console.error('Error:', error);
                            // Display error message as a form
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
    formContainer.innerHTML = ""; // Clear existing forms

    let formCount = 0;

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
                { label: "Bus Number:", key: "reg_no" },
                { label: "Route:", key: "route" },
                { label: "Conductor's Name:", key: "conductor_name" },
                { label: "Driver's Name:", key: "driver_name" }
            ];

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
            formCount++;
        });
    } else {
        // Display error message as a form
        const errorMessageForm = document.createElement("div");
        errorMessageForm.classList.add("box", "errorMgForm"); // Apply box style and error message form style

        const errorMessage = document.createElement("h2");
        errorMessage.classList.add("errorMgText"); // Apply error message text style
        errorMessage.textContent = "You are not assigned to any bus !";
        errorMessageForm.appendChild(errorMessage);
        formContainer.appendChild(errorMessageForm);
    }

    if (formCount > 3) {
        enableHorizontalScroll();
    }
}

function enableHorizontalScroll() {
//    const formContainer = document.getElementById("formContainer");
//    formContainer.classList.add("horizontal-scroll"); // Add class to enable horizontal scrolling
document.body.classList.add("horizontal-scroll"); // Add class to enable horizontal scrolling for body
}