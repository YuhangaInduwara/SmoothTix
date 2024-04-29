// This event listener waits for the DOMContentLoaded event before executing the provided function.
document.addEventListener('DOMContentLoaded', function () {
    // It calls the isAuthenticated function and then calls fetchOwnerId if the user is authenticated.
    isAuthenticated().then(() => fetchOwnerId());
});

// This function fetches the owner ID and then calls fetchAllData with the owner ID.
function fetchOwnerId() {
    // It sets the user name in the HTML element with the id "userName".
    document.getElementById("userName").textContent = session_user_name;

    // It fetches the owner ID from the server using a GET request.
    fetch(`${url}/ownerController?action=owner_id`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id,
        },
    })
    .then(response => {
        // If the response is successful, it returns the JSON data.
        if (response.ok) {
            return response.json();
        } else {
            // Otherwise, it throws an error.
            throw new Error('Error fetching data:', response.status);
        }
    })
    .then(data => {
        // It calls fetchAllData with the owner ID.
        fetchAllData(data.owner_id);
    })
    .catch(error => {
        // It catches any errors that occur during the fetch process.
        console.error('Error:', error);
    });
}

// This function fetches all data associated with a given owner ID.
function fetchAllData(owner_id) {
    // It fetches data associated with the owner ID from the server using a GET request.
    fetch(`${url}/reviewController?owner_id=${owner_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        // If the response is successful, it returns the JSON data.
        if (response.ok) {
            return response.json();
        } else {
            // Otherwise, it throws an error.
            throw new Error('Error fetching data:', response.status);
        }
    })
    .then(data => {
        // It calls displayDataAsForms with the fetched data.
        displayDataAsForms(data);
    })
    .catch(error => {
        // It catches any errors that occur during the fetch process and displays an error message.
        console.error('Error:', error);
        // It creates and appends an error message to the form container.
        const errorMessageForm = document.createElement("div");
        errorMessageForm.classList.add("box");

        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error fetching data. Please try again later.";

        errorMessageForm.appendChild(errorMessage);
        document.getElementById("formContainer").appendChild(errorMessageForm);
    });
}

// This function displays the fetched data as forms in the HTML.
function displayDataAsForms(data) {
    // It clears the form container.
    const formContainer = document.getElementById("formContainer");
    formContainer.innerHTML = "";

    // Variables to calculate average points and form count.
    let totalPoints = 0;
    let formCount = 0;

    // If there is data and it's an array with length greater than 0, it processes it.
    if (Array.isArray(data) && data.length > 0) {
        data.forEach((item, index) => {
            // For each item in the data array, it creates a form element.
            const form = document.createElement("div");
            form.classList.add("box");

            // It creates a heading element for the date.
            const dateHeading = document.createElement("h3");
            dateHeading.textContent = item.schedule_date;
            dateHeading.classList.add('heading');
            form.appendChild(dateHeading);

            // It creates input fields for various data points and populates them with the fetched data.
            const innerForm = document.createElement("form");
            innerForm.id = `form${index + 1}`;

            const inputs = [
                { label: "Date :", key: "schedule_date" },
                { label: "Time :", key: "schedule_time" },
                { label: "Route:", key: "route" },
                { label: "Bus:", key: "reg_no" },
                { label: "Points:", key: "bus_points" },
                { label: "Review:", key: "comments" }
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

            // It creates star icons based on the bus points and calculates the total points.
            const starsContainer = document.createElement('div');
            starsContainer.id = `stars-container${index + 1}`;
            starsContainer.classList.add('stars-container');

            for (let i = 0; i < item.bus_points; i++) {
                const star = document.createElement('span');
                star.textContent = '\u2B50';
                starsContainer.appendChild(star);
                totalPoints += 1;
            }

            // It appends the form and stars container to the form container.
            form.appendChild(innerForm);
            form.appendChild(starsContainer);
            formContainer.appendChild(form);

            formCount++;
        });

        // It calculates and displays the average points.
        const averagePoints = totalPoints / formCount;
        const averagePointsElement = document.createElement('p');
        averagePointsElement.textContent = `Average Points: ${averagePoints.toFixed(2)}`;
        averagePointsElement.classList.add("average-points");
        document.body.appendChild(averagePointsElement);
    } else {
        // If there's no data, it displays an error message.
        const errorMessageForm = document.createElement("div");
        errorMessageForm.classList.add("box", "errorMgForm");

        const errorMessage = document.createElement("h2");
        errorMessage.classList.add("errorMgText");
        errorMessage.textContent = "Your bus have no any Ratings !";
        errorMessageForm.appendChild(errorMessage);
        formContainer.appendChild(errorMessageForm);
    }
}
