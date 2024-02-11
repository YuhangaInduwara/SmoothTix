function goBack() {
    window.history.back();
}


document.addEventListener("DOMContentLoaded", function () {
    // Retrieve bus_id from local storage
    const busId = localStorage.getItem('selectedBusId');

    // Check if busId is not null or undefined
    if (busId) {
        // Fill the form with the bus_id
        document.getElementById('bus_id').innerText = busId;
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('feasibleScheduleForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const bus_id = localStorage.getItem('selectedBusId');
        const date = document.getElementById("date").value;
        const time_range = document.getElementById("time_range").value; // Corrected ID
        const availability = document.getElementById("availability").value;

        // Prepare data for AJAX request
        const formData = {
            bus_id: bus_id,
            date: date,
            time_range: time_range,
            availability: availability
        };

        // Perform AJAX request to update data in the database
        fetch(`${url}/feasibilityController`, { // Ensure that the 'url' variable is defined
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                // Data successfully updated in the database, you may want to show a success message
                console.log('Data updated successfully');
            } else {
                // Handle errors
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
