var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Assuming you have a marker variable declared globally
// Assuming you have a marker variable declared globally
let marker;

// Function to update marker position and focus map on it
function updateMarkerPosition(lat, lng) {
    if (!marker) {
        // Create a new marker if it doesn't exist
        marker = L.marker([lat, lng]).addTo(map);
    } else {
        // Update marker position if it exists
        marker.setLatLng([lat, lng]);
    }

    // Focus the map on the marker's new position and adjust zoom level
    map.setView([lat, lng], 12); // Adjust zoom level as needed
}

// Update the map and focus on the marker every 1 second (or any desired interval)
setInterval(function() {
    fetch('../../../locationController?schedule_id=SH0003', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Assuming data is an array with latitude and longitude properties
                const lat = data[0].latitude;
                const lng = data[0].longitude;
                console.log("lat: " + lat + " lng: " + lng);
                updateMarkerPosition(lat, lng);
            }
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}, 1000); // Adjust the interval as needed
