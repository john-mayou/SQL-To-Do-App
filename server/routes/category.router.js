const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");

router.get("/", (req, res) => {
	let queryText = `
        SELECT * FROM "categories";
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
	let newCategory = req.body;
	let queryText = `
        INSERT INTO "categories" ("category", "color")
        VALUES ($1, $2);
    `;

	let queryValues = [newCategory.category, newCategory.color];

	pool.query(queryText, queryValues)
		.then(() => {
			res.sendStatus(201);
		})
		.catch((error) => {
			console.log(`Error making POST query: ${queryText}`, error);
			res.sendStatus(500);
		});
});

router.delete("/:id", (req, res) => {
	let queryText = `
        DELETE FROM "categories"
        WHERE id = $1;
    `;

	let queryParams = [req.params.id];

	pool.query(queryText, queryParams)
		.then(() => {
			res.sendStatus(204);
		})
		.catch((error) => {
			console.log(`Error making DELETE query: ${queryText}`, error);
			res.sendStatus(500);
		});
});

module.exports = router;
