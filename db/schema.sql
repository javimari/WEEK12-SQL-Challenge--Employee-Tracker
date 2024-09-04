-- Drop the database if it already exists to start fresh
DROP DATABASE IF EXISTS employeeDB;

-- Create a new database named 'employeeDB'
CREATE DATABASE employeeDB;

-- Switch to using the 'employeeDB' database
USE employeeDB;

-- Create 'department' table to store department details
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,         -- Auto-incrementing primary key
    name VARCHAR(30) NOT NULL,              -- Name of the department, cannot be null
    PRIMARY KEY (id)                        -- Set 'id' as the primary key
);

-- Create 'role' table to store roles within departments
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,         -- Auto-incrementing primary key
    title VARCHAR(30) NOT NULL,             -- Role title, cannot be null
    salary INT NOT NULL,                    -- Salary for the role, cannot be null
    departmentId INT NOT NULL,              -- Foreign key referencing the 'department' table
    PRIMARY KEY (id)                        -- Set 'id' as the primary key
);

-- Create 'employee' table to store employee details
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,         -- Auto-incrementing primary key
    firstName VARCHAR(30) NOT NULL,         -- Employee's first name, cannot be null
    lastName VARCHAR(30) NOT NULL,          -- Employee's last name, cannot be null
    roleId INT NOT NULL,                    -- Foreign key referencing the 'role' table
    managerId INT,                          -- Optional field for the manager's employee ID
    PRIMARY KEY (id)                        -- Set 'id' as the primary key
);
