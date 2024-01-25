
document.addEventListener('DOMContentLoaded', function() {
        function searchData() {
            // Fetch form data
            const timePeriod = document.getElementById('dropdown_start').value;
            const reportType = document.getElementById('dropdown_destination').value;
            const busId = document.getElementById('dropdown_busId').value;


            // Basic validation
            if (!timePeriod || !reportType || !busId ) {
                alert("Please fill in all fields.");
                return;
            }

            // Generate a title for the report
            const reportTitle = `  ${reportType} Report `;

            // Generate a simple report content with a placeholder image
            const reportContent = `
                <p><strong>Time Period:</strong> ${timePeriod}</p>
                <p><strong>Report Type:</strong> ${reportType}</p>
                <p><strong>Bus ID:</strong> ${busId}</p>



            `;

            // Display the report title and content
            document.getElementById('reportTitle').innerText = reportTitle;
            document.getElementById('reportContent').innerHTML = reportContent;
            document.getElementById('reportContainer').style.display = 'block';
        }

        // Add this line to expose searchData globally
        window.searchData = searchData;
    });
