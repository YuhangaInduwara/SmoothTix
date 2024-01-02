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

