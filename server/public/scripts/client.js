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

	// After this is task box event listeners
}

// State
// Toggling input fields and buttons
let showColorButtons = false;
let showNewCategoryFields = false;
let showNewTaskInput = false;
let idOfNewTaskCategory = null;

// Task card states
let currentPage = "Active";
let IdCurrentCardBeingEdited = null;

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

// Toggling through selector and input fields
function handleToggleColorButton() {
	if (showColorButtons) {
		showColorButtons = false;
	} else {
		showColorButtons = true;
	}
	render();
}

function handleShowNewTaskInput() {
	idOfNewTaskCategory = $(this).data("id");
	showNewTaskInput = true;
	showNewCategoryFields = false;
	showColorButtons = false;
	render();
}

function handleShowNewCategoryInputs() {
	showNewCategoryFields = true;
	showNewTaskInput = false;
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
			getTasks();
		})
		.catch((error) => {
			console.log("Error on POST /task", error);
		});

	// reseting state
	showNewTaskInput = false;
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
	let showNewCategoryFields = false;
	const newCategory = {
		category: $("#category-title-input").val(),
		color: $("#category-color-input").val(),
	};

	$.ajax({
		url: "/category",
		method: "POST",
		data: newCategory,
	})
		.then((response) => {
			console.log("Response POST /category", response);
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
	const textAreaHTML = `
			<textarea id="description-input" placeholder="Task Description"></textarea>
			<button id="add-new-task-btn" class="btn btn-outline-dark">Add</button>
	`;

	if (showNewTaskInput) {
		$("#new-category-inputs__section").empty();
		$("#new-category-inputs__section").append(textAreaHTML);
	}
}

function renderNewCategoryInputs() {
	if (showNewCategoryFields) {
		$("#new-category-inputs__section").empty();
		$("#new-category-inputs__section").append(`
			<input id="category-title-input" type="text" placeholder="Category Title">
			<input id="category-color-input" type="color">
			<button id="add-new-category-btn" class="btn btn-outline-dark">Add</button>
		`);
	}
}

function renderActiveTaskCards() {
	$("#todo-content__box").empty();
	for (let task of tasks) {
		const color = categories.find((c) => c.id === task.categoryId).color;
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

function renderCurrentTab(page) {
	switch (page) {
		case "Active":
			renderActiveTaskCards();
			return;
		case "Completed":
			// renderCompletedTaskCards();
			return;
		case "Categories":
			// renderTaskCardsCategories();
			return;
		default:
			console.log("Invalid page to render");
	}
}

function render() {
	renderColorBtns();
	renderNewCategoryInputs();
	renderNewTaskInput();

	renderCurrentTab(currentPage);
}
