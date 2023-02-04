$(document).ready(onReady);

function onReady() {
	getCategories();
	$("#show-color-btns").on("click", handleToggleColorButton);
	$("#color-btn-list").on(
		"click",
		"button:not(#add-category-btn)",
		handleCreateColorTodo
	);
	$(document).on("click", "#add-category-btn", handleAddCategories);
}

// State
let showColorButtons = false;
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

function handleAddCategories() {
	console.log("in add category");
}

function getCategories() {
	$.ajax({
		url: "/category",
		method: "GET",
	})
		.then((response) => {
			categoryOptions = response;
			render();
		})
		.catch((error) => {
			console.log("Error getCategories", error);
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
			`<button id="add-category-btn"><i class="fa-solid fa-plus"></i></button>`
		);
	} else {
		$("#show-color-btns").html(`<i class="fa-solid fa-plus"></i>`);
		$("#color-btn-list").empty();
	}
}

function renderNewInputBox() {
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

function render() {
	renderColorBtns();
	renderNewInputBox();
}
