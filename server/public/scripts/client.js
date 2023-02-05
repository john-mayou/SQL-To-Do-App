$(document).ready(onReady);

function onReady() {
	getCategories();
	getTasks();
	$("#show-color-btns").on("click", handleToggleColorButton);
	$("#color-btn-list").on(
		"click",
		"#show-category-inputs-btn",
		handleShowNewCategoryInputs
	);
	$("#new-category-inputs__section").on(
		"click",
		"#add-new-category-btn",
		handleAddNewCategory
	);
	$("#color-btn-list").on(
		"click",
		"button:not(#show-category-inputs-btn)",
		handleShowNewTaskInput
	);
	$("#new-category-inputs__section").on(
		"click",
		"#add-new-task-btn",
		handleAddNewTask
	);
	$("#new-category-inputs__section").on(
		"click",
		"#delete-category-btn",
		handleDeleteCategory
	);

	// After this is task box event listeners
	$("#todo-content__box").on("click", ".card-edit-btn", handleEditTask);
}

// State
// Toggling input fields and buttons
let showColorButtons = false;
let idOfNewTaskCategory = null;
let currentInputState = "Empty";

// Task card states
let currentPage = "Active";
let idCurrentCardBeingEdited = null;

// Database states
let categories = [];
let tasks = [];

// Helper functions
function getMonthFromNumber(number) {
	switch (number) {
		case 0:
			return "Jan";
		case 1:
			return "Feb";
		case 2:
			return "Mar";
		case 3:
			return "Apr";
		case 4:
			return "May";
		case 5:
			return "Jun";
		case 6:
			return "Jul";
		case 7:
			return "Aug";
		case 8:
			return "Sep";
		case 9:
			return "Oct";
		case 10:
			return "Nov";
		case 11:
			return "Nov";
		default:
			console.log("something wrong with month conversion");
	}
}

