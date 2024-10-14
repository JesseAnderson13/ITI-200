let loginSubmitBtn = document.getElementById("loginSubmitBtn");
let username = document.getElementById("username");
let password = document.getElementById("password");
loginSubmitBtn.addEventListener('click', loginSubmit);

function loginSubmit() {
	if ((username.value != "") && (password.value != "")){
		alert("Login Successful!");
	}
	else {
		alert("Login failed! Please enter a username and password.");
	}
}