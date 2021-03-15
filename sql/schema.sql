DROP DATABASE IF EXISTS great_bay_db;

CREATE DATABASE great_bay_db;

USE great_bay_db;

CREATE TABLE items(
	name VARCHAR(25) NOT NULL,
  description VARCHAR(100) NOT NULL,
  price FLOAT NOT NULL
);