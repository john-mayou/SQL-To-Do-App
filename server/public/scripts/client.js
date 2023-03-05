$(document).ready(onReady);

/**
 * Gets all tasks from database on load
 * Holds all event listener functions
 */
function onReady() {
	getCategories();
	getTasks();
	handleNewDateFilter();

	addSideBarEventListeners();
	addInputSectionEventListeners();
	addTaskCardEventListeners();
	addPageSwitchListeners();
	addFilterAndSortEventListeners();
}

// Event listener functions
function addSideBarEventListeners() {
	$("#show-color-btns").on("click", handleToggleColorButton);
	$("#color-btn-list").on(
		"click",
		"#show-category-inputs-btn",
		handleShowNewCategoryInputs
	);
	$("#color-btn-list").on(
		"click",
		"button:not(#show-category-inputs-btn)",
		handleShowNewTaskInput
	);
}

function addPageSwitchListeners() {
	$(".section-switch-btn").on("click", handleChangeCurrentPage);
}

function addInputSectionEventListeners() {
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
	$("#new-category-inputs__section").on(
		"click",
		"#add-new-category-btn",
		handleAddNewCategory
	);
}

function addTaskCardEventListeners() {
	$("#todo-content__box").on("click", ".card-edit-btn", handleEditTask);
	$("#todo-content__box").on("click", ".cancel-edit-btn", handleCancelEdit);
	$("#todo-content__box").on("click", ".done-edit-btn", handleDoneEditing);
	$("#todo-content__box").on(
		"click",
		".complete-task-btn",
		handleToggleCompleteTask
	);
	$("#todo-content__box").on(
		"click",
		".uncomplete-task-btn",
		handleToggleCompleteTask
	);
	$("#todo-content__box").on(
		"click",
		".delete-task-btn",
		popupDeleteConfirmation
	);
}

function addFilterAndSortEventListeners() {
	$("#sort-by-date-dropdown").on("change", handleNewDateFilter);
	$("#description-search").on("input", handleNewDescriptionFilter);
}

// Toggling input fields and button states
let showColorButtons = false;
let idOfNewTaskCategory = null;
let currentInputState = "Empty";

// Task card states
let currentPageSelected = "Active";
let idCurrentCardBeingEdited = null;

// Filter states
let dateFilter = "ASC";
let searchFilter;

// States from database
let categories = [];
let tasks = [];

// Helper functions
/**
 * Takes a zero-th month number and converts it into an abbreviated month string
 * @param {number} number // month number 0 - 11
 * @returns string
 */
