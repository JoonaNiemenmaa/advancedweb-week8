function setupRegisterForm() {
	const registerForm = document.getElementById("registerForm");

	const username = document.getElementById("username");
	const email = document.getElementById("email");
	const password = document.getElementById("password");
	const isAdmin = document.getElementById("isAdmin");

	const response = document.getElementById("response");

	registerForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		const body = {
			username: username.value,
			email: email.value,
			password: password.value,
			isAdmin: isAdmin.checked,
		};

		console.log(body);

		const url = "http://localhost:3000/api/user/register";
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		};

		const response = await fetch(url, options);

		console.log(await response.json());

		if (response.status === 200) {
			window.location.replace("./index.html");
		}
	});
}

setupRegisterForm();
