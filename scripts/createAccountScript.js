let createAccountBtn = document.getElementById("createAccountBtn");
let username = document.getElementById("newUsername");
let password = document.getElementById("newPassword");
let confirmPassword = document.getElementById("confirmPassword");
createAccountBtn.addEventListener('click', createAccount);

function createAccount() {
	if ((newUsername.value != "") && (newPassword.value != "") && (newPassword.value === confirmPassword.value)){
		alert("Account Created!");
	}
	else if (newPassword.value != confirmPassword.value) {
		alert("Passwords do not match!");
	}
	else {
		alert("Account creation failed! Please enter a username and password.");
	}
}