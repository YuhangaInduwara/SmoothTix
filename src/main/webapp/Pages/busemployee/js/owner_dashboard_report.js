document.addEventListener('DOMContentLoaded', function() {
    const generateReportButton = document.getElementById('generateReportButton');
    const reportContainer = document.getElementById('reportContainer');

    // Populate the bus profile select dropdown
    populateBusProfileSelect();

    generateReportButton.addEventListener('click', function() {
        const fromDate = document.getElementById('fromDate').value;
        const fromTime = document.getElementById('fromTime').value;
        const toDate = document.getElementById('toDate').value;
        const toTime = document.getElementById('toTime').value;
        const busProfileId = document.getElementById('busprofileSelect').value;

        if (fromDate && fromTime && toDate && toTime && busProfileId) {
            const fromDateTime = new Date(`${fromDate}T${fromTime}`).toISOString();
            const toDateTime = new Date(`${toDate}T${toTime}`).toISOString();

            generateReport(busProfileId, fromDateTime, toDateTime)
                .then(reportData => {
                    displayReport(reportData);
                })
                .catch(error => {
                    console.error('Error generating report:', error);
                });
        } else {
            alert('Please fill in all fields.');
        }
    });
});

function populateBusProfileSelect() {
    const busprofileSelect = document.getElementById('busprofileSelect');
    // Fetch bus profile IDs from the server and populate the select dropdown
}

function generateReport(busProfileId, fromDateTime, toDateTime) {
    // Send an AJAX request to the server to generate the report
    // Return a Promise that resolves with the report data
}

function displayReport(reportData) {
    const reportContainer = document.getElementById('reportContainer');
    // Render the report data in the reportContainer div
}