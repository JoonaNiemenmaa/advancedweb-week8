function setupLogin() {
	const loginForm = document.getElementById("loginForm");

	const email = document.getElementById("email");
	const password = document.getElementById("password");

	loginForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		const body = {
			email: email.value,
			password: password.value,
		};

		const url = "http://localhost:3000/api/user/login";

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		};

		const response = await fetch(url, options);

		const json = await response.json();

		if (response.status === 200) {
			localStorage.setItem("token", json.token);
		}
	});
}

setupLogin();
