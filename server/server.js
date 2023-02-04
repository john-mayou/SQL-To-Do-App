// Boilerplate
const express = require("express");
const app = express();
app.use(express.static("server/public"));
app.use(express.urlencoded({ extended: true }));

// Route Imports
let taskRouter = require("./routes/task.router");
let categoryRouter = require("./routes/category.router");

// Route Endpoints
app.use("/task", taskRouter);
app.use("/category", categoryRouter);

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log("Port Listening", PORT);
});
