// session management (authentication and authorization)
document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => init_page());
});

// get different tables counts from database
function updateCount(request_table, targetElement) {
        fetch(`${url}/itemCountController?request_table=${request_table}`, {
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
                const totalRecords = data[0].record_count;

                let currentCount = 0;
                const incrementInterval = 100;
                const incrementStep = Math.ceil(totalRecords / (1000 / incrementInterval));

                // add a counter to display the data
                const incrementTimer = setInterval(() => {
                    currentCount += incrementStep;
                    targetElement.textContent = currentCount;

                    if (currentCount >= totalRecords) {
                        clearInterval(incrementTimer);
                        targetElement.textContent = totalRecords;
                    }
                }, incrementInterval);
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
}

// initialize the home page for showing data on tiles
function init_page(){
    document.getElementById("userName").textContent = session_user_name;
    updateCount("passenger", document.getElementById("passenger_count"));
    updateCount("timekeeper", document.getElementById("timekeeper_count"));
    updateCount("bus", document.getElementById("bus_count"));
    updateCount("driver", document.getElementById("driver_count"));
    updateCount("conductor", document.getElementById("conductor_count"));
    updateCount("route", document.getElementById("route_count"));
}


