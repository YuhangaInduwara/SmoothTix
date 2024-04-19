document.addEventListener('DOMContentLoaded', function () {
   isAuthenticated().then(() => fetchBusprofileData());
});
function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;
    fetch(`${ url }/busprofileController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Error:', response.status);
            }
        })
        .then(data => {
            allData = data;
            console.log(allData)
            updatePage(currentPage,false);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayDataAsForms(data) {
    const formContainer = document.getElementById("formContainer");
    formContainer.innerHTML = ""; // Clear existing forms

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
            { label: "Bus Number:", key: "bus_registration_no" },
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
    });
}

