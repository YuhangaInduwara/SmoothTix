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
                 fetchAllData(data[0].conductor_id)
                    displayDataAsForms(data);

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
                    displayDataAsForms(data);

            })
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

    let totalPoints = 0;
    let formCount = 0;

 if (Array.isArray(data) && data.length > 0) {
    data.forEach((item, index) => {

        const form = document.createElement("div");
        form.classList.add("box");
        const dateHeading = document.createElement("h3");
        dateHeading.textContent = item.schedule_date;
        dateHeading.classList.add('heading');
        form.appendChild(dateHeading);
        const innerForm = document.createElement("form");
        innerForm.id = `form${index + 1}`;

        const inputs = [
            { label: "Time :", key: "schedule_time" },
            { label: "Route:", key: "route" },
            { label: "Bus:", key: "reg_no" },
            { label: "Points:", key: "conductor_points" }
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
            console.log(item[input.key])

            innerForm.appendChild(label);
            innerForm.appendChild(inputField);
        });

        const starsContainer = document.createElement('div');
        starsContainer.id = `stars-container${index + 1}`;
        starsContainer.classList.add('stars-container');

      //dynamically creates star elements based on the value of item.conductor_points
        for (let i = 0; i < item.conductor_points; i++) {
            const star = document.createElement('span');
            star.textContent = '\u2B50';
            starsContainer.appendChild(star);
            totalPoints += 1;
        }

        form.appendChild(innerForm);
        form.appendChild(starsContainer);
        formContainer.appendChild(form);
        formCount++;
    });

  //dynamically creates average points base on total points and form count
    const averagePoints = totalPoints / formCount;
    const averagePointsElement = document.createElement('p');
    averagePointsElement.textContent = `Average Points: ${averagePoints.toFixed(2)}`;
    averagePointsElement.classList.add("average-points");
    document.body.appendChild(averagePointsElement);
}else {

         const errorMessageForm = document.createElement("div");
         errorMessageForm.classList.add("box", "errorMgForm");
         const errorMessage = document.createElement("h2");
         errorMessage.classList.add("errorMgText");
         errorMessage.textContent = "You have no any points !";
         errorMessageForm.appendChild(errorMessage);
         formContainer.appendChild(errorMessageForm);
     }

}




