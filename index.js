// Import our dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const util = require("util");
const { promises } = require("fs");

let rolesList = [];
let employeesList = [];
let departmentsList = [];

// Create/configure our MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "pV2XnNfDhy3jTWEe",
  database: "employees_db",
});

//connection.query now returns a promise
connection.query = util.promisify(connection.query);

// Connect to the MySQL server, and call `mainPrompt()` when connected
connection.connect((err) => {
  if (err) {
    throw err;
  }
  // welcome text and main program functionality
  welcomeLogger();
  mainPrompt();
});

//prints program title to console
function welcomeLogger() {
  console.log(`
    +-----------------------------------------------------+
    |    ______                 _                         |
    |   |  ____|               | |                        | 
    |   | |__   _ __ ___  _ __ | | ___  _   _  ___  ___   |
    |   |  __| | '_  _  || '_ || |/ _ || | | |/ _ |/ _ |  |
    |   | |____| | | | | | |_) | | (_) | |_| |  __/  __/  |
    |   |______|_|_|_|_|_| .__/|_||___/ |__, ||___||___|  |
    |          |__   __| | |       | |   __/ |            |
    |             | |_ __|_|__  ___| | _|___/_ __         | 
    |             | | '__/ _  |/ __| |/ / _ | '__|        |
    |             | | | | (_| | (__|   <  __/ |           |
    |             |_|_|  |__,_||___|_||_|___|_|           |
    |                                                     |
    +-----------------------------------------------------+                    
`);
}

//prompt user for primary task desired
function mainPrompt() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add New Department",
        "Add New Role",
        "Add New Employee",
        "Update Employee Role",
        //TODO: Future development
        // "View All Employees by Department",
        // "Remove Employee",
        // "Update Employee Manager",
        // "View All Employees by Manager",
        "Exit",
      ],
    })
    .then(onMainPromptAnswer);
}

// pass in selected action to switch statement
function onMainPromptAnswer({ action }) {
  switch (action) {
    case "View All Departments":
      viewAllDepartments();
      break;
    case "View All Roles":
      viewAllRoles();
      break;
    case "View All Employees":
      viewAllEmployees();
      break;
    case "Add New Department":
      addNewDepartment();
      break;
    case "Add New Role":
      addNewRole();
      break;
    case "Add New Employee":
      addNewEmployee();
      break;
    case "Update Employee Role":
      updateEmployeeRole();
      break;
    case "Exit":
    default:
      console.log("Goodbye!");
      connection.end();
  }
}

// Returns query of all columns from departments table
function viewAllDepartments() {
  connection.query("SELECT * FROM departments", (err, res) => {
    console.log("\n--Departments query complete--");
    if (err) {
      throw err;
    }
    //log
    console.table("\nDepartments:", res);
    console.log("----------------------------------------------------");
    mainPrompt();
  });
}

// Returns query of all columns from roles table
function viewAllRoles() {
  // FIXME: how do I omit the department ID columns, and rename the department column "department"?
  connection.query(
    "SELECT roles.id, roles.title, roles.salary, departments.name FROM roles INNER JOIN departments ON roles.department_id = departments.id ORDER BY roles.id;",
    (err, res) => {
      console.log("\n----Roles query complete----");
      if (err) {
        throw err;
      }
      console.table("\nRoles:", res);
      console.log("----------------------------------------------------");
      mainPrompt();
    }
  );
}

//Query employee table and join roles and departments for desired employee parameters shown
function viewAllEmployees() {
  const query = `SELECT 
  e1.id, e1.first_name, e1.last_name, r.title, d.name AS department, r.salary, CONCAT(e2.first_name, " ", e2.last_name) as manager 
     FROM 
       employees e1
     INNER JOIN roles r ON e1.role_id = r.id  
     INNER JOIN departments d ON r.department_id = d.id
     LEFT JOIN employees e2 ON e1.manager_id = e2.id;
     `;

  // log response to console
  connection.query(query, (err, res) => {
    console.log("\n--Employees query complete--");
    if (err) {
      throw err;
    }
    console.table("\nEmployees:", res);
    console.log("-----------------------------------");
    mainPrompt();
  });
}

// Prompt user for new department name and add to departments table
function addNewDepartment() {
  inquirer
    .prompt({
      name: "newDepartment",
      type: "input",
      message: "What is the name of the new Department?",
    })
    .then((data) => {
      const newDepartment = { name: data.newDepartment };
      connection.query("INSERT INTO departments SET ?", newDepartment, (err) => {
        if (err) {
          throw err;
        }
        console.log(`\n✨ The new department: "${newDepartment.name}" was created successfully!\n`);
        mainPrompt();
      });
    });
}

