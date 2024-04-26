
 function createForm() {
    const form_add = document.createElement('div');
    form_add.classList.add('bus_add_form_body');

    var form = `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="reg_no" class="bus_form_title">Registration No <span class="bus_form_require">*</span></label>
                <input type="text" name="reg_no" id="reg_no" class="form_data" placeholder="Enter Registration No" required="required" />
            </div>
        <div class="form_div">
            <label for="route_no" class="bus_form_title">Route Id <span class="bus_form_require">*</span></label>
            <input type="text" name="route_no" id="route_no" class="form_data" placeholder="Enter Route_id" required="required" oninput="showSuggestions1(event)" />
            <ul id="bus_route_suggestions" class="autocomplete-list"></ul>
        </div>
            <div class="form_div">
                <label for="no_of_Seats" class="bus_form_title">Number of Seats <span class="bus_form_require">*</span></label>
                <input type="number" name="no_of_Seats" id="no_of_Seats" class="form_data" placeholder="Enter Number of Seats" required="required" />
            </div>
        </div>
    `;

    form_add.innerHTML = form.replace(/id="/g, 'id="add_');
    const formContainer_add = document.getElementById('formContainer_add');
    formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form

}

function showSuggestions1(event) {
    const input = event.target;
    const inputValue = input.value.toUpperCase();
    const suggestionsContainer = document.getElementById(`autocomplete-container1`);
    if(inputValue === ""){
        suggestionsContainer.innerHTML = '';
    }
    else {
        fetch(`${url}/routeController`, {
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
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            })
            .then(data => {
                const suggestions = data.map(item => {
                    return {
                        route_no: item.route_no,
                        start: item.start,
                        destination: item.destination
                    };
                });
                suggestionsContainer.innerHTML = '';
                const filteredSuggestions = suggestions.filter(suggestion =>
                    suggestion.route_no.toUpperCase().includes(inputValue)
                );
                suggestionsContainer.style.maxHeight = '200px';
                suggestionsContainer.style.overflowY = 'auto';
                suggestionsContainer.style.width = '100%';
                suggestionsContainer.style.left = `18px`;
                if (filteredSuggestions.length === 0) {
                    const errorMessage = document.createElement('li');
                    errorMessage.textContent = 'No suggestions found';
                    suggestionsContainer.appendChild(errorMessage);
                } else {
                    filteredSuggestions.forEach(suggestion => {
                        const listItem = document.createElement('li');
                        listItem.classList.add('autocomplete-list-item');
                        listItem.textContent = `${suggestion.route_no} - ${suggestion.start} to ${suggestion.destination}`;
                        listItem.addEventListener('click', () => {
                            input.value = suggestion.route_no;
                            suggestionsContainer.innerHTML = '';
                        });
                        suggestionsContainer.appendChild(listItem);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}


function openForm_add() {
    fetch(`${url}/ownerController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id
        },
    })

    .then(response => {
        if (response.ok) {
            window.location.href = "../../busemployee/html/owner_dashboard_home.html";
        } else {
            const existingForm = document.querySelector(".bus_add_form_body");
            if (!existingForm) {
                createForm();
            }
            document.getElementById("busRegForm").style.display = "block";
            document.getElementById("overlay").style.display = "block";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function closeForm_add() {
    document.getElementById("busRegForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openAlertSuccess() {
    bus_id = "";
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    bus_id = "";
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../../busemployee/html/owner_dashboard_bus.html";
}

function openAlertFail(response) {
    bus_id = "";
    document.getElementById("failMsg").innerHTML = "Operation failed <br> (" + response + ")";
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    bus_id = "";
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/passenger_dashboard_home.html";
}

// Add new bus to the database
document.getElementById("busRegForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const reg_no = document.getElementById("add_reg_no").value;
    const route_no = document.getElementById("add_route_no").value;
    const no_of_Seats = document.getElementById("add_no_of_Seats").value;

    const userData = {
        reg_no: reg_no,
        route_no: route_no,
        no_of_Seats: no_of_Seats,
    };
    console.log(userData);
    const jsonData = JSON.stringify(userData);

    // Assuming `url` is defined elsewhere and `session_p_id` is available in your session storage or a similar place.
    fetch(`${url}/busController`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id
        },
        body: jsonData
    })
    .then(response => {
        if (response.ok) {
            // If the response is OK (200 status), handle success
            closeForm_add(); // Assuming this function closes your form
            openAlertSuccess("Successfully Added!"); // Assuming this function shows a success message
        } else if (response.status === 409) {
            // Handle the specific case of a conflict (duplicate entry)
            return response.text().then(error_msg => {
                openAlertFail(error_msg); // Assuming this function shows an error message
            });
        } else {
            // Handle other types of errors generically
            return response.text().then(error_msg => {
                openAlertFail("Failed to add bus: " + error_msg);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        openAlertFail("An error occurred while processing your request."); // General error handling
    });
});


document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => init_page());
});

function updateCount(targetElement) {
    fetch(`${url}/smoothPointController?p_id=${session_p_id}`, {
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
            const totalRecords = data.smooth_points;

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

function fetchNextBooking(){
    fetch(`${ url }/bookingController?p_id=${session_p_id}`, {
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
            console.log(data);
            const currentTime = new Date();
            console.log(currentTime);
            // Filter the bookings
            const latestBooking = data.filter(booking => {
                // Convert booking date and time to JavaScript Date object
                const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
                console.log(bookingDateTime);
                console.log(booking.status === 0);
                console.log(bookingDateTime > currentTime);
                // Check if booking status is 0 and booking date and time is greater than current time
                return booking.status === 0 && bookingDateTime > currentTime;
            });

            console.log(latestBooking);
            // Sort the filtered bookings by date and time in ascending order
            latestBooking.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA - dateB;
            });

            // Get the latest booking
            const latestBookingInfo = latestBooking[0];
            document.getElementById("current_booking").textContent = latestBookingInfo.date + " " + latestBookingInfo.time;
            console.log(latestBookingInfo);
            console.log(latestBookingInfo.date + " " + latestBookingInfo.time);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function init_page(){
    document.getElementById("userName").textContent = session_user_name;
    document.getElementById("user").textContent = session_user_name;
    updateCount(document.getElementById("smooth_points"));
    fetchNextBooking();
}