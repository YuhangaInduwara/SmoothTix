let busData = [];
let busRegNo = 'BR001';
let allData = [];

document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => getBusRegNos() );
});

const searchSelect = document.getElementById("busregNoSelect");
searchSelect.addEventListener("change", (event) => {
    busRegNo = event.target.value;
    console.log(busRegNo)
});

function getBusRegNos(){
    document.getElementById("userName").textContent = session_user_name;

    fetch(`${url}/busController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id
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
            if (data) {
                busData = data;

                let busregNoSelect = document.getElementById("busregNoSelect");

                for (let i = 0; i < busData.length; i++) {
                    let option_bus = document.createElement("option");
                    option_bus.text = busData[i].reg_no;
                    option_bus.value = busData[i].reg_no;
                    busregNoSelect.add(option_bus);
                }
            } else {
                console.error('Error: Invalid or missing data.bus property');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function generateReport() {
    const startDate = document.getElementById('StartdatePicker').value + " 00:00:00";
    const endDate = document.getElementById('EnddatePicker').value + " 23:59:59";
    console.log("startDate: " + startDate + " endDate: " + endDate + " reg_no: " + busregNoSelect);

    const jsonData = JSON.stringify({
            startDate: startDate,
            endDate: endDate,
            busRegNo: busRegNo
        });
       console.log(jsonData)

    fetch(`${ url }/reportController`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch report data');
        }
    })
    .then(data => {
      if (data) {
      allData = data;
      console.log(data);
        document.getElementById("timePeriod").textContent = `${startDate.split("T")[0]} - ${endDate.split("T")[0]}`;
        document.getElementById("busRegNo").textContent = busRegNo;
        document.getElementById("totalSeatsBooked").textContent = data.totalSeatsBooked;
        document.getElementById("totalPaymentsDeleted").textContent = data.totalPaymentsDeleted;
        document.getElementById("finalAmount").textContent = data.finalAmount;
        document.getElementById("downloadReportButton").disabled = false;
      } else {
        console.error('Error: Invalid or missing data in response');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

}
