-- Select and use the 'employeeDB' database
USE employeeDB;

-- Insert department names into the 'department' table
INSERT INTO department (name)
VALUES 
    ('Development'),         -- Department 1: Development
    ('Sales');               -- Department 2: Sales

-- Insert roles into the 'role' table, specifying title, salary, and the corresponding department
INSERT INTO role (title, salary, departmentId)
VALUES 
    ('Lead Developer', 95000, 1),        -- Role 1 in the Development department
    ('Software Engineer', 70000, 1),     -- Role 2 in the Development department
    ('QA Engineer', 60000, 1),           -- Role 3 in the Development department
    ('Sales Director', 90000, 2),        -- Role 4 in the Sales department
    ('Account Manager', 65000, 2),       -- Role 5 in the Sales department
    ('Sales Associate', 45000, 2);       -- Role 6 in the Sales department

-- Insert employee data into the 'employee' table, providing first name, last name, and roleId
INSERT INTO employee (firstName, lastName, roleId)
VALUES 
    ('Michael', 'Smith', 1),             -- Employee 1: Michael is the Lead Developer (roleId 1)
    ('Emily', 'Johnson', 4),             -- Employee 2: Emily is the Sales Director (roleId 4)
    ('Daniel', 'Williams', 5);           -- Employee 3: Daniel is an Account Manager (roleId 5)

-- Insert employee data with manager relationships, using roleId and managerId
INSERT INTO employee (firstName, lastName, roleId, managerId)
VALUES 
    ('Samantha', 'Brown', 2, 1),         -- Employee 4: Samantha is a Software Engineer (roleId 2), reports to Michael (employeeId 1)
    ('Christopher', 'Davis', 3, 1),      -- Employee 5: Christopher is a QA Engineer (roleId 3), reports to Michael (employeeId 1)
    ('Sarah', 'Wilson', 6, 3);           -- Employee 6: Sarah is a Sales Associate (roleId 6), reports to Daniel (employeeId 3)
