isAuthenticated();

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
            data.forEach(item => {
                targetElement.textContent = item.record_count;
            })
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

updateCount("passenger", document.getElementById("passenger_count"));
updateCount("timekeeper", document.getElementById("timekeeper_count"));
updateCount("bus", document.getElementById("bus_count"));
updateCount("driver", document.getElementById("driver_count"));
updateCount("conductor", document.getElementById("conductor_count"));
updateCount("route", document.getElementById("route_count"));





