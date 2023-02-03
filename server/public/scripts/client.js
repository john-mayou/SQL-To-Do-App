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
        <button id="yellow-btn"></button>
        <button id="orange-btn"></button>
        <button id="purple-btn"></button>
        <button id="blue-btn"></button>
        <button id="green-btn"></button>
    `;
}

function render() {
	if (showColorButtons) {
		$("show-color-btns").text("-");
		$("#color-btn-list").empty();
		$("#color-btn-list").append(renderColorBtns());
	} else {
		$("show-color-btns").text("+");
		$("#color-btn-list").empty();
	}
}
