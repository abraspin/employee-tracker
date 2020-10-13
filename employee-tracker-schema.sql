
DROP DATABASE IF EXISTS employees_db;
CREATE database employees_db;

USE employees_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
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
(6, "Quality Assurance"),
(7, "Management");

INSERT INTO roles
VALUES 
(1, "Accountant", 50000, 1),
(2, "Software Engineer", 60000, 2),
(3, "Salesperson", 70000, 3),
(4, "HR Manager", 65000, 4),
(5, "Customer Service Representative", 35000, 5),
(6, "QA Technician", 45000, 6),
(7, "Branch Manager", 45000, 7),
(8, "Receptionist", 15000, 5),
(9, "VP of Sales", 95000, 7);

INSERT INTO employees
VALUES 
  (1,"Michael","Scott", 7, 9),
  (2, "Jim","Halperd", 3, 7),
  (3, "Pam", "Beasley", 8, 7),
  (4, "Oscar", "Martinez", 1, 7),
  (5, "Jan", "Levenson", 9, 9);
    