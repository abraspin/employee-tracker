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

INSERT INTO roles
VALUES 
(1, "Accountant", 50,000, 1),
(1, "Software Engineer", 60,000, 2),
(1, "Sales Manager", 70,000, 3),
(1, "HR Manager", 65,000, 4),
(1, "Customer Service Representative", 35,000, 5),
(1, "QA Technician", 45,000, 6),