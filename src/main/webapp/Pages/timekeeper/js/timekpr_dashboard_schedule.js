// Fetch all data from the database
function fetchAllData() {
    fetch('../../../scheduleController', {
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
            displayDataAsTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

fetchAllData();

// Display all data
function displayDataAsTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");

    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
            <td>${item.schedule_id}</td>
            <td>${item.date}</td>
            <td>${item.route_id}</td>
            <td>${item.start}</td>
            <td>${item.destination}</td>
            <td>${item.start_time}</td>
            <td>${item.end_time}</td>
            <td>
                <span class="icon-container">
                    <i onclick="updateRow('${item.schedule_id}')"><img src="../../../images/vector_icons/update_icon.png" alt="update" class="action_icon"></i>
                </span>
                <span class="icon-container" style="margin-left: 1px;">
                    <i onclick="deleteRow('${item.schedule_id}')"><img src="../../../images/vector_icons/delete_icon.png" alt="delete" class="action_icon"></i>
                </span>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Add new bus to the database
document.getElementById("busRegForm").addEventListener("submit", function(event) {
   event.preventDefault();

   const schedule_id = document.getElementById("add_schedule_id").value;
   const date = document.getElementById("add_date").value;
   const route_id = document.getElementById("add_route_id").value;
   const start = document.getElementById("add_start").value;
   const destination = document.getElementById("add_destination").value;
   const start_time = document.getElementById("add_start_time").value;
   const end_time = document.getElementById("add_end_time").value;


   const userData = {
       schedule_id: schedule_id,
       date: date,
       route_id: route_id,
       start: start,
       destination: destination,
       start_time: start_time,
       end_time: end_time
   };
   console.log(userData)
   const jsonData = JSON.stringify(userData);

   fetch('../../../scheduleController', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: jsonData
   })
       .then(response => {
           if (response.ok) {
               closeForm_add();
               openAlertSuccess();
           } else if (response.status === 401) {
               openAlertFail();
               console.log('Registration unsuccessful');
           } else {
               openAlertFail();
               console.error('Error:', response.status);
           }
       })
       .catch(error => {
           console.error('Error:', error);
       });
});

// Handle update
function updateRow(schedule_id){
   openForm_update();

   let existingData = {};

   const urlParams = new URLSearchParams(window.location.search);

   document.getElementById("header_bus_id").innerHTML = schedule_id

   fetch('../../../scheduleController', {
       method: 'GET',
       headers: {
           'Content-Type': 'application/json',
           'schedule_id': schedule_id
       },
   })
       .then(response => {
           if (response.ok) {
               response.json().then(data => {
                   existingData = data[0];
                   console.log("existingData:", existingData);

                   document.getElementById("update_schedule_id").value = existingData.schedule_id;
                   document.getElementById("update_date").value = existingData.date;
                   document.getElementById("update_route_id").value = existingData.route_id;
                   document.getElementById("update_start").value = existingData.start;
                   document.getElementById("update_destination").value = existingData.destination;
                   document.getElementById("update_start_time").value = existingData.start_time;
                   document.getElementById("update_end_time").value = existingData.end_time;

               });
           } else if (response.status === 401) {
               console.log('Unauthorized');
           } else {
               console.error('Error:', response.status);
           }
       })
       .catch(error => {
           console.error('Error:', error);
       });

   document.getElementById("busUpdateForm").addEventListener("submit", function(event) {
       event.preventDefault();

       const schedule_id = document.getElementById("update_schedule_id").value;
       const date = document.getElementById("update_date").value;
       const route_id = document.getElementById("update_route_id").value;
       const start = document.getElementById("update_start").value;
       const destination = document.getElementById("update_destination").value;
       const start_time = document.getElementById("update_start_time").value;
       const end_time = document.getElementById("update_end_time").value;


       const updatedData = {
           schedule_id: schedule_id,
           date: date,
           route_id: route_id,
           start: start,
           destination: destination,
           start_time: start_time,
           end_time: end_time,

       };

       const jsonData = JSON.stringify(updatedData);

       fetch(`../../../scheduleController`, {
           method: 'PUT',
           headers: {
               'Content-Type': 'application/json',
               'schedule_id': schedule_id
           },
           body: jsonData
       })
           .then(response => {
               if (response.ok) {
                   openAlertSuccess()
               } else if (response.status === 401) {
                   console.log('Update unsuccessful');
               } else {
                   console.error('Error:', response.status);
               }
           })
           .catch(error => {
               console.error('Error:', error);
           });
   });
}

// Handle delete
function deleteRow(schedule_id){
   fetch(`../../../scheduleController`, {
       method: 'DELETE',
       headers: {
           'Content-Type': 'application/json',
           'schedule_id': schedule_id
       },
   })
       .then(response => {
           if (response.ok) {
               openAlertSuccess()
           } else if (response.status === 401) {
               console.log('Update unsuccessful');
           } else {
               console.error('Error:', response.status);
           }
       })
       .catch(error => {
           console.error('Error:', error);
       });
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

function openForm_update() {
   const existingForm = document.querySelector(".bus_update_form_body");

   if (!existingForm) {
       createForm();
   }

   document.getElementById("busUpdateForm").style.display = "block";
   document.getElementById("overlay").style.display = "block";
}

function closeForm_update() {
   document.getElementById("busUpdateForm").style.display = "none";
   document.getElementById("overlay").style.display = "none";
}

function openAlertSuccess() {
   document.getElementById("successAlert").style.display = "block";
   document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
   document.getElementById("successAlert").style.display = "none";
   document.getElementById("overlay").style.display = "none";
   window.location.href = '../html/timekpr_dashboard_schedule.html';

}

function openAlertFail() {
   document.getElementById("failAlert").style.display = "block";
   document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
   document.getElementById("failAlert").style.display = "none";
   document.getElementById("overlay").style.display = "none";
   window.location.href = "../html/admin_dashboard_buses.html";
}

// Create the add and update forms
function createForm() {
   const form_add = document.createElement('div');
   form_add.classList.add('bus_add_form_body');

   const form_update = document.createElement('div');
   form_update.classList.add('bus_update_form_body');

   var form= `
       <div class="bus_form_left">
           <div class="form_div">
               <label for="schedule_id" class="bus_form_title">Schedule Id <span class="bus_form_require">*</span></label>
               <input type="text" name="schedule_id" id="schedule_id" class="form_data" placeholder="Enter the Schedule ID" required="required" />
           </div>
           <div class="form_div">
               <label for="date" class="bus_form_title"> Date <span class="reg_form_require">*</span></label>
               <input type="text" name="date" id="date" class="form_data" placeholder="Enter the Date" required="required" />
           </div>
           <div class="form_div">
               <label for="route_id" class="bus_form_title">Route Id <span class="bus_form_require">*</span></label>
               <input type="text" name="route_id" id="route_id" class="form_data" placeholder="Enter Route Id" required="required" />
           </div>
           <div class="form_div">
               <label for="start" class="bus_form_title">Start Location <span class="bus_form_require">*</span></label>
               <input type="text" name="start" id="start" class="form_data" placeholder="Enter Start Location" required="required" />
           </div>
           <div class="form_div">
               <label for="destination" class="bus_form_title">Destination <span class="bus_form_require">*</span></label>
               <input type="text" name="destination" id="destination" class="form_data" placeholder="Enter Destination" required="required" />
           </div>
           <div class="form_div">
               <label for="start_time" class="bus_form_title">StartTime <span class="bus_form_require">*</span></label>
               <input type="text" name="start_time" id="start_time" class="form_data" placeholder="Enter Start Time" required="required" />
           </div>
           <div class="form_div">
               <label for="end_time" class="bus_form_title">End Time<span class="bus_form_require">*</span></label>
               <input type="text" name="end_time" id="end_time" class="form_data" placeholder="Enter End Time" required="required" />
           </div>
       </div>
       `;

   form_add.innerHTML = form.replace(/id="/g, 'id="add_');
   form_update.innerHTML = form.replace(/id="/g, 'id="update_');
   const formContainer_add = document.getElementById('formContainer_add');
   const formContainer_update = document.getElementById('formContainer_update');

   formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form
   formContainer_update.appendChild(form_update.cloneNode(true)); // Clone the form
}

// Attach the searchData function to the keyup event of the search input field
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchData);

// Handle search
function searchData() {
   const tableBody = document.querySelector("#dataTable tbody");
   tableBody.innerHTML = "";

   const searchTerm = document.getElementById("searchInput").value;

   if (searchTerm.trim() === "") {
       fetchAllData();
       return;
   }

   fetch('../../../scheduleController', {
       method: 'GET',
       headers: {
           'Content-Type': 'application/json',
           'schedule_id': searchTerm
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
           displayDataAsTable(data);
       })
       .catch(error => {
           console.error('Error:', error);
       });
}