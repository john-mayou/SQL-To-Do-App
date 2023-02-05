CREATE TABLE "tasks" (
    "id" SERIAL PRIMARY KEY,
    "description" VARCHAR(120) NOT NULL,
    "category" VARCHAR(30) NOT NULL,
    "color" VARCHAR(30) NOT NULL,
    "isComplete" BOOLEAN,
    "timeStampCreated" TIMESTAMP WITHOUT TIME ZONE,
    "timeStampCompleted" TIMESTAMP WITHOUT TIME ZONE
);

INSERT INTO "tasks" 
("description", "category", "color", "isComplete", "timeStampCreated", "timeStampCompleted")
VALUES ('This is to-do #1', 'school', 'red', false, '2000-02-20 02:14:45', '2023-02-04 11:20:30'), 
('This is to-do #2', 'work', 'orange', false, '2010-02-25 06:55:32', '2022-01-02 15:26:39');

