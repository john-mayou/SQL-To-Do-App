const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");

router.get("/", (req, res) => {
	const queryText = `
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
	const newTask = req.body;
	const queryText = `
        INSERT INTO "tasks" ("description", "categoryId", "isComplete", "timeStampCreated", "timeStampCompleted")
        VALUES ($1, $2, $3, $4, $5);
    `;

	const queryValues = [
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

router.put("/:id", (req, res) => {
	const updatedTask = req.body;

	const queryText = `
        UPDATE "tasks" 
        SET "description"=$1,
        "categoryId"=$2,
        "isComplete"=$3,
        "timeStampCreated"=$4,
        "timeStampCompleted"=$5
        WHERE id=$6;
    `;

	const queryValues = [
		updatedTask.description,
		updatedTask.categoryId,
		updatedTask.isComplete,
		updatedTask.timeStampCreated,
		updatedTask.timeStampCompleted,
		req.params.id,
	];

	pool.query(queryText, queryValues)
		.then(() => {
			res.sendStatus(200);
		})
		.catch((error) => {
			console.log(`Error making PUT query: ${queryText}`, error);
			res.sendStatus(500);
		});
});

router.delete("/:id", (req, res) => {
	const queryText = `
        DELETE FROM "tasks"
        WHERE id=$1;
    `;

	const queryParams = [req.params.id];

	pool.query(queryText, queryParams)
		.then(() => {
			res.sendStatus(204);
		})
		.catch((error) => {
			console.log(`Error making PUT query: ${queryText}`, error);
			res.sendStatus(500);
		});
});

module.exports = router;
