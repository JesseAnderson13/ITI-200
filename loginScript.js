
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                window.location.href = "index.html"; // Redirect to home page
            } else {
                const error = await response.json();
                alert(error.message || "Login failed. Please try again.");
            }
        } catch (err) {
            console.error("Error during login:", err);
            alert("An error occurred. Please try again later.");
        }
    } else {
        alert("Please enter both username and password.");
    }
});