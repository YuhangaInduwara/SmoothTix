document.addEventListener('DOMContentLoaded', function () {
   isAuthenticated().then(() => fetchOwnerId());
});

function fetchOwnerId() {
    document.getElementById("userName").textContent = session_user_name;
    fetch(`${ url }/ownerController?action=owner_id`, {
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
//
            fetchAllData(data.owner_id)
            console.log(data.owner_id)
//                if (data && data.length > 0) {
//                    displayDataAsForms(data);
//                } else {
//                    console.log('No data available.');
//                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

function fetchAllData(owner_id) {
console.log(owner_id)
    fetch(`${ url }/reviewController?owner_id=${owner_id}`, {
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
            console.log(data)
//                if (data && data.length > 0) {
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

    let totalPoints = 0;
    let formCount = 0;

 if (Array.isArray(data) && data.length > 0) {
    data.forEach((item, index) => {
        console.log(item);
        const form = document.createElement("div");
        form.classList.add("box");

        const dateHeading = document.createElement("h3");
        dateHeading.textContent = item.schedule_date;
        dateHeading.classList.add('heading');
        form.appendChild(dateHeading);

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

        console.log(inputs)

        inputs.forEach(input => {
            const label = document.createElement("label");
            label.setAttribute("for", `${input.key}${index + 1}`);
            label.textContent = input.label;

            const inputField = document.createElement("input");
            inputField.setAttribute("type", "text");
            inputField.setAttribute("id", `${input.key}${index + 1}`);
            inputField.setAttribute("name", `${input.key}${index + 1}`);
            inputField.value = item[input.key];
            console.log(item[input.key])

            innerForm.appendChild(label);
            innerForm.appendChild(inputField);
        });

        // Display stars based on the number of points
        const starsContainer = document.createElement('div');
        starsContainer.id = `stars-container${index + 1}`;
        starsContainer.classList.add('stars-container');

        for (let i = 0; i < item.bus_points; i++) {
            const star = document.createElement('span');
            star.textContent = '\u2B50'; // Unicode character for star
            starsContainer.appendChild(star);
            totalPoints += 1; // Add each point to the total
        }

        form.appendChild(innerForm);
        form.appendChild(starsContainer);
        formContainer.appendChild(form);

        formCount++; // Increment form count for each form displayed
    });

    // Calculate the average points
    const averagePoints = totalPoints / formCount;

    // Display the average points at the bottom of the page
    const averagePointsElement = document.createElement('p');
    averagePointsElement.textContent = `Average Points: ${averagePoints.toFixed(2)}`; // Display average with two decimal places
    averagePointsElement.classList.add("average-points");
    document.body.appendChild(averagePointsElement);
}else {
         // Display error message as a form
         const errorMessageForm = document.createElement("div");
         errorMessageForm.classList.add("box", "errorMgForm"); // Apply box style and error message form style

         const errorMessage = document.createElement("h2");
         errorMessage.classList.add("errorMgText"); // Apply error message text style
         errorMessage.textContent = "Your bus have no any Ratings !";
         errorMessageForm.appendChild(errorMessage);
         formContainer.appendChild(errorMessageForm);
     }

}


