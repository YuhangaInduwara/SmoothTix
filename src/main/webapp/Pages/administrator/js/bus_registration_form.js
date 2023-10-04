document.getElementById("busRegForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const bus_id = document.getElementById("bus_id").value;
    const owner_id = document.getElementById("owner_id").value;
    const engineNo = document.getElementById("engineNo").value;
    const chassisNo = document.getElementById("chassisNo").value;
    const noOfSeats = document.getElementById("noOfSeats").value;
    const manufact_year = document.getElementById("manufact_year").value;
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;

    const userData = {
        bus_id: bus_id,
        owner_id: owner_id,
        engineNo: engineNo,
        chassisNo: chassisNo,
        noOfSeats: noOfSeats,
        manufact_year: manufact_year,
        brand: brand,
        model: model
    };
    console.log(userData)
    const jsonData = JSON.stringify(userData);

    fetch('../../../busController', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '../html/admin_dashboard_buses.html';
            } else if (response.status === 401) {
                console.log('Registration unsuccessful');
            } else {
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

