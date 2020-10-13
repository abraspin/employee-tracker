CREATE database employees_db;

USE employees_db;

CREATE TABLE departments (
  id INT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT NOT NULL,
  title VARCHAR(100) NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employees (
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO departments
VALUES 
(1, "Accounting"),
(2,"Engineering"),
(3, "Sales"),
(4, "Human Resources"),
(5,  "Customer Service"),
(6, "Quality Assurance")