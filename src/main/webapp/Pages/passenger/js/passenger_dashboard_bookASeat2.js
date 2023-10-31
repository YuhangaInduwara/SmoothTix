function addBooking(){
    // document.getElementById("proceed").addEventListener("submit", function(event) {
    //     event.preventDefault();

        const booking_id = "B004"
        const schedule_id = "SH004"
        const route_id = "R002"
        const date = "2023/11/01"
        const time = "09.45"
        const seat_no = 33
        const price = "Rs.400"


        const userData = {
            booking_id: booking_id,
            schedule_id: schedule_id,
            route_id: route_id,
            date: date,
            time: time,
            seat_no: seat_no,
            price: price,
        };
        console.log(userData)
        const jsonData = JSON.stringify(userData);

        fetch('../../../bookingController', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
            .then(response => {
                if (response.ok) {
                    openAlertSuccess();
                } else if (response.status === 401) {
                    openAlertFail(response.status);
                    console.log('Booking unsuccessful');
                } else {
                    openAlertFail(response.status);
                    console.error('Error:', response.status);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    // });
}

function openAlertSuccess() {
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    window.location.href = "../html/passenger_dashboard_myBookings.html";
}

function openAlertFail(response) {
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}