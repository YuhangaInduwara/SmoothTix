// Declaration of global variables
let busData = []; // Array to store bus registration data
let busRegNo = 'BR001'; // Default bus registration number
let allData = []; // Array to store all fetched report data

// Event listener for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    // Checks authentication status and fetches bus registration numbers
    isAuthenticated().then(() => getBusRegNos());
});

// Event listener for bus registration number selection change
const searchSelect = document.getElementById("busregNoSelect");
searchSelect.addEventListener("change", (event) => {
    busRegNo = event.target.value;
});

// Function to fetch bus registration numbers
function getBusRegNos(){
    // Sets the user name in the HTML element
    document.getElementById("userName").textContent = session_user_name;

    // Fetches bus registration data from the server
    fetch(`${url}/busController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'p_id': session_p_id
        },
    })
    .then(response => {
        // Checks for successful response
        if (response.ok) {
            return response.json();
        } else {
            console.error('Error:', response.status);
        }
    })
    .then(data => {
        if (data) {
            // Populates the dropdown with fetched bus registration numbers
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

// Function to generate report
function generateReport() {
    // Retrieves input values
    const startDateInput = document.getElementById('StartdatePicker');
    const endDateInput = document.getElementById('EnddatePicker');
    const busRegNoSelect = document.getElementById('busregNoSelect');

    // Formats input values
    const startDate = startDateInput.value + " 00:00:00";
    const endDate = endDateInput.value + " 23:59:59";
    const busRegNo = busRegNoSelect.value;
    const startDateFormatted = startDateInput.value;
    const endDateFormatted = endDateInput.value;

    // Resets error messages and styles
    document.getElementById('startDateError').textContent = "";
    document.getElementById('endDateError').textContent = "";
    document.getElementById('busRegNoError').textContent = "";
    startDateInput.style.border = '';
    startDateInput.title = '';
    endDateInput.style.border = '';
    endDateInput.title = '';
    busRegNoSelect.style.border = '';
    busRegNoSelect.title = '';

    // Checks for empty inputs
    let isStartDateEmpty = startDate.trim() === '';
    let isEndDateEmpty = endDate.trim() === '';
    let isBusRegNoEmpty = busRegNo.trim() === '';

    // Handles empty input cases
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
        // Validates date formats
        const isStartDateValid = validateDate(startDate);
        const isEndDateValid = validateDate(endDate);

        // Handles invalid date cases
        if (!isStartDateValid) {
            setErrorMsg(document.getElementById('StartdatePicker'), "Please enter a valid start date.");
            document.getElementById('startDateError').textContent = "Please enter a valid start date.";
            return;
        }
        if (!isEndDateValid) {
            setErrorMsg(document.getElementById('EnddatePicker'), "Please enter a valid end date.");
            document.getElementById('endDateError').textContent = "Please enter a valid end date.";
            return;
        }

        // Checks if start date is before end date
        if (new Date(startDate) > new Date(endDate)) {
            setErrorMsg(document.getElementById('StartdatePicker'), "Start date must be before end date.");
            setErrorMsg(document.getElementById('EnddatePicker'), "End date must be after start date.");
            document.getElementById('startDateError').textContent = "Start date must be before end date.";
            document.getElementById('endDateError').textContent = "End date must be after start date.";
            return;
        }

        // Checks if bus registration number is valid
        const isBusRegNoValid = busRegNo !== "";
        if (!isBusRegNoValid) {
            setErrorMsg(document.getElementById('busregNoSelect'), "Please select a bus registration number.");
            document.getElementById('busRegNoError').textContent = "Please select a bus registration number.";
            return;
        }

        // Constructs JSON data for POST request
        const jsonData = JSON.stringify({
            startDate: startDate,
            endDate: endDate,
            busRegNo: busRegNo
        });

        // Sends POST request to generate report
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
                // Updates UI with report data
                allData = data;
                clearSearchBoxes();
                console.log(data); // Log report data for debugging
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

// Function to validate date format
function validateDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    return regex.test(dateString);
}

// Function to set error message and highlight input
function setErrorMsg(element, message) {
    element.style.border = "1px solid red";
    element.title = message;
}

// Function to clear search input values
function clearSearchBoxes() {
    document.getElementById("StartdatePicker").value = "";
    document.getElementById("EnddatePicker").value = "";
    document.getElementById("busregNoSelect").selectedIndex = 0;
}

// Function to open success alert
function openAlertSuccess(msg) {
    document.getElementById("alertMsgSuccess").textContent = msg;
    document.getElementById("successAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close success alert
function closeAlertSuccess() {
    document.getElementById("successAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Function to open fail alert
function openAlertFail(response) {
    document.getElementById("failMsg").textContent = response;
    document.getElementById("failAlert").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close fail alert
function closeAlertFail() {
    document.getElementById("failAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Event listener for download button click
document.addEventListener('DOMContentLoaded', function () {
    const downloadBtn = document.getElementById('downloadReportButton');
    downloadBtn.addEventListener('click', downloadPDF);
});

// Function to download PDF report
function downloadPDF() {
    // Retrieves jsPDF from window
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Defines image URL for logo
    const imageUrl = '../../../images/logo.png';

    const img = new Image();
    img.src = imageUrl;
    img.onload = function() {
        // Calculates dimensions and positions for logo
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgHeight = 15;
        const imgWidth = imgHeight * (img.naturalWidth / img.naturalHeight);
        const imgX = 10;
        const imgY = 10;

        // Adds logo to PDF
        doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);

        // Adds title to PDF
        const fontSize = 18;
        doc.setFontSize(fontSize);
        const text = "Revenue Report";
        const textX = imgX + imgWidth + 40;
        const textY = imgY + (imgHeight / 2) + (fontSize / 2.8);
        doc.text(text, textX, textY);

        // Draws line under title
        const lineStartX = imgX;
        const lineEndX = pageWidth - 10;
        const lineY = textY + 2;
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.line(lineStartX, lineY, lineEndX, lineY);

        // Adds HTML content to PDF
        addHtmlContent();
    };

    // Function to add HTML content to PDF
    function addHtmlContent() {
        const content = document.getElementById('tableContainer');
        const options = {
            callback: function (doc) {
                doc.save('report.pdf'); // Saves PDF with specified name
            },
            x: 10,
            y: 40,
            width: 190,
            windowWidth: content.scrollWidth
        };

        doc.html(content, options);
    }
}
