// Working with ambition posts
const addPost = document.querySelector(".addPost");
const submitInfo = document.querySelector(".submitInfo");

const posts = document.querySelector(".posts");
const loadingPosts = document.querySelector(".loadingPosts");

const renderCafe = (doc) => {
	const html = `
    <div class="card shadow-sm mt-2" data-id="${doc.id}" style="width: 100%">
      <div class="card-body">
        <h5 class="card-title">${doc.data().title}</h5>
        <p class="card-text">${doc.data().description}</p>
      </div>
    </div>
  `;

	loadingPosts.classList.add("d-none");
	posts.innerHTML = html + posts.innerHTML;
};

// Saving data
addPost.addEventListener("submit", (e) => {
	e.preventDefault();

	submitInfo.classList.remove("text-success");
	submitInfo.classList.remove("text-danger");
	submitInfo.classList.add("text-warning");
	submitInfo.innerHTML = `
    <div class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    Adding ambition '<i>${addPost.title.value}</i>'...
  `;

	db.collection("ambitions")
		.add({
			title: addPost.title.value,
			description: addPost.description.value,
			created: firebase.firestore.Timestamp.fromDate(new Date()),
		})
		.then(() => {
			submitInfo.classList.remove("text-warning");
			submitInfo.classList.add("text-success");
			submitInfo.innerHTML = "Successfully added ambition!";
		})
		.catch((err) => {
			console.log(err, err.toString());

			submitInfo.classList.remove("text-warning");
			submitInfo.classList.add("text-danger");
			submitInfo.innerHTML = "An error occured while posting the ambition. Please try again.";
		});

	addPost.title.value = "";
	addPost.description.value = "";
});

// Real-time listener
db.collection("ambitions")
	.orderBy("created")
	.limit(25)
	.onSnapshot((snapshot) => {
		let changes = snapshot.docChanges();
		changes.forEach((change) => {
			if (change.type === "added") {
				renderCafe(change.doc);
			}
		});
	});
