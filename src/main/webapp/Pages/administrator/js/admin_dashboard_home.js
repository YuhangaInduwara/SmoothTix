document.getElementById("logoutButton").addEventListener("click", function() {
    // Send a request to the Logout Servlet to invalidate the session
    fetch("../../../logoutController")
        .then(response => {
            if (response.status === 200) {
                window.location.href = "../../login/html/login.html";
            } else {
                console.error("Logout failed.");
            }
        });
});

// function checkSessionStatus() {
//     fetch("../../../checkSessionController")
//         .then(response => {
//             if (response.status === 200) {
//                 return response.json();
//             } else {
//                 window.location.href = "http://localhost:2000/SmoothTix_war_exploded/Pages/login/html/login.html"
//             }
//         })
//         .then(data => {
//             document.getElementById("userName").textContent = data.user_name;
//         });
// }

window.onload = function() {
    checkSessionStatus(); // Call the function when the page loads
    setInterval(checkSessionStatus, 60000); // Set up periodic checks
};