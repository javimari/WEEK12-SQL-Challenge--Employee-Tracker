// Import required modules
const mysql = require('mysql');         // MySQL library to connect to the MySQL database
const inquirer = require('inquirer');   // Inquirer for command-line prompts
const chalk = require('chalk');         // Chalk for styling console messages
const consoleTable = require('console.table'); // Console.table for tabular display of data
const util = require("util");           // Util for converting callback-based functions to Promises

// Create a MySQL connection to the 'employeeDB' database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',              // MySQL root user
  password: 'River0311$',     // MySQL password
  database: 'employeeDB'      // Database being used
});

// Connect to the database and start the prompt if successful
connection.connect(err => {
  if (err) throw err;        // Handle connection error
  console.log('Connected to the database');
  start();                   // Start the application
});

// Promisify MySQL queries to use async/await
const queryAsync = util.promisify(connection.query).bind(connection);

// Initial prompt to the user with various options
async function start() {
  const answer = await inquirer.prompt({
    name: 'selectOption',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',          // View departments
      'View All Roles',                // View roles
      'View All Employees',            // View employees
      'Add A Department',              // Add a department
      'Add A Role',                    // Add a role
      'Add An Employee',               // Add an employee
      'Delete A Department',           // Delete a department
      'Delete A Role',                 // Delete a role
      'Delete An Employee',            // Delete an employee
      'Update A Role\'s Salary',       // Update a role's salary
      'Update An Employee\'s Role',    // Update an employee's role
      'Update An Employee\'s Manager', // Update an employee's manager
      'Exit'                           // Exit the application
    ]
  });

  // Switch based on user selection to execute the respective function
  switch (answer.selectOption) {
    case 'View All Departments': viewDepartments(); break;
    case 'View All Roles': viewRoles(); break;
    case 'View All Employees': viewEmployees(); break;
    case 'Add A Department': addDepartment(); break;
    case 'Add A Role': addRole(); break;
    case 'Add An Employee': addEmployee(); break;
    case 'Delete A Department': deleteDepartment(); break;
    case 'Delete A Role': deleteRole(); break;
    case 'Delete An Employee': deleteEmployee(); break;
    case 'Update A Role\'s Salary': updateSalary(); break;
    case 'Update An Employee\'s Role': updateRole(); break;
    case 'Update An Employee\'s Manager': updateManager(); break;
    case 'Exit': console.log('Goodbye!'); connection.end(); break;
  }
}

// View all departments and display them in a table format
async function viewDepartments() {
  const res = await queryAsync('SELECT * FROM department'); // SQL query to fetch all departments
  console.log('\n');
  console.table(res); // Display results as a table
  start(); // Return to start prompt
}

// View all roles with department names and display them in a table format
async function viewRoles() {
  const res = await queryAsync(`
    SELECT role.id, role.title, role.salary, department.name AS department 
    FROM role 
    INNER JOIN department ON role.departmentId = department.id`); // SQL join to combine role and department data
  console.log('\n');
  console.table(res); // Display results as a table
  start(); // Return to start prompt
}

// View all employees along with their roles and managers, display them in a table format
async function viewEmployees() {
  const res = await queryAsync(`
    SELECT e.id, CONCAT(e.firstName, " ", e.lastName) AS employeeName, role.title, role.salary, 
           CONCAT(m.firstName, " ", m.lastName) AS managerName 
    FROM employee e 
    LEFT JOIN employee m ON m.id = e.managerId 
    INNER JOIN role ON e.roleId = role.id`); // SQL join to fetch employees, their roles, and their managers
  console.log('\n');
  console.table(res); // Display results as a table
  start(); // Return to start prompt
}

// Add a department to the database
async function addDepartment() {
  const answer = await inquirer.prompt({
    name: 'departmentName',
    type: 'input',
    message: 'Department Name:' // Ask for the department name
  });
  await queryAsync('INSERT INTO department SET ?', { name: answer.departmentName }); // SQL insert query
  console.log(chalk.bold.bgCyan('SUCCESS:'), 'Department was added.');
  viewDepartments(); // Display updated list of departments
}

// Add a role to the database with associated salary and department
async function addRole() {
  const res = await queryAsync('SELECT * FROM department'); // Fetch departments to show as choices
  const answer = await inquirer.prompt([
    {
      name: 'role',
      type: 'input',
      message: 'Role Name:' // Role title input
    },
    {
      name: 'salary',
      type: 'input',
      message: 'Salary:',
      validate: value => !isNaN(value) // Ensure salary is a number
    },
    {
      name: 'department',
      type: 'list',
      message: 'Department:',
      choices: res.map(dept => dept.name) // Display department choices
    }
  ]);

  const department = res.find(dept => dept.name === answer.department); // Find the selected department
  await queryAsync('INSERT INTO role SET ?', {
    title: answer.role,
    salary: answer.salary,
    departmentId: department.id // Link role to department ID
  });
  console.log(chalk.bold.bgCyan('SUCCESS:'), 'Role was added.');
  viewRoles(); // Display updated list of roles
}

// Add a new employee to the database and optionally assign them a manager
async function addEmployee() {
  const resR = await queryAsync('SELECT * FROM role'); // Fetch roles
  const answerR = await inquirer.prompt([
    { name: 'firstName', type: 'input', message: 'First Name:' },
    { name: 'lastName', type: 'input', message: 'Last Name:' },
    {
      name: 'role',
      type: 'list',
      message: 'Role:',
      choices: resR.map(role => role.title) // Display role choices
    }
  ]);

  const resE = await queryAsync('SELECT id, CONCAT(firstName, " ", lastName) AS employeeName FROM employee'); // Fetch employees
  const answerE = await inquirer.prompt({
    name: 'manager',
    type: 'list',
    message: 'Manager:',
    choices: ['None'].concat(resE.map(emp => emp.employeeName)) // Allow "None" for no manager
  });

  const role = resR.find(r => r.title === answerR.role); // Find role by title
  const manager = resE.find(emp => emp.employeeName === answerE.manager); // Find manager by name

  await queryAsync('INSERT INTO employee SET ?', {
    firstName: answerR.firstName,
    lastName: answerR.lastName,
    roleId: role.id, // Assign role ID
    managerId: manager ? manager.id : null // Assign manager ID or null
  });
  console.log(chalk.bold.bgCyan('SUCCESS:'), 'Employee was added.');
  viewEmployees(); // Display updated list of employees
}


