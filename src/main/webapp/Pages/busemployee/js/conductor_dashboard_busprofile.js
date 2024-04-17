isAuthenticated();
// Function to fetch data from the server
function fetchDataFromServer() {
    fetchPassengerData();
    fetchBusData();
    fetchDriverData();
}

// Function to fetch passenger data from the server
function fetchPassengerData() {
    fetch(`${url}/passengerController`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch passenger data');
            }
            return response.json();
        })
        .then(passengerData => {
            // Extract relevant information (e.g., passenger name) from the response
            const passengerName = passengerData.name; // Update with actual key names
            // Call function to display passenger name on the webpage
            displayPassengerName(passengerName);
        })
        .catch(error => {
            console.error('Error fetching passenger data:', error);
        });
}

// Function to fetch bus data from the server
function fetchBusData() {
    fetch(`${url}/busController`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch bus data');
            }
            return response.json();
        })
        .then(busData => {
            // Extract relevant information (e.g., bus number) from the response
            const busNumber = busData.number; // Update with actual key names
            // Call function to display bus number on the webpage
            displayBusNumber(busNumber);
        })
        .catch(error => {
            console.error('Error fetching bus data:', error);
        });
}

// Function to fetch driver data from the server
function fetchDriverData() {
    fetch(`${url}/driverController`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch driver data');
            }
            return response.json();
        })
        .then(driverData => {
            // Extract relevant information (e.g., driver name) from the response
            const driverName = driverData.name; // Update with actual key names
            // Call function to display driver name on the webpage
            displayDriverName(driverName);
        })
        .catch(error => {
            console.error('Error fetching driver data:', error);
        });
}

