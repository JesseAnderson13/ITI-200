document.getElementById("createAccountForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        // Send a POST request to the server to register the user
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            window.location.href = "login.html"; // Redirect to login page after successful registration
        } else {
            alert(result.message || "Registration failed. Please try again.");
        }
    } catch (err) {
        console.error("Error during registration:", err);
        alert("An error occurred. Please try again later.");
    }
});
