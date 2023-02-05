const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");

router.get("/", (req, res) => {
	let queryText = `
        SELECT * FROM "tasks";
    `;

	pool.query(queryText)
		.then((result) => {
			const rows = result.rows;
			res.status(200);
			res.send(rows);
		})
		.catch((error) => {
			console.log(`Error making GET query: ${queryText}`, error);
			res.sendStatus(500);
		});
});

router.post("/", (req, res) => {
	let newTask = req.body;
	let queryText = `
        INSERT INTO "tasks" ("description", "categoryId", "isComplete", "timeStampCreated", "timeStampCompleted")
        VALUES ($1, $2, $3, $4, $5);
    `;

	let queryValues = [
		newTask.description,
		newTask.categoryId,
		newTask.isComplete,
		newTask.timeStampCreated,
		newTask.timeStampCompleted,
	];

	pool.query(queryText, queryValues)
		.then(() => {
			res.sendStatus(201);
		})
		.catch((error) => {
			console.log(`Error making POST query: ${queryText}`, error);
			res.sendStatus(500);
		});
});

module.exports = router;
