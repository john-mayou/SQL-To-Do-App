$(document).ready(onReady);

function onReady() {
	getCategories();
	$("#show-color-btns").on("click", handleToggleColorButton);
	$("#color-btn-list").on(
		"click",
		"button:not(#show-category-inputs-btn)",
		handleCreateColorTodo
	);
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
}

// State
let showColorButtons = false;
let showNewCategoryFields = false;
let colorOfNewInputBox = null;
let categoryOptions = [];

function handleToggleColorButton() {
	if (showColorButtons) {
		showColorButtons = false;
	} else {
		showColorButtons = true;
	}
	render();
}

function handleCreateColorTodo() {
	console.log("in handle create color todo");
	// showColorButtons = false;
	// colorOfNewInputBox = $(this).attr("id").split("-")[0];
	// render();
	// colorOfNewInputBox = null;
}

// function handleAddTask() {
// 	let color = $(this).attr("id").split("-")[0];

// 	let newTask = {
// 		description: '',
// 		category = '',

// 	}
// }

function handleShowNewCategoryInputs() {
	showNewCategoryFields = true;
	render();
}

function handleAddNewCategory() {
	let showNewCategoryFields = false;
	const newCategory = {
		category: $("#category-title-input").val(),
		color: $("#category-color-input").val(),
	};

	console.log("new category", newCategory);
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
			categoryOptions = response;
			render();
		})
		.catch((error) => {
			console.log("Error on GET /category", error);
		});
}

function renderColorBtns() {
	if (showColorButtons) {
		$("#show-color-btns").html(`<i class="fa-solid fa-angle-up"></i>`);
		$("#color-btn-list").empty();
		for (let { id, category, color } of categoryOptions) {
			$("#color-btn-list").append(`
				<button 
					data-id="${id}"
					data-category="${category}"
					style="background-color:${color}"
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

function renderNewTaskBox() {
	const inputBoxHTML = `
		<div class="task-box">
			<textarea id="description-input" placeholder="Description"></textarea>
			<select id="category-input">
				<option id="add-category">Add Category <i class="fa-solid fa-plus"></i></option>
			</select>
		</div>
	`;
	if (colorOfNewInputBox) {
		$("#todo-content__box").prepend(inputBoxHTML);
		for (let category of taskCategoryOptions) {
			$("#category-input").prepend(`
				<option value='${category.toLocaleLowerCase()}'>${category}</option>
			`);
		}
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

function render() {
	renderColorBtns();
	renderNewTaskBox();
	renderNewCategoryInputs();
}
