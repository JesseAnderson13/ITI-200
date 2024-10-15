let username = document.getElementById("newUsername");
let password = document.getElementById("newPassword");
let confirmPassword = document.getElementById("confirmPassword");

document.getElementById("createAccountForm").addEventListener("submit", function(event) {
    event.preventDefault();
    if ((newUsername.value != "") && (newPassword.value != "") && (newPassword.value === confirmPassword.value)){
		alert("Account Created!");
		window.location.href = "index.html";
	}
	else if (newPassword.value != confirmPassword.value) {
		alert("Passwords do not match!");
	}
	else {
		alert("Account creation failed! Please enter a username and password.");
	}
});