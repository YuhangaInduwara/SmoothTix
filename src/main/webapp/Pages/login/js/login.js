document.getElementById("registrationForm").addEventListener("submit", function (event) {
    // Prevent the default form submission
    event.preventDefault();

    // Assuming registration is successful (you can add validation logic here)
    // Show a success message (optional)
    alert("Registration successful!");

    // Redirect to the login page
    window.location.href = "login.html";
});