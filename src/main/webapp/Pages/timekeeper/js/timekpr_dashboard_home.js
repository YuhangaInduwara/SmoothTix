// session management (authentication and authorization)
document.addEventListener('DOMContentLoaded', function () {
    isAuthenticated().then(() => init());
});

// set username in dashboard
function init() {
    document.getElementById("userName").textContent = session_user_name;
}