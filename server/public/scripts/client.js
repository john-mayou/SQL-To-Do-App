$(document).ready(onReady);

function onReady() {
	$("#show-color-btns").on("click", handleToggleColorButton);
}

// State
let showColorButtons = false;

function handleToggleColorButton() {
	if (showColorButtons) {
		showColorButtons = false;
	} else {
		showColorButtons = true;
	}
	render();
}

function renderColorBtns() {
	return `
        <button id="red-btn"></button>
        <button id="orange-btn"></button>
        <button id="purple-btn"></button>
        <button id="blue-btn"></button>
        <button id="green-btn"></button>
    `;
}

function render() {
	if (showColorButtons) {
		$("#show-color-btns").html(`<i class="fa-solid fa-angle-up"></i>`);
		$("#color-btn-list").empty();
		$("#color-btn-list").append(renderColorBtns());
	} else {
		$("#show-color-btns").html(`<i class="fa-solid fa-plus"></i>`);
		$("#color-btn-list").empty();
	}
}
