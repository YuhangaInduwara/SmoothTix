document.addEventListener('DOMContentLoaded', function () {
  isAuthenticated().then(() => fetchAllData());
});

function fetchAllData() {
  document.getElementById("userName").textContent = session_user_name;
}