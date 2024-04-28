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
    const startDateInput = document.getElementById('StartdatePicker');
    const endDateInput = document.getElementById('EnddatePicker');
    const busRegNoSelect = document.getElementById('busregNoSelect');

    const startDate = startDateInput.value + " 00:00:00";
    const endDate = endDateInput.value + " 23:59:59";
    const busRegNo = busRegNoSelect.value;
    console.log("startDate: " + startDate + " endDate: " + endDate + " reg_no: " + busregNoSelect);

    const startDateFormatted = startDateInput.value;
    const endDateFormatted = endDateInput.value;

    document.getElementById('startDateError').textContent = "";
    document.getElementById('endDateError').textContent = "";
    document.getElementById('busRegNoError').textContent = "";

    startDateInput.style.border = '';
    startDateInput.title = '';
    endDateInput.style.border = '';
    endDateInput.title = '';
    busRegNoSelect.style.border = '';
    busRegNoSelect.title = '';

    let isStartDateEmpty = startDate.trim() === '';
    let isEndDateEmpty = endDate.trim() === '';
    let isBusRegNoEmpty = busRegNo.trim() === '';

    if (isStartDateEmpty) {
        setErrorMsg(startDateInput, "Please enter a start date.");
        document.getElementById('startDateError').textContent = "Please enter a start date.";
    } else if (isEndDateEmpty) {
        setErrorMsg(endDateInput, "Please enter an end date.");
        document.getElementById('endDateError').textContent = "Please enter an end date.";
    } else if (isBusRegNoEmpty) {
        setErrorMsg(busRegNoSelect, "Please select a bus registration number.");
        document.getElementById('busRegNoError').textContent = "Please select a bus registration number.";
    } else {
        // Check if start date is valid
        const isStartDateValid = validateDate(startDate);
        if (!isStartDateValid) {
            setErrorMsg(document.getElementById('StartdatePicker'), "Please enter a valid start date.");
            document.getElementById('startDateError').textContent = "Please enter a valid start date.";
            return;
        }

        // Check if end date is valid
        const isEndDateValid = validateDate(endDate);
        if (!isEndDateValid) {
            setErrorMsg(document.getElementById('EnddatePicker'), "Please enter a valid end date.");
            document.getElementById('endDateError').textContent = "Please enter a valid end date.";
            return;
        }

        // Check if start date is before end date
        if (new Date(startDate) > new Date(endDate)) {
            setErrorMsg(document.getElementById('StartdatePicker'), "Start date must be before end date.");
            setErrorMsg(document.getElementById('EnddatePicker'), "End date must be after start date.");
            document.getElementById('startDateError').textContent = "Start date must be before end date.";
            document.getElementById('endDateError').textContent = "End date must be after start date.";
            return;
        }

        // Check if bus registration number is selected
        const isBusRegNoValid = busRegNo !== "";
        if (!isBusRegNoValid) {
            setErrorMsg(document.getElementById('busregNoSelect'), "Please select a bus registration number.");
            document.getElementById('busRegNoError').textContent = "Please select a bus registration number.";
            return;
        }

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
          clearSearchBoxes();
          console.log(data);
            document.getElementById("timePeriod").textContent = `${startDateFormatted} - ${endDateFormatted}`;
            document.getElementById("busRegNo").textContent = busRegNo;
            document.getElementById("totalSeatsBooked").textContent = data.totalSeatsBooked;
            document.getElementById("totalPaymentsDeleted").textContent = data.totalPaymentsDeleted;
            document.getElementById("finalAmount").textContent = data.finalAmount;
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
  document.getElementById("busregNoSelect").selectedIndex = 0;
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
        const text = "Revenue Report";
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
                doc.save('report.pdf');
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