function getDateAndTime() {
	let now = new Date();
	const month = getMonthFromNumber(now.getMonth());
	return `${month} ${now.getDate()}, ${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
}

function toTitleCase(str) {
	return str
		.split(" ")
		.map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
		.join(" ");
}

// Toggling through selector and input fields
function handleToggleColorButton() {
	showColorButtons ? (showColorButtons = false) : (showColorButtons = true);
	render();
}

function handleShowNewTaskInput() {
	idOfNewTaskCategory = $(this).data("id");
	currentInputState = "New Task";

	handleToggleColorButton();
	render();
}

function handleShowNewCategoryInputs() {
	currentInputState = "New Category";

	handleToggleColorButton();
	render();
}

// Request functions
function handleAddNewTask() {
	let newTask = {
		description: $("#description-input").val(),
		categoryId: idOfNewTaskCategory,
		isComplete: false,
		timeStampCreated: getDateAndTime(),
		timeStampCompleted: null,
	};

	$.ajax({
		url: "/task",
		method: "POST",
		data: newTask,
	})
		.then((response) => {
			console.log("Response POST /task", response);
			currentInputState = "Empty";
			getTasks();
		})
		.catch((error) => {
			console.log("Error on POST /task", error);
		});
}

function getTasks() {
	$.ajax({
		url: "/task",
		method: "GET",
	})
		.then((response) => {
			console.log("Response GET /task", response);
			tasks = response;
			render();
		})
		.catch((error) => {
			console.log("Error on GET /task", error);
		});
}

function handleAddNewCategory() {
	const newCategory = {
		category: toTitleCase($("#category-title-input").val()),
		color: $("#category-color-input").val(),
	};

	$.ajax({
		url: "/category",
		method: "POST",
		data: newCategory,
	})
		.then((response) => {
			console.log("Response POST /category", response);
			currentInputState = "Empty";
			getCategories();
		})
		.catch((error) => {
			console.log("Error on POST /category", error);
		});
}

function getCategories() {
	$.ajax({
		url: "/category",
		method: "GET",
	})
		.then((response) => {
			console.log("Response GET /category", response);
			categories = response;
			render();
		})
		.catch((error) => {
			console.log("Error on GET /category", error);
		});
}

function handleDeleteCategory() {
	const id = idOfNewTaskCategory;

	$.ajax({
		url: `/category/${id}`,
		method: "DELETE",
	})
		.then((response) => {
			console.log("Response DELETE /category/:id", response);
			currentInputState = "Empty";
			getCategories();
		})
		.catch((error) => {
			console.log("Error on GET /category/:id", error);
		});
}

function handleEditTask() {
	idCurrentCardBeingEdited = $(this).closest(".card-box").data("id");
}

// Render functions
function renderColorBtns() {
	if (showColorButtons) {
		$("#show-color-btns").html(`<i class="fa-solid fa-angle-up"></i>`);
		$("#color-btn-list").empty();
		for (let { id, category, color } of categories) {
			$("#color-btn-list").append(`
				<button
					data-id="${id}"
					data-category="${category}"
					style="background-color:${color}a1"
				></button>
			`);
		}
		$("#color-btn-list").append(
			`<button id="show-category-inputs-btn"><i class="fa-solid fa-plus"></i></button>`
		);
	} else {
		$("#show-color-btns").html(`<i class="fa-solid fa-plus"></i>`);
		$("#color-btn-list").empty();
	}
}

function renderNewTaskInput() {
	const HTML = `
			<textarea id="description-input" placeholder="Task Description"></textarea>
			<button id="add-new-task-btn" class="btn btn-success">Add Task</button>
			<button id="delete-category-btn" class="btn btn-danger">Delete Category</button>
	`;

	$("#new-category-inputs__section").empty();
	$("#new-category-inputs__section").append(HTML);
}

function renderNewCategoryInputs() {
	const HTML = `
			<input id="category-title-input" type="text" placeholder="Category Title">
			<input id="category-color-input" type="color">
			<button id="add-new-category-btn" class="btn btn-outline-dark">Add</button>
	`;

	$("#new-category-inputs__section").empty();
	$("#new-category-inputs__section").append(HTML);
}

function renderActiveTaskCards() {
	$("#todo-content__box").empty();
	for (let task of tasks) {
		let color;
		categories.some((c) => c.id === task.categoryId)
			? (color = categories.find((c) => c.id === task.categoryId).color)
			: (color = "#444444");
		$("#todo-content__box").append(`
			<div class="card-box" data-id="${task.id}" style="background-color:${color}a1">
				<p class="card-description">${task.description}</p>
				<div class="card-footer">
					<span class="card-date">${task.timeStampCreated}</span>
					<div class="card-btns__box">
						<button class="card-edit-btn"><i class="fa-solid fa-pencil"></i></button>
						<button class="complete-task-btn"><i class="fa-solid fa-check"></i></button>
					</div>
				</div>
			</div>
		`);
	}
}

function renderShowCategoryDropdown() {
	$("#show-category-dropdown").empty();
	$("#show-category-dropdown").append(
		`<option value="">Show category</option>`
	);
	for (let { category } of categories) {
		$("#show-category-dropdown").append(`
			<option value="${category}">${category}</option>
		`);
	}
}

function renderCurrentTab(currentPage) {
	switch (currentPage) {
		case "Active":
			renderActiveTaskCards();
			return;
		case "Completed":
			// renderCompletedTaskCards();
			return;
		default:
			console.log("Invalid page to render");
	}
}

function renderCurrentInputSection(currentInput) {
	switch (currentInput) {
		case "New Category":
			renderNewCategoryInputs();
			return;
		case "New Task":
			renderNewTaskInput();
			return;
		case "Empty":
			$("#new-category-inputs__section").empty();
		default:
			console.log("Invalid input section to render");
	}
}

function render() {
	renderColorBtns();
	renderShowCategoryDropdown();

	renderCurrentInputSection(currentInputState);
	renderCurrentTab(currentPage);
}
