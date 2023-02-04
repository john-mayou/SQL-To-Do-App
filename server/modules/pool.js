const pg = require("pg");
let pool;

if (process.env.DATABASE_URL) {
	pool = new pg.Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false,
		},
	});
} else {
	pool = new pg.Pool({
		host: "localhost",
		port: 5432,
		database: "awesome_reads",
	});
}

module.exports = pool;
