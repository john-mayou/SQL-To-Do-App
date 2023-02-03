// Boilerplate
const express = require("express");
const app = express();
app.use(express.static("server/public"));
app.use(express.urlencoded({ extended: true }));

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log("Port Listening", PORT);
});
