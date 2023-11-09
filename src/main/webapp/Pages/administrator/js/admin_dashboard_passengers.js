function openFlagged() {
    document.getElementById("flagTable").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeFlagged() {
    document.getElementById("flagTable").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function fetchAllData() {
    fetch('../../../passengerController', {
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

function displayDataAsTable(data) {
    const tableBody1 = document.querySelector("#dataTable tbody");
    const tableBody2 = document.querySelector("#flagTable tbody");
    const rowCount = data.length;
    if(rowCount >=10){
        renderPageControl()
    }
    data.forEach(item => {
        // Check if the flag is true before rendering the row
        if (!item.flag) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.p_id}</td>
                <td>${item.first_name} ${item.last_name}</td>
                <td>${item.nic}</td>
                <td>${item.email}</td>
                <td>${mapPrivilegeLevel(item.privilege_level)}</td>
                <td>
                    <span class="icon-container">
                        <i onclick="flagPassenger('${item.p_id}','${item.flag}')"><img src="../../../images/vector_icons/flag_icon.png" alt="flag" class="action_icon"></i>
                    </span>
                </td>
            `;

            tableBody1.appendChild(row);
        }
        else if (item.flag) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.p_id}</td>
                <td>${item.first_name} ${item.last_name}</td>
                <td>${item.nic}</td>
                <td>${item.email}</td>
                <td>${mapPrivilegeLevel(item.privilege_level)}</td>
                <td>
                    <span class="icon-container">
                        <i onclick="flagPassenger('${item.p_id}','${item.flag}')"><img src="../../../images/vector_icons/unflag_icon.png" alt="unflag" class="action_icon"></i>
                    </span>
                </td>
            `;

            tableBody2.appendChild(row);
        }
    });
}

function renderPageControl(){
    document.getElementById("page_control").style.display = "flex";
}

function mapPrivilegeLevel(privilege_level) {
    switch (privilege_level) {
        case 1:
            return "Administrator";
        case 2:
            return "Timekeeper";
        case 3:
            return "Owner";
        case 4:
            return "Driver";
        case 5:
            return "Conductor";
        case 6:
            return "Passenger";
        default:
            return "Unknown";
    }
}

function flagPassenger(p_id, flag){
    const updatedFlag = {
        flag: flag,
    };

    const jsonData = JSON.stringify(updatedFlag);

    fetch(`../../../passengerController`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'p_id': p_id
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
            } else if (response.status === 401) {
                openAlertFail(response.status);
                console.log('Update unsuccessful');
            } else {
                openAlertFail(response.status);
                console.error('Error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function openFlagConfirm(p_id){

}

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

    fetch('../../../passengerController', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': searchTerm
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
