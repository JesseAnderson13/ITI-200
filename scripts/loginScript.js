let username = document.getElementById("username");
let password = document.getElementById("password");

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    if ((username.value != "") && (password.value != "")){
		alert("Login Successful!");
		window.location.href = "index.html";
	}
	else {
		alert("Login failed! Please enter a username and password.");
	}
});