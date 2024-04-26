let routeData = [];
let routeNo = 'R001';
let allData = [];

document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => getRouteNos() );
});

const searchSelect = document.getElementById("routeNoSelect");
searchSelect.addEventListener("change", (event) => {
    routeNo = event.target.value;
    console.log(routeNo)
});

function getRouteNos(){
    document.getElementById("userName").textContent = session_user_name;

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

function generateReport() {
    const startDateInput = document.getElementById('StartdatePicker');
    const endDateInput = document.getElementById('EnddatePicker');
    const routeNoSelect = document.getElementById('routeNoSelect');

    const startDate = startDateInput.value + " 00:00:00";
    const endDate = endDateInput.value + " 23:59:59";
    const routeNo = routeNoSelect.value;
    console.log("startDate: " + startDate + " endDate: " + endDate + " route_no: " + routeNoSelect);

    const startDateFormatted = startDateInput.value;
    const endDateFormatted = endDateInput.value;

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
    } else if (isEndDateEmpty) {
        setErrorMsg(endDateInput, "Please enter an end date.");
    } else if (isRouteNoEmpty) {
        setErrorMsg(routeNoSelect, "Please select a Route number.");
    } else {
        // Check if start date is valid
        const isStartDateValid = validateDate(startDate);
        if (!isStartDateValid) {
            setErrorMsg(document.getElementById('StartdatePicker'), "Please enter a valid start date.");
            return;
        }

        // Check if end date is valid
        const isEndDateValid = validateDate(endDate);
        if (!isEndDateValid) {
            setErrorMsg(document.getElementById('EnddatePicker'), "Please enter a valid end date.");
            return;
        }

        // Check if start date is before end date
        if (new Date(startDate) > new Date(endDate)) {
            setErrorMsg(document.getElementById('StartdatePicker'), "Start date must be before end date.");
            setErrorMsg(document.getElementById('EnddatePicker'), "End date must be after start date.");
            return;
        }

        // Check if bus registration number is selected
        const isRouteNoValid = routeNo !== "";
        if (!isRouteNoValid) {
            setErrorMsg(document.getElementById('routeNoSelect'), "Please select a Route number.");
            return;
        }

        const jsonData = JSON.stringify({
                startDate: startDate,
                endDate: endDate,
                routeNo: routeNo
            });
           console.log(jsonData)

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
          console.log(data);
          clearSearchBoxes();

            document.getElementById("timePeriod").textContent = `${startDateFormatted} - ${endDateFormatted}`;
            document.getElementById("routeNo").textContent = routeNo;
            document.getElementById("totalSeatsBooked").textContent = data.totalSeatsBooked;
            document.getElementById("totalBusesScheduled").textContent = data.totalBusesScheduled;
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

function validateDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    return regex.test(dateString);
}

// Helper function to set error message
function setErrorMsg(element, message) {
    element.style.border = "1px solid red";
    element.title = message;
}

function clearSearchBoxes() {
  document.getElementById("StartdatePicker").value = "";
  document.getElementById("EnddatePicker").value = "";
  document.getElementById("routeNoSelect").selectedIndex = 0;
}

function openAlertSuccess(msg) {
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertSuccess() {
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openAlertFail(response) {
    document.getElementById("failMsg").textContent = response;
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

document.addEventListener('DOMContentLoaded', function () {
    const downloadBtn = document.getElementById('downloadReportButton');
    downloadBtn.addEventListener('click', downloadPDF);
});

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const imageUrl = '../../../images/logo.png'; // Change to your logo's URL

    // Load image from URL and draw it along with the header text
    const img = new Image();
    img.src = imageUrl;
    img.onload = function() {
        const pageWidth = doc.internal.pageSize.getWidth();

        // Image dimensions and positioning
        const imgHeight = 15; // Adjust height in mm
        const imgWidth = imgHeight * (img.naturalWidth / img.naturalHeight); // Maintain aspect ratio
        const imgX = 10;  // x position from left
        const imgY = 10;  // y position from top

        // Draw the image on the PDF
        doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);

        // Font settings and text positioning
        const fontSize = 18;
        doc.setFontSize(fontSize);
        const text = "Route Details Report";
        const textX = imgX + imgWidth + 40; // Adjusted gap
        const textY = imgY + (imgHeight / 2) + (fontSize / 2.8); // Vertically center text
        doc.text(text, textX, textY);

        // Draw a line under the text
        const lineStartX = imgX;
        const lineEndX = pageWidth - 10;  // Ends near the right margin
        const lineY = textY + 2; // A bit below the text
        doc.setDrawColor(0); // Set the line color to black (default)
        doc.setLineWidth(0.5);  // Line thickness
        doc.line(lineStartX, lineY, lineEndX, lineY);

        // Continue with the HTML content
        addHtmlContent();
    };

    function addHtmlContent() {
        const content = document.getElementById('tableContainer');
        const options = {
            callback: function (doc) {
                doc.save('RouteReport.pdf');
            },
            x: 10,
            y: 40, // Adjust starting position after header
            width: 190, // Adjust width according to your need
            windowWidth: content.scrollWidth
        };

        // Render HTML content to PDF
        doc.html(content, options);
    }
}