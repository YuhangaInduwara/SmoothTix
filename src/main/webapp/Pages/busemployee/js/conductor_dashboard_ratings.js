document.addEventListener('DOMContentLoaded', function () {
   isAuthenticated().then(() => fetchConductorId());
});

function fetchConductorId() {
    document.getElementById("userName").textContent = session_user_name;
    fetch(`${ url }/conductorController?p_id=${session_p_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
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
//            console.log(data[0].conductor_id);
            fetchAllData(data[0].conductor_id)
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

function fetchAllData(conductor_id) {
    fetch(`${ url }/reviewController?conductor_id=${conductor_id}`, {
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

    data.forEach((item, index) => {
        console.log(item);
        const form = document.createElement("div");
        form.classList.add("box");

        const heading = document.createElement("h2");
        heading.classList.add("form-heading");
        heading.textContent = `Ratings ${index + 1}`;
        form.appendChild(heading);

        const innerForm = document.createElement("form");
        innerForm.id = `form${index + 1}`;

        const inputs = [
            { label: "Date & Time:", key: "date_time" },
            { label: "Route:", key: "route" },
            { label: "Bus:", key: "reg_no" },
            { label: "Points:", key: "conductor_points" }
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

        for (let i = 0; i < item.conductor_points; i++) {
            const star = document.createElement('span');
            star.textContent = '\u2B50'; //// Unicode character for star
            starsContainer.appendChild(star);
        }

        form.appendChild(innerForm);
        form.appendChild(starsContainer);
        formContainer.appendChild(form);
    });
}



