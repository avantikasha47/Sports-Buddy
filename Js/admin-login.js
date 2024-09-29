// scripts/admin-login.js
document.getElementById('adminLoginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const adminEmail = document.getElementById('adminEmail').value;
    const adminPassword = document.getElementById('adminPassword').value;
    
    // Simple validation (you can replace it with Firebase Authentication or your custom logic)
    if (adminEmail === "admin@example.com" && adminPassword === "admin123") {
        alert("Admin login successful");
        window.location.href = "admin-action.html"; // Redirect to admin dashboard
    } else {
        document.getElementById('adminLoginError').textContent = "Invalid email or password";
    }
});
