
document.addEventListener('DOMContentLoaded', function() {
        function searchData() {
            // Fetch form data
            const timePeriod = document.getElementById('dropdown_start').value;
            const reportType = document.getElementById('dropdown_destination').value;
            const busId = document.querySelector('.search_box:nth-child(3) input').value;
            const routeId = document.querySelector('.search_box:nth-child(4) input').value;

            // Basic validation
            if (!timePeriod || !reportType || !busId || !routeId) {
                alert("Please fill in all fields.");
                return;
            }

            // Generate a title for the report
            const reportTitle = `Selected ${timePeriod} ${reportType} Report of Bus ID ${busId}`;

            // Generate a simple report content with a placeholder image
            const reportContent = `
                <p><strong>Time Period:</strong> ${timePeriod}</p>
                <p><strong>Report Type:</strong> ${reportType}</p>
                <p><strong>Bus ID:</strong> ${busId}</p>
                <p><strong>Route ID:</strong> ${routeId}</p>

                <img src="../../../images/abc.png" alt="Report Image">
            `;

            // Display the report title and content
            document.getElementById('reportTitle').innerText = reportTitle;
            document.getElementById('reportContent').innerHTML = reportContent;
            document.getElementById('reportContainer').style.display = 'block';
        }

        // Add this line to expose searchData globally
        window.searchData = searchData;
    });
    /*function searchData() {
            // Fetch form data
            const timePeriod = document.getElementById('dropdown_start').value;
            const reportType = document.getElementById('dropdown_destination').value;
            const busId = document.querySelector('.search_box:nth-child(3) input').value;
            const routeId = document.querySelector('.search_box:nth-child(4) input').value;

            // Basic validation
            if (!timePeriod || !reportType || !busId || !routeId) {
                alert("Please fill in all fields.");
                return;
            }

            // Generate a simple report content based on the selected criteria
            const reportContent = `
                <p><strong>Time Period:</strong> ${timePeriod}</p>
                <p><strong>Report Type:</strong> ${reportType}</p>
                <p><strong>Bus ID:</strong> ${busId}</p>
                <p><strong>Route ID:</strong> ${routeId}</p>
                <p>This is a sample correspondent report. You can customize this with your actual data.</p>
            `;

            // Display the report
            document.getElementById('reportContent').innerHTML = reportContent;
            document.getElementById('reportContainer').style.display = 'block';
        }*/