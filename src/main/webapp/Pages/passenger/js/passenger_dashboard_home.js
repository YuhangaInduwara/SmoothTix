// create add a bus html form
function createForm() {
    const form_add = document.createElement('div');
    form_add.classList.add('bus_add_form_body');

    var form = `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="reg_no" class="bus_form_title">Registration No <span class="bus_form_require">*</span></label>
                <input type="text" name="reg_no" id="reg_no" class="form_data" placeholder="Eg : NB-XXXX" required="required" pattern="[A-Z]{2,3}-[0-9]{4}" title="Format: XX-1234 or XXX-1234"/>
            </div>
        <div class="form_div">
            <label for="route_no" class="bus_form_title">Route No <span class="bus_form_require">*</span></label>
            <input type="text" name="route_no" id="route_no" class="form_data" placeholder=" Eg : EX001 " required="required" oninput="showSuggestions1(event)" />
            <ul id="bus_route_suggestions" class="autocomplete-list"></ul>
        </div>
            <div class="form_div">
                <label for="no_of_Seats" class="bus_form_title">Number of Seats <span class="bus_form_require">*</span></label>
                <input type="number" name="no_of_Seats" id="no_of_Seats" class="form_data" placeholder="Eg : XX" required="required" pattern="[0-9]{2}" title="Format:50"/>
            </div>
        </div>
    `;

    form_add.innerHTML = form.replace(/id="/g, 'id="add_');
    const formContainer_add = document.getElementById('formContainer_add');
    formContainer_add.appendChild(form_add.cloneNode(true));
}

// this is called when entering the route
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

// this connects with front end Owner box
function openForm_add() {
    // Fetch data to check if the owner has any buses associated
    fetch(`${url}/busController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id
        },
    })
    .then(response => {
        if (response.ok) {
            // Convert response to JSON
            return response.json();
        } else {
            throw new Error('Failed to fetch bus data of passenger');
        }
    })
    .then(data => {
        // Check if the owner has any buses associated
        if (data && data.length > 0) {
            // If the owner has buses associated, redirect to the owner dashboard
            window.location.href = "../../busemployee/html/owner_dashboard_home.html";
        } else {
            const existingForm = document.querySelector(".bus_add_form_body");
            if (!existingForm) {
                // If the form is not displayed, create and display it
                createForm();
                document.getElementById("busRegForm").style.display = "block";
                document.getElementById("overlay").style.display = "block";
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error (e.g., display an error message)
    });
}

// function to close add bus form
function closeForm_add() {
    document.getElementById("busRegForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}


function openAlertSuccess(response) {
// function to open success alert
    bus_id = "";
    document.getElementById("successMsg").innerHTML = response ;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// function to close success alert
function closeAlertSuccess() {
    bus_id = "";
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/passenger_dashboard_home.html";
}

// function to open fail alert
function openAlertFail(response) {
    bus_id = "";
    document.getElementById("failMsg").innerHTML = "Operation failed <br> (" + response + ")";
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// function to close fail alert
function closeAlertFail() {
    bus_id = "";
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/passenger_dashboard_home.html";
}

// event listener for add a bus
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

    const jsonData = JSON.stringify(userData);

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
            closeForm_add();
            openAlertSuccess("Operation Successful! <br> Your bus request is pending for approval.");
        } else if (response.status === 409) {
            return response.text().then(error_msg => {
                openAlertFail(error_msg);
            });
        } else {
            return response.text().then(error_msg => {
                openAlertFail("Failed To Add Bus: " + error_msg);
            });
        }
    })
    .catch(error => {
        openAlertFail("An Error Occurred While Processing Your Request.");
    });
});

// session management
document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => init_page());
});

// count smooth points and display
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
            const incrementInterval = 100;
            const incrementStep = Math.ceil(totalRecords / (1000 / incrementInterval));

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

// show next booking
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
            const currentTime = new Date();

            const latestBooking = data.filter(booking => {
                const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
                return booking.status === 0 && bookingDateTime > currentTime;
            });

            latestBooking.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA - dateB;
            });

            const latestBookingInfo = latestBooking[0];
            document.getElementById("current_booking").textContent = latestBookingInfo.date + " " + latestBookingInfo.time;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// initialize the page
function init_page(){
    document.getElementById("userName").textContent = session_user_name;
    document.getElementById("user").textContent = session_user_name;
    updateCount(document.getElementById("smooth_points"));
    fetchNextBooking();
}