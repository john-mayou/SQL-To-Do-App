CREATE TABLE "tasks" (
    "id" SERIAL PRIMARY KEY,
    "description" VARCHAR(120) NOT NULL,
    "categoryId" INTEGER,
    "isComplete" BOOLEAN,
    "timeStampCreated" VARCHAR(60) NOT NULL,
    "timeStampCompleted" VARCHAR(60)
);

INSERT INTO "tasks" ("description", "categoryId", "isComplete", "timeStampCreated", "timeStampCompleted")
VALUES 
('Grocery shopping', 3, false, 'April 1, 2020 02:14', null), 
('Weekend assignment', 1, false, 'May 1, 2018 13:56', null),
('Workout @ 6:00PM', 4, false, 'Feb 1, 2016 15:55', null),
('Clean apartment', 3, false, 'Jan 1, 2014 23:40', null),
('Bake cookies', 5, false, 'Sep 1, 2012 01:02', null),
('Meeting with manager @ 10:00AM', 2, false, 'Dec 1, 2010 05:46', null);

CREATE TABLE "categories" (
	"id" SERIAL PRIMARY KEY,
	"category" VARCHAR(30) NOT NULL,
	"color" VARCHAR(30) NOT NULL
);

INSERT INTO "categories" ("category", "color")
VALUES ('School', '#FFFF00'), ('Work', '#FF7100'),
('Chores', '#FF0000'), ('Fitness', '#0000FF'),
('Personal', '#009100');