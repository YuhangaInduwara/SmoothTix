document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => init_page());
});

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
            const incrementInterval = 100; // Adjust the interval as needed (in milliseconds)
            const incrementStep = Math.ceil(totalRecords / (1000 / incrementInterval)); // Assuming 1000 ms is 1 second

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

function init_page(){
    document.getElementById("userName").textContent = session_user_name;
    document.getElementById("user").textContent = session_user_name;
    updateCount("passenger", document.getElementById("total_booking"));
    updateCount("timekeeper", document.getElementById("current_booking"));
    updateCount("bus", document.getElementById("date_time"));
}


