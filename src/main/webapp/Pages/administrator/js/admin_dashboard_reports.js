let routeData = [];
let routeNo = 'R001';
let allData = [];

// session management (authentication and authorization)
document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => getRouteNos() );
});

// event listener for route number selection dropdown menu
const searchSelect = document.getElementById("routeNoSelect");
searchSelect.addEventListener("change", (event) => {
    routeNo = event.target.value;
    console.log(routeNo)
});

// get route numbers from the database for showing in the dropdown
function getRouteNos(){

    document.getElementById("userName").textContent = session_user_name; // set username in dashboard

    fetch(`${url}/routeController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
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
                routeData = data;

                let routeNoSelect = document.getElementById("routeNoSelect");

                for (let i = 0; i < routeData.length; i++) {
                    let option_route = document.createElement("option");
                    option_route.text = routeData[i].route_no;
                    option_route.value = routeData[i].route_no;
                    routeNoSelect.add(option_route);
                }
            } else {
                console.error('Error: Invalid or missing data.bus property');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// get filter data, send them to the backend to fetch the corresponding report details and display them
function generateReport() {
    const startDateInput = document.getElementById('StartdatePicker');
    const endDateInput = document.getElementById('EnddatePicker');
    const routeNoSelect = document.getElementById('routeNoSelect');
    const startDate = startDateInput.value + " 00:00:00";
    const endDate = endDateInput.value + " 23:59:59";
    const routeNo = routeNoSelect.value;
    const startDateFormatted = startDateInput.value;
    const endDateFormatted = endDateInput.value;

    document.getElementById('startDateError').textContent = "";
    document.getElementById('endDateError').textContent = "";
    document.getElementById('routeNoError').textContent = "";

    startDateInput.style.border = '';
    startDateInput.title = '';
    endDateInput.style.border = '';
    endDateInput.title = '';
    routeNoSelect.style.border = '';
    routeNoSelect.title = '';

    let isStartDateEmpty = startDate.trim() === '';
    let isEndDateEmpty = endDate.trim() === '';
    let isRouteNoEmpty = routeNo.trim() === '';

    if (isStartDateEmpty) {
        setErrorMsg(startDateInput, "Please enter a start date.");
        document.getElementById('startDateError').textContent = "Please enter a start date.";
    } else if (isEndDateEmpty) {
        setErrorMsg(endDateInput, "Please enter an end date.");
        document.getElementById('endDateError').textContent = "Please enter an end date.";
    } else if (isRouteNoEmpty) {
        setErrorMsg(routeNoSelect, "Please select a Route number.");
        document.getElementById('routeNoError').textContent = "Please select a bus registration number.";
    } else {
        const isStartDateValid = validateDate(startDate);
        if (!isStartDateValid) {
            setErrorMsg(document.getElementById('StartdatePicker'), "Please enter a valid start date.");
            document.getElementById('startDateError').textContent = "Please enter a valid start date.";
            return;
        }

        const isEndDateValid = validateDate(endDate);
        if (!isEndDateValid) {
            setErrorMsg(document.getElementById('EnddatePicker'), "Please enter a valid end date.");
            document.getElementById('endDateError').textContent = "Please enter a valid end date.";
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setErrorMsg(document.getElementById('StartdatePicker'), "Start date must be before end date.");
            setErrorMsg(document.getElementById('EnddatePicker'), "End date must be after start date.");
            document.getElementById('startDateError').textContent = "Start date must be before end date.";
            document.getElementById('endDateError').textContent = "End date must be after start date.";
            return;
        }

        const isRouteNoValid = routeNo !== "";
        if (!isRouteNoValid) {
            setErrorMsg(document.getElementById('routeNoSelect'), "Please select a Route number.");
            document.getElementById('routeNoError').textContent = "Please select a Route number.";
            return;
        }

        const jsonData = JSON.stringify({
                startDate: startDate,
                endDate: endDate,
                routeNo: routeNo
            });

        fetch(`${ url }/adminController`, {
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
          clearSearchBoxes();

            document.getElementById("timePeriod").textContent = `${startDateFormatted} - ${endDateFormatted}`;
            document.getElementById("routeNo").textContent = routeNo;
            document.getElementById("totalSeatsBooked").textContent = data.totalSeatsBooked;
            document.getElementById("totalBusesScheduled").textContent = data.totalBusesScheduled;
            document.getElementById("commission").textContent = data.commission;
            document.getElementById("TotalAmount").textContent = data.TotalAmount;
            document.getElementById("downloadReportButton").disabled = false;
            openAlertSuccess("Report generated successfully!");
          } else {
            console.error('Error: Invalid or missing data in response');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
}

// validate the date
function validateDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    return regex.test(dateString);
}

// create an error message for showing on invalid insertion
function setErrorMsg(element, message) {
    element.style.border = "1px solid red";
    element.title = message;
}

// clear filter insertions after submitting them
function clearSearchBoxes() {
  document.getElementById("StartdatePicker").value = "";
  document.getElementById("EnddatePicker").value = "";
  document.getElementById("routeNoSelect").selectedIndex = 0;
}

// view success message
function openAlertSuccess(msg) {
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// close success messages
function closeAlertSuccess() {
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// close failed messages
function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// event listener for download report button
document.addEventListener('DOMContentLoaded', function () {
    const downloadBtn = document.getElementById('downloadReportButton');
    downloadBtn.addEventListener('click', downloadPDF);
});

// download the generated report as a pdf
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const imageUrl = '../../../images/logo.png';

    const img = new Image();
    img.src = imageUrl;
    img.onload = function() {
        const pageWidth = doc.internal.pageSize.getWidth();

        const imgHeight = 15;
        const imgWidth = imgHeight * (img.naturalWidth / img.naturalHeight); // Maintain aspect ratio
        const imgX = 10;
        const imgY = 10;

        doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);

        const fontSize = 18;
        doc.setFontSize(fontSize);
        const text = "Route Details Report";
        const textX = imgX + imgWidth + 40;
        const textY = imgY + (imgHeight / 2) + (fontSize / 2.8);
        doc.text(text, textX, textY);

        const lineStartX = imgX;
        const lineEndX = pageWidth - 10;
        const lineY = textY + 2;
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.line(lineStartX, lineY, lineEndX, lineY);

        addHtmlContent();
    };

    function addHtmlContent() {
        const content = document.getElementById('tableContainer');
        const options = {
            callback: function (doc) {
                doc.save('RouteReport.pdf');
            },
            x: 10,
            y: 40,
            width: 190,
            windowWidth: content.scrollWidth
        };

        doc.html(content, options);
    }
}