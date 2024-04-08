DROP DATABASE IF EXISTS muscleMemory;

SHOW DATABASES;
CREATE DATABASE IF NOT EXISTS muscleMemory;
USE muscleMemory;
CREATE TABLE mmUser(
  username VARCHAR(32) PRIMARY KEY NOT NULL,
  email VARCHAR(100) NOT NULL,
  pword VARCHAR(75) NOT NULL,
  bmr DOUBLE
);

CREATE TABLE blogPost(
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  content VARCHAR(255) NOT NULL,
  poster VARCHAR(32) NOT NULL
);

CREATE TABLE foodLog(
	food_id INT AUTO_INCREMENT PRIMARY KEY,
	food_name VARCHAR(32),
    food_desc VARCHAR(127),
    calories_eaten INT,
	day_eaten date,
	username VARCHAR(32)
);

CREATE TABLE exerciseLog(
	num_steps INT,
	calories_burnt INT,
    day_logged date,
	username VARCHAR(32)
);

SHOW tables;

SELECT * FROM mmUser;
SELECT * FROM blogPost;
SELECT * FROM foodLog;
SELECT * FROM exerciseLog;
