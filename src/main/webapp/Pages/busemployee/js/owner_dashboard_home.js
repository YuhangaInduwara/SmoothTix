document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => fetchAllData());
});
function fetchAllData() {
    document.getElementById("userName").textContent = session_user_name;
    fetch('../../../conductorController', {
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
        .catch(error => {
            console.error('Error:', error);
        });
}

fetchAllData();

// Display all data
//function displayDataAsTable(data) {
//    const tableBody = document.querySelector("#dataTable tbody");
//
//    data.forEach(item => {
//        const row = document.createElement("tr");
//
//        row.innerHTML = `
//            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
//            <td>${item.conductor_id}</td>
//            <td>${item.nic}</td>
//            <td>
//                <span class="icon-container">
//                    <i class="fas fa-pencil-alt" style="color: #ff0202" onclick="updateRow('${item.bus_id}')"></i>
//                </span>
//                <span class="icon-container" style="margin-left: 10px;"> <!-- Adjust the margin as needed -->
//                    <i class="fas fa-trash-alt" style="color: #ff0202" onclick="deleteRow('${item.bus_id}')"></i>
//                </span>
//            </td>
//        `;
//
//        tableBody.appendChild(row);
//    });
//}
//
//// Add new bus to the database
//document.getElementById("conductorForm").addEventListener("submit", function(event) {
//    event.preventDefault();
//
//    const conductor_id = document.getElementById("add_conductor_id").value;
//    const nic = document.getElementById("add_nic").value;
//
//    const userData = {
//        conductor_id: conductor_id,
//        nic: nic,
//    };
//    console.log(userData)
//    const jsonData = JSON.stringify(userData);
//
//    fetch('../../../conductorController', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: jsonData
//    })
//        .then(response => {
//            if (response.ok) {
//                closeForm_add();
//                openAlertSuccess();
//            } else if (response.status === 401) {
//                openAlertFail();
//                console.log('operation unsuccessful');
//            } else {
//                openAlertFail();
//                console.error('Error:', response.status);
//            }
//        })
//        .catch(error => {
//            console.error('Error:', error);
//        });
//});
//
//// Handle update
//function updateRow(conductor_id){
//    openForm_update();
//
//    let existingData = {};
//
//    const urlParams = new URLSearchParams(window.location.search);
//
//    document.getElementById("header_conductor_id").innerHTML = conductor_id
//
//    fetch('../../../conductorController', {
//        method: 'GET',
//        headers: {
//            'Content-Type': 'application/json',
//            'conductor_id': conductor_id
//        },
//    })
//        .then(response => {
//            if (response.ok) {
//                response.json().then(data => {
//                    existingData = data[0];
//                    console.log("existingData:", existingData);
//
//                    document.getElementById("update_conductor_id").value = existingData.conductor_id;
//                    document.getElementById("update_nic").value = existingData.nic;
//                });
//            } else if (response.status === 401) {
//                console.log('Unauthorized');
//            } else {
//                console.error('Error:', response.status);
//            }
//        })
//        .catch(error => {
//            console.error('Error:', error);
//        });
//
//    document.getElementById("conductorUpdateForm").addEventListener("submit", function(event) {
//        event.preventDefault();
//
//        const conductor_id = document.getElementById("update_conductor_id").value;
//        const nic = document.getElementById("update_nic").value;
//
//        const updatedData = {
//            conductor_id: conductor_id,
//            nic: nic,
//
//        };
//
//        const jsonData = JSON.stringify(updatedData);
//
//        fetch(`../../../conductorController`, {
//            method: 'PUT',
//            headers: {
//                'Content-Type': 'application/json',
//                'conductor_id': conductor_id
//            },
//            body: jsonData
//        })
//            .then(response => {
//                if (response.ok) {
//                    window.location.href = '../html/owner_dashboard_conductor.html';
//                } else if (response.status === 401) {
//                    console.log('Update unsuccessful');
//                } else {
//                    console.error('Error:', response.status);
//                }
//            })
//            .catch(error => {
//                console.error('Error:', error);
//            });
//    });
//}
//
//// Handle delete
//function deleteRow(conductor_id){
//    fetch(`../../../conductorController`, {
//        method: 'DELETE',
//        headers: {
//            'Content-Type': 'application/json',
//            'conductor_id': conductor_id
//        },
//    })
//        .then(response => {
//            if (response.ok) {
//                window.location.href = '../html/owner_dashboard_conductor.html';
//            } else if (response.status === 401) {
//                console.log('Delete unsuccessful');
//            } else {
//                console.error('Error:', response.status);
//            }
//        })
//        .catch(error => {
//            console.error('Error:', error);
//        });
//}
//
//function openForm_add() {
//    const existingForm = document.querySelector(".conductor_add_form_body");
//
//    if (!existingForm) {
//        createForm();
//    }
//
//    document.getElementById("conductorForm").style.display = "block";
//    document.getElementById("overlay").style.display = "block";
//}
//
//function closeForm_add() {
//    document.getElementById("conductorForm").style.display = "none";
//    document.getElementById("overlay").style.display = "none";
//}
//
//function openForm_update() {
//    const existingForm = document.querySelector(".conductor_update_form_body");
//
//    if (!existingForm) {
//        createForm();
//    }
//
//    document.getElementById("conductorUpdateForm").style.display = "block";
//    document.getElementById("overlay").style.display = "block";
//}
//
//function closeForm_update() {
//    document.getElementById("conductorUpdateForm").style.display = "none";
//    document.getElementById("overlay").style.display = "none";
//}
//
//function openAlertSuccess() {
//    document.getElementById("successAlert").style.display = "block";
//    document.getElementById("overlay").style.display = "block";
//}
//
//function closeAlertSuccess() {
//    document.getElementById("successAlert").style.display = "none";
//    document.getElementById("overlay").style.display = "none";
//    window.location.href = "../html/owner_dashboard_conductor.html";
//}
//
//function openAlertFail() {
//    document.getElementById("failAlert").style.display = "block";
//    document.getElementById("overlay").style.display = "block";
//}
//
//function closeAlertFail() {
//    document.getElementById("failAlert").style.display = "none";
//    document.getElementById("overlay").style.display = "none";
//    window.location.href = "../html/owner_dashboard_conductor.html";
//}
//
//// Create the add and update forms
//function createForm() {
//    const form_add = document.createElement('div');
//    form_add.classList.add('conductor_add_form_body');
//
//    const form_update = document.createElement('div');
//    form_update.classList.add('conductor_update_form_body');
//
//    var form= `
//        <div class="bus_form_left">
//            <div class="form_div">
//                <label for="conductor_id" class="conductor_form_title">Conductor Id <span class="conductor_form_require">*</span></label>
//                <input type="text" name="conductor_id" id="conductor_id" class="form_data" placeholder="Enter the Conductor ID" required="required" />
//            </div>
//        </div>
//        <div class="bus_form_right">
//            <div class="form_div">
//                <label for="nic" class="conductor_form_title">NIC Number <span class="conductor_form_require">*</span></label>
//                <input type="number" name="nic" id="nic" class="form_data" placeholder="Enter NIC Number" required="required" />
//            </div>
//        </div>
//        `;
//
//    form_add.innerHTML = form.replace(/id="/g, 'id="add_');
//    form_update.innerHTML = form.replace(/id="/g, 'id="update_');
//    const formContainer_add = document.getElementById('formContainer_add');
//    const formContainer_update = document.getElementById('formContainer_update');
//
//    formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form
//    formContainer_update.appendChild(form_update.cloneNode(true)); // Clone the form
//}
//
//// Attach the searchData function to the keyup event of the search input field
//const searchInput = document.getElementById("searchInput");
//searchInput.addEventListener("keyup", searchData);
//
//// Handle search
//function searchData() {
//    const tableBody = document.querySelector("#dataTable tbody");
//    tableBody.innerHTML = "";
//
//    const searchTerm = document.getElementById("searchInput").value;
//
//    if (searchTerm.trim() === "") {
//        fetchAllData();
//        return;
//    }
//
//    fetch('../../../conductorController', {
//        method: 'GET',
//        headers: {
//            'Content-Type': 'application/json',
//            'conductor_id': searchTerm
//        },
//    })
//        .then(response => {
//            if (response.ok) {
//                return response.json();
//            } else {
//                console.error('Error:', response.status);
//            }
//        })
//        .then(data => {
//            displayDataAsTable(data);
//        })
//        .catch(error => {
//            console.error('Error:', error);
//        });
//}
//
//
//
//
//
