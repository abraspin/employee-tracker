CREATE database employees;

USE employees;

CREATE TABLE departments (
  position INT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (position)
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

