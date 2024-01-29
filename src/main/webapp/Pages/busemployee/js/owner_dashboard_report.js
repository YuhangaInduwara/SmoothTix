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

            // Generate a simple report content
            const reportContent = `
                <p><strong>Time Period:</strong> ${timePeriod}</p>
                <p><strong>Report Type:</strong> ${reportType}</p>
                <p><strong>Bus ID:</strong> ${busId}</p>
                <table class="table" ">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Number of Trips</th>
                            <th> ${reportType} </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>02/05/2024</td>
                            <td>4</td>
                            <td>200</td>
                        </tr>
                        <tr>
                            <td>02/05/2024</td>
                            <td>5</td>
                            <td>200</td>
                        </tr>
                        <tr>
                            <td>02/05/2024</td>
                            <td>5</td>
                            <td>200</td>
                        </tr>
                        <tr>
                            <td>02/05/2024</td>
                            <td>5</td>
                            <td>200</td>
                        </tr>
                        <tr>
                            <td>02/05/2024</td>
                            <td>5</td>
                            <td>200</td>
                        </tr>
                        <tr>
                            <td>02/05/2024</td>
                            <td>4</td>
                            <td>200</td>
                        </tr>
                        <tr>
                            <td>02/05/2024</td>
                            <td>3</td>
                            <td>200</td>
                        </tr>



                    </tbody>
                </table>


            `;

            const reportPadding = ` All ${reportType} within ${timePeriod} `;



            // Display the report title and content
            document.getElementById('reportTitle').innerText = reportTitle;
            document.getElementById('reportContent').innerHTML = reportContent;
            document.getElementById('reportPadding').innerText = reportPadding;
            document.getElementById('reportContainer').style.display = 'block';
        }




        // Add this line to expose searchData globally
        window.searchData = searchData;
    });

//document.addEventListener('DOMContentLoaded', function() {
//    function fetchData() {
//        fetch('BusdataController') // Assuming servlet mapping is correct
//            .then(response => {
//                if (!response.ok) {
//                    throw new Error(`HTTP error! Status: ${response.status}`);
//                }
//                return response.json();
//            })
//            .then(data => {
//                const dropdown = document.getElementById('dropdown_busId');
//
//                // Clear existing options
//                dropdown.innerHTML = '<option value="" disabled selected>Bus Id</option>';
//
//                // Populate dropdown with fetched data
//                data.forEach(bus_profile => {
//                    const option = document.createElement('option');
//                    option.value = bus_profile.bus_id;
//                    option.textContent = bus_profile.bus_id;
//                    dropdown.appendChild(option);
//                });
//            })
//            .catch(error => {
//                console.error('Error fetching data:', error);
//            });
//    }
//
//    // Call fetchData when the page loads
//    fetchData();
//
//    // Function to handle search data
//    function searchData() {
//        // Fetch form data
//        const timePeriod = document.getElementById('dropdown_start').value;
//        const reportType = document.getElementById('dropdown_destination').value;
//        const busId = document.getElementById('dropdown_busId').value;
//
//        // Basic validation
//        if (!timePeriod || !reportType || !busId) {
//            alert("Please fill in all fields.");
//            return;
//        }
//
//        // Generate a title for the report
//        const reportTitle = `${reportType} Report`;
//
//        // Generate a simple report content with a placeholder image
//        const reportContent = `
//            <p><strong>Time Period:</strong> ${timePeriod}</p>
//            <p><strong>Report Type:</strong> ${reportType}</p>
//            <p><strong>Bus ID:</strong> ${busId}</p>
//        `;
//
//        // Display the report title and content
//        document.getElementById('reportTitle').innerText = reportTitle;
//        document.getElementById('reportContent').innerHTML = reportContent;
//        document.getElementById('reportContainer').style.display = 'block';
//    }
//
//    // Add this line to expose searchData globally
//    window.searchData = searchData;
//});
