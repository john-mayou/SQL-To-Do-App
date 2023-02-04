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
		});
});

module.exports = router;
