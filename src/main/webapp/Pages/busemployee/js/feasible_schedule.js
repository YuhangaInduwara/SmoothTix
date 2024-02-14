function goBack() {
    window.history.back();
}

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve bus_profile_id from local storage
    const bus_profile_id = localStorage.getItem('selectedBusId');

    // Check if busId is not null or undefined
    if (bus_profile_id) {
        // Fill the form with the bus_profile_id
        document.getElementById('bus_profile_id').innerText = bus_profile_id;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('feasibleScheduleForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm()) {
            const bus_profile_id = localStorage.getItem('selectedBusId');
            const date = document.getElementById("date").value;
            const time_range = getCheckedTimeRanges();
            const availability = document.getElementById("availability").value;

            // Prepare data for AJAX request
            const formData = {
                bus_profile_id: bus_profile_id,
                date: date,
                time_range: time_range,
                availability: availability
            };

            // Perform AJAX request to update data in the database
            fetch(`${url}/feasibilityController`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    openAlertSuccess("Data Successfully Added!");
                    console.log('Success');
                } else {
                    return response.json()
                        .then(data => {
                            const error_msg = data.error;
                            console.log(error_msg);
                            openAlertFail(error_msg);
                            console.error('Error:', response.status);
                        });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    function getCheckedTimeRanges() {
        const checkboxes = document.querySelectorAll('input[name="time_range[]"]:checked');
        const timeRanges = Array.from(checkboxes).map(checkbox => checkbox.value);
        return timeRanges.join(','); // You can modify the format as needed
    }

    // Rest of your functions (openAlertSuccess, openAlertFail, closeAlertSuccess, closeAlertFail)...

    function validateForm() {
        var checkboxes = document.querySelectorAll('input[name="time_range[]"]:checked');
        if (checkboxes.length === 0) {
            openAlertFail("Please select at least one time range.");
            return false;
        }
        return true;
    }
});

function openAlertSuccess(msg) {
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function openAlertFail(error_msg) {
    document.getElementById("failMsg").textContent = error_msg;
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = `${url}/Pages/busemployee/html/feasible_schedule.html`;
}

function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