// Prompt user for new role details and add to roles table
async function addNewRole() {
  //this function will set the global "departmentsList" array variable = to list of department objects (name: name , value: id)
  await getDepartments();
  // console.log(departmentsList);

  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "What is the title of the new Role?",
      },
      { name: "roleSalary", type: "input", message: "What is the salary for the new Role?" },
      { name: "roleDepartment", type: "list", message: "In which Department is the new Role?", choices: departmentsList },
    ])
    .then(({ roleTitle, roleSalary, roleDepartment }) => {
      const newRole = { title: roleTitle, salary: roleSalary, department_id: roleDepartment };

      // console.log("addNewRole -> newRole", newRole);
      connection.query(
        "INSERT INTO roles (title,salary,department_id) VALUES (?, ?, ?)",
        [roleTitle, roleSalary, roleDepartment],
        (err) => {
          if (err) {
            throw err;
          }
          console.log(`\n The new role: "${newRole.title}" was created successfully!\n`);
          mainPrompt();
        }
      );
      // });
    });
}

//turning this into getEmployees for scoping

function getDepartments() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT departments.id, name FROM departments", (err, res) => {
      // if (err) {
      //   throw err;
      // }
      for (let i = 0; i < res.length; i++) {
        departmentsList.push({ name: res[i].name, value: res[i].id });
      }
      // console.log("departmentsList from GetDepartments()", departmentsList);
      resolve(departmentsList);
    });
  });
}

function getEmployeeNames() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS employees FROM employees", (err, res) => {
      // if (err) {
      //   throw err;
      // }
      // console.log(res);
      for (let i = 0; i < res.length; i++) {
        employeesList.push({ name: res[i].employees, value: res[i].id });
      }

      // console.log("employeesList from getEmployeeNames()", employeesList);
      resolve(employeesList);
    });
  });
}

function getRoles() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT roles.id, title FROM roles", (err, res) => {
      // if (err) {
      //   throw err;
      // }
      for (let i = 0; i < res.length; i++) {
        rolesList.push({ name: res[i].title, value: res[i].id });
      }
      // console.log("rolesList from GetRoles()", rolesList);
      resolve(rolesList);
    });
  });
}

async function addNewEmployee() {
  // let rolesList = await getRoles();
  await getRoles();
  await getEmployeeNames();

  // console.log("addNewEmployee -------------> getEmployeeNames", getEmployeeNames);
  // console.log("addNewEmployee ----------------> rolesList", rolesList);

  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is new Employee's FIRST name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is new Employee's LAST name?",
      },
      {
        name: "role",
        type: "list",
        message: "In which Role is the new employee?",
        choices: rolesList,
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the Manager of the new Employee?",
        choices: employeesList,
      },
    ])
    .then(({ firstName, lastName, role, manager }) => {
      connection.query(
        `INSERT INTO 
        employees (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, ?, ?)`,
        [firstName, lastName, role, manager],
        (err, res) => {
          if (err) throw err;
          console.log(`\nSuccessfully addeed new employee: ${firstName} ${lastName}`);
          mainPrompt();
        }
      );
    });
}

async function updateEmployeeRole() {
  await getRoles();
  await getEmployeeNames();

  inquirer
    .prompt([
      {
        name: "selectedEmployee",
        type: "list",
        message: "Which Employee's Role would you like to update?",
        choices: employeesList,
      },
      {
        name: "newRole",
        type: "list",
        message: "What is this Employee's new Role?",
        choices: rolesList,
      },
    ])
    .then(({ selectedEmployee, newRole }) => {
      connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [newRole, selectedEmployee], (err, res) => {
        if (err) throw err;
        console.log(`\nSuccessfully updated employee Role!\n`);
        mainPrompt();
      });
    });
}
///////////////////////////////////LIL HELPERS/////////////////////////////////

// function getManagers() {
//   const managementDeptName = "Management";
//   connection
//     .query("SELECT id FROM departments WHERE name = ?", managementDeptName, (err, res) => {
//       console.log(res);
//       // ,
//       // res, ()
//       //FIXME: why does un-commenting this make it hang up here?
//       // , (err) => {
//       //   if (err) {
//       //     throw err;
//       //   }
//       // }
//       // );
//     })
//     .then((res) => {
//       return connection.query("SELECT * FROM employees WHERE role_id=?", res);
//     });
// }

// const runQuery = async (query) => {
//   try {
//     const returnData = await connection.query(query, (err, res) => {
//       if (err) throw err;
//       // res.end();
//       return returnData;
//     });
//   } catch (err) {}
// };

//FIXME: won't work without async await
// function getListOfDepartments() {
//   connection.query("SELECT * FROM roles", (err, res) => {
//     if (err) {
//       throw err;
//     }
//     res.end;
//   });
// }
