async function get_topics() {
	const url = "http://localhost:3000/api/topics";

	const topics = await (await fetch(url)).json();

	return topics;
}

function display_topics(topics) {
	const topics_div = document.getElementById("topics");

	for (const topic of topics) {
		const div = document.createElement("div");

		const title = document.createElement("span");
		title.innerText = topic.title;

		const content = document.createElement("p");
		content.innerText = topic.content;

		const username = document.createElement("p");
		username.innerText = `${topic.username} ${topic.createdAt}`;

		const delete_button = document.createElement("button");
		delete_button.id = "deleteTopic";
		delete_button.innerText = "Delete";

		delete_button.addEventListener("click", async (event) => {
			const url = `http://localhost:3000/api/topic/${topic._id}`;

			const options = {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			};

			const response = await fetch(url, options);

			if (response.status !== 200) {
				window.alert("Access denied.");
			} else {
				div.remove();
			}
		});

		div.appendChild(title);
		div.appendChild(content);
		div.appendChild(username);
		div.appendChild(delete_button);

		topics_div.appendChild(div);
	}
}

function setUpTopic() {
	const post = document.getElementById("postTopic");

	const title = document.getElementById("topicTitle");
	const content = document.getElementById("topicText");

	get_topics().then((topics) => {
		display_topics(topics);
	});

	post.addEventListener("click", async (event) => {
		event.preventDefault();

		const body = {
			title: title.value,
			content: content.value,
		};

		const url = "http://localhost:3000/api/topic";

		const options = {
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		};

		const response = await fetch(url, options);

		const json = await response.json();

		console.log(json);
	});
}

setUpTopic();