function getMonthFromNumber(number) {
	// helper function for getDateAndTime
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

/**
 * Gets the current time, and returns a formated string version of it
 * @returns string
 */
function getDateAndTime() {
	// creates a new Date object and returns the a formatted time stamp string
	let now = new Date();
	const month = getMonthFromNumber(now.getMonth());
	return `${month} ${now.getDate()}, ${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
}

/**
 * @param {string} str
 * @returns string with the first character upper case (thing => Thing)
 */
function toTitleCase(str) {
	return str
		.split(" ")
		.map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
		.join(" ");
}

/**
 * @param {boolean} boolean
 * @returns inverse boolean of argument value
 */
function getInverseBoolean(boolean) {
	return boolean ? false : true;
}

/**
 * Swal popup to confirm deletion of todo task, on success handleDeleteTask is then called
 */
function popupDeleteConfirmation() {
	const id = $(this).closest(".card-box").data("id");
	Swal.fire({
		title: "Are you sure?",
		text: "You won't be able to revert this!",
		icon: "warning",
		showCancelButton: true,
		cancelButtonColor: "#3085d6",
		confirmButtonColor: "#d33",
		confirmButtonText: "Yes, delete it!",
	}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire("Deleted!", "Your file has been deleted.", "success");
			handleDeleteTask(id);
		}
	});
}

// Event handler functions
/**
 * Toggles state to hide or show category color buttons in side panel
 */
function handleToggleColorButton() {
	showColorButtons ? (showColorButtons = false) : (showColorButtons = true);
	render();
}

/**
 * Changes state to re-render an input to add a new to-do item
 */
function handleShowNewTaskInput() {
	idOfNewTaskCategory = $(this).data("id");
	currentInputState = "New Task";

	handleToggleColorButton();
	render();
}

/**
 * Changes state to re-render an input to add a new category
 */
function handleShowNewCategoryInputs() {
	currentInputState = "New Category";

	handleToggleColorButton();
	render();
}

/**
 * Gathers data from state and inputs, sends it to the database as a post
 * Resets the input display state to remove it from the DOM
 */
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
		.then(() => {
			currentInputState = "Empty";
			getTasks();
		})
		.catch((error) => {
			console.log("Error on POST /task", error);
		});
}

/**
 * Fetches tasks from server, updates local state with response
 */
function getTasks() {
	$.ajax({
		url: `/task/${dateFilter}`, // ASC or DESC
		method: "GET",
	})
		.then((response) => {
			tasks = response;
			render();
		})
		.catch((error) => {
			console.log("Error on GET /task", error);
		});
}

/**
 * Gathers category name and color inputs and sends them to the database via post
 * Resets input state to empty the input container
 */
function handleAddNewCategory() {
	const newCategory = {
		category: toTitleCase($("#category-title-input").val()),
		color: $("#category-color-input").val(), // returns a hexcode
	};

	$.ajax({
		url: "/category",
		method: "POST",
		data: newCategory,
	})
		.then(() => {
			currentInputState = "Empty";
			getCategories();
		})
		.catch((error) => {
			console.log("Error on POST /category", error);
		});
}

/**
 * Fetches categories from server, updates local state with response
 */
function getCategories() {
	$.ajax({
		url: "/category",
		method: "GET",
	})
		.then((response) => {
			categories = response;
			render();
		})
		.catch((error) => {
			console.log("Error on GET /category", error);
		});
}

/**
 * Takes id from local state, sends a delete request to the server, re-fetches categories
 */
function handleDeleteCategory() {
	const id = idOfNewTaskCategory;

	$.ajax({
		url: `/category/${id}`,
		method: "DELETE",
	})
		.then(() => {
			currentInputState = "Empty";
			getCategories();
		})
		.catch((error) => {
			console.log("Error on GET /category/:id", error);
		});
}

/**
 * Sets local state to the id of the click event using DOM traversal
 */
function handleEditTask() {
	idCurrentCardBeingEdited = $(this).closest(".card-box").data("id");
	render();
}

/**
 * Resets local state of value being edited
 */
function handleCancelEdit() {
	idCurrentCardBeingEdited = null;
	render();
}

/**
 * Extracts new values from edit inputs, updated server data, re-fetches changes
 */
function handleDoneEditing() {
	const id = idCurrentCardBeingEdited;
	const currentState = tasks.find((t) => t.id === id);

	// checking if user accidently reset their category to invalid category
	let newCategory;
	!$("#edit-category-select :selected").val() &&
	categories.some((c) => c.id === currentState.categoryId)
		? (newCategory = currentState.categoryId)
		: (newCategory = Number($("#edit-category-select :selected").val()));

	// update keeps the all original values exept description and categoryId
	// sending the whole object allows me to only have one PUT endpoint server side
	const updatedTask = {
		description: $("#new-edit-description").val(),
		categoryId: newCategory,
		isComplete: currentState.isComplete,
		timeStampCreated: currentState.timeStampCreated,
		timeStampCompleted: currentState.timeStampCompleted,
	};

	$.ajax({
		url: `/task/${id}`,
		method: "PUT",
		data: updatedTask,
	})
		.then(() => {
			getTasks();
		})
		.catch((error) => {
			console.log("Error on PUT /task", error);
		});

	idCurrentCardBeingEdited = null; // reset edit
	render();
}

/**
 * Finds id of click event, sends a put to the server to change isComplete and timeStampCompleted values
 * Then fetches changes
 */
function handleToggleCompleteTask() {
	const id = $(this).closest(".card-box").data("id");
	const currentState = tasks.find((t) => t.id === id);
	let inverseIsCompleteValue = getInverseBoolean(currentState.isComplete);

	const updatedTask = {
		description: currentState.description,
		categoryId: currentState.categoryId,
		isComplete: inverseIsCompleteValue, // value is toggled
		timeStampCreated: currentState.timeStampCreated,
		timeStampCompleted: getDateAndTime(), // sets from null to current timestamp
	};

	$.ajax({
		url: `/task/${id}`,
		method: "PUT",
		data: updatedTask,
	})
		.then(() => {
			getTasks();
		})
		.catch((error) => {
			console.log("Error on PUT /task", error);
		});

	render();
}

/**
 * Sends a delete request to the server with the id as a query param
 * @param {number} id
 */
function handleDeleteTask(id) {
	$.ajax({
		url: `/task/${id}`,
		method: "DELETE",
	})
		.then(() => {
			getTasks();
		})
		.catch((error) => {
			console.log("Error on DELETE /task", error);
		});
}

/**
 * Changes page state based on click event button value
 */
function handleChangeCurrentPage() {
	currentPageSelected = $(this).text().trim();
	render();
}

// Filter handler functions
/**
 * This is changing the state that getTasks uses in its query param
 */
function handleNewDateFilter() {
	dateFilter = $("#sort-by-date-dropdown :selected").val(); // dropdown value (ASC | DESC)
	getTasks();
}

/**
 * This sets local state to the string in the search input, this is then later to filter the DOM tasks
 */
function handleNewDescriptionFilter() {
	searchFilter = $("#description-search").val();
	getTasks();
}

// Render functions
function renderColorBtns() {
	// these are the side panel color dots
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
	// appends input fields for new task
	const category = categories.find(
		(c) => c.id === idOfNewTaskCategory
	).category;

	const HTML = `
			<textarea id="description-input" placeholder="Add new ${category.toLowerCase()} task"></textarea>
			<button id="add-new-task-btn" class="btn btn-success">Add Task</button>
			<button id="delete-category-btn" class="btn btn-danger">Delete Category</button>
	`;

	$("#new-category-inputs__section").empty();
	$("#new-category-inputs__section").append(HTML);
}

function renderNewCategoryInputs() {
	// appends category title and color inputs fields for new category
	const HTML = `
			<input id="category-title-input" type="text" placeholder="Category Title">
			<input id="category-color-input" type="color">
			<button id="add-new-category-btn" class="btn btn-outline-dark">Add</button>
	`;

	$("#new-category-inputs__section").empty();
	$("#new-category-inputs__section").append(HTML);
}

function renderActiveTaskCards() {
	// renders either edited cards or regular cards when active page is focused
	$("#todo-content__box").empty();
	for (let task of filterTasks([...tasks])) {
		if (task.isComplete) {
			continue;
		}
		const color = findColorOfTask(task);
		task.id === idCurrentCardBeingEdited
			? $("#todo-content__box").append(createEditTaskCard(task, color))
			: $("#todo-content__box").append(
					createRegularTaskCard(task, color)
			  );
	}
}

function renderCompletedTaskCards() {
	// renders only completed cards when completed page is focused
	$("#todo-content__box").empty();
	for (let task of filterTasks([...tasks])) {
		if (!task.isComplete) {
			continue;
		}
		const color = findColorOfTask(task);
		$("#todo-content__box").append(createCompletedTaskCard(task, color));
	}
}

function renderShowCategoryDropdown() {
	$(".show-category-dropdown").empty();

	// different starting options for different places on the DOM
	$("#edit-category-select").append(`<option value="">New Category</option>`);
	$("#filter-category-select").append(`<option value="">Category</option>`);

	for (let { id, category } of categories) {
		$(".show-category-dropdown").append(`
			<option value="${id}">${category}</option>
		`);
	}
}

function renderCurrentTab(currentPage) {
	switch (currentPage) {
		case "Active":
			renderActiveTaskCards();
			renderActiveTabStyling("Active");
			return;
		case "Completed":
			renderCompletedTaskCards();
			renderActiveTabStyling("Completed");
			return;
		default:
			console.log("Invalid page to render", currentPage);
	}
}

function renderActiveTabStyling(currentPage) {
	switch (currentPage) {
		case "Active":
			$("#completed-tab-btn").removeClass("active-page");
			$("#active-tab-btn").addClass("active-page");
			return;
		case "Completed":
			$("#active-tab-btn").removeClass("active-page");
			$("#completed-tab-btn").addClass("active-page");
			return;
		default:
			console.log("Invalid active tab to style", currentPage);
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
			return;
		default:
			console.log("Invalid input section to render", currentInput);
	}
}

// Render helper functions
function filterTasks(array) {
	if (searchFilter) {
		return array.filter((task) => task.description.includes(searchFilter));
	}
	return array;
}

function findColorOfTask(task) {
	// if category exists, return category color, if not return dark gray
	return categories.some((c) => c.id === task.categoryId)
		? categories.find((c) => c.id === task.categoryId).color
		: "#444444";
}

function createRegularTaskCard(task, color) {
	return `
	<div class="card-box" data-id="${task.id}" style="background-color:${color}a1">
		<p class="card-description">${task.description}</p>
		<div class="card-footer">
			<span class="card-date">${task.timeStampCreated}</span>
			<div class="card-btns__box">
				<button class="card-edit-btn"><i class="fa-solid fa-pencil"></i></button>
				<button class="complete-task-btn"><i class="fa-solid fa-check"></i></button>
			</div>
		</div>
	</div>`;
}

function createEditTaskCard(task, color) {
	return `
	<div class="card-box" data-id="${task.id}" style="background-color:${color}a1">
		<p class="card-description"><textarea id="new-edit-description">${task.description}</textarea></p>
		<div class="card-footer">
			<select id="edit-category-select" class="show-category-dropdown"></select>
			<div class="card-btns__box">
				<button class="cancel-edit-btn"><i class="fa-solid fa-ban"></i></button>
				<button class="done-edit-btn"><i class="fa-solid fa-plus"></i></button>
			</div>
		</div>
	</div>`;
}

function createCompletedTaskCard(task, color) {
	return `
	<div class="card-box" data-id="${task.id}" style="background-color:${color}a1">
		<p class="card-description">${task.description}</p>
		<div class="card-footer">
			<span class="card-date">${task.timeStampCompleted}</span>
			<div class="card-btns__box">
				<button class="uncomplete-task-btn"><i class="fa-solid fa-rotate-left"></i></button>
				<button class="delete-task-btn"><i class="fa-solid fa-trash"></i></button>
			</div>
		</div>
	</div>`;
}

function render() {
	renderColorBtns();

	renderCurrentInputSection(currentInputState);
	renderCurrentTab(currentPageSelected);

	// after page loads
	renderShowCategoryDropdown();
}
