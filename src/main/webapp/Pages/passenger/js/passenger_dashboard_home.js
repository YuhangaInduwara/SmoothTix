<<<<<<< HEAD
isAuthenticated();

 function createForm() {
        const form_add = document.createElement('div');
        form_add.classList.add('bus_add_form_body');

        var form = `
            <div class="bus_form_left">
                <div class="form_div">
                    <label for="owner_id" class="bus_form_title">Owner NIC <span class="reg_form_require">*</span></label>
                    <input type="text" name="owner_id" id="owner_id" class="form_data" placeholder="Enter Owner NIC" required="required" />
                </div>
                <div class="form_div">
                    <label for="reg_no" class="bus_form_title">Registration No <span class="bus_form_require">*</span></label>
                    <input type="text" name="reg_no" id="reg_no" class="form_data" placeholder="Enter Registration No" required="required" />
                </div>
                <div class="form_div">
                    <label for="route_id" class="bus_form_title">Route Id <span class="bus_form_require">*</span></label>
                    <input type="text" name="route_id" id="route_id" class="form_data" placeholder="Enter Route_id" required="required" />
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


function openForm_add() {
    const existingForm = document.querySelector(".bus_add_form_body");

    if (!existingForm) {
        createForm();
    }

    document.getElementById("busRegForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
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
    document.getElementById("failMsg").innerHTML = "Operation failed (" + response + ")";
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
    const owner_id = document.getElementById("add_owner_id").value;
    const reg_no = document.getElementById("add_reg_no").value;
    const route_id = document.getElementById("add_route_id").value;
    const no_of_Seats = document.getElementById("add_no_of_Seats").value;


    const userData = {
        owner_id: owner_id,
        reg_no: reg_no,
        route_id: route_id,
        no_of_Seats: no_of_Seats,
    };
    console.log(userData)
    const jsonData = JSON.stringify(userData);

    fetch(`${ url }/busController`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                closeForm_add();
                openAlertSuccess("Successfully Added!");
            } else{
                return response.json()
                    .then(data => {
                        const error_msg = data.error;
                        openAlertFail(error_msg);
                        throw new Error("Failed");
                    });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
=======
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


>>>>>>> f0f64fb237bfb6faf9fe101d39e8331dceb8b6c9
