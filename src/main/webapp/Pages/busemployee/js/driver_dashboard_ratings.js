document.addEventListener('DOMContentLoaded', function () {
   isAuthenticated().then(() => fetchDriverId());
});

function fetchDriverId() {
    document.getElementById("userName").textContent = session_user_name;
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
//
            fetchAllData(data[0].driver_id)
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

function fetchAllData(driver_id) {
console.log(driver_id)
    fetch(`${ url }/reviewController?driver_id=${driver_id}`, {
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
            });
        }

function displayDataAsForms(data) {
    const formContainer = document.getElementById("formContainer");
    formContainer.innerHTML = ""; // Clear existing forms

    let totalPoints = 0;
    let formCount = 0;

    data.forEach((item, index) => {
        console.log(item);
        const form = document.createElement("div");
        form.classList.add("box");

        // Remove heading creation

        const innerForm = document.createElement("form");
        innerForm.id = `form${index + 1}`;

        const inputs = [
            { label: "Date & Time:", key: "date_time" },
            { label: "Route:", key: "route" },
            { label: "Bus:", key: "reg_no" },
            { label: "Points:", key: "driver_points" }
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

        for (let i = 0; i < item.driver_points; i++) {
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
}
