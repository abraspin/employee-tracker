// Import our dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const util = require("util");

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
  welcomeLogger();
  mainPrompt();
});

// welcomeLogger();
// mainPrompt();

function welcomeLogger() {
  console.log(`
    +-----------------------------------------------------+
    |    ______                 _                         |
    |   |  ____|               | |                        | 
    |   | |__   _ __ ___  _ __ | | ___  _   _  ___  ___   |
    |   |  __| | '_  _  \| '_ \| |/ _ \| | | |/ _ \/ _ \  |
    |   | |____| | | | | | |_) | | (_) | |_| |  __/  __/  |
    |   |______|_|_|_|_|_| .__/|_|\___/ \__, |\___|\___|  |
    |          |__   __| | |       | |   __/ |            |
    |             | |_ __|_|__  ___| | _|___/_ __         | 
    |             | | '__/ _  |/ __| |/ / _ \ '__|        |
    |             | | | | (_| | (__|   <  __/ |           |
    |             |_|_|  \__,_|\___|_|\_\___|_|           |
    |                                                     |
    +-----------------------------------------------------+                                            
`);
}
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
        //TODO: Optional
        // "View All Employees by Department",
        // "Remove Employee",
        // "Update Employee Manager",
        // "View All Employees by Manager",
        "Exit",
      ],
    })
    .then(onMainPromptAnswer);
}

//TODO:
// tariq's example
// const pQuery = util.promisify(connection.connect).bin(connection);
// const data = await pQuery("SELECT *{ FROM  movies");

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

function viewAllDepartments() {
  connection.query("SELECT * FROM departments", (err, res) => {
    console.log("\n--Departments query complete--");
    if (err) {
      throw err;
    }
    console.table("\nDepartments:", res);
    console.log("-----------------------------------");
    mainPrompt();
  });
}

function viewAllRoles() {
  connection.query("SELECT * FROM roles", (err, res) => {
    console.log("\n--Roles query complete--");
    if (err) {
      throw err;
    }
    console.table("\nRoles:", res);
    console.log("-----------------------------------");
    mainPrompt();
  });
}

//TODO: need some joins in here for names instead of ID's for role and dept.
function viewAllEmployees() {
  const query = `SELECT 
  e.first_name, e.last_name, r.title, d.name AS department, r.salary
FROM 
  employees e
INNER JOIN roles r ON e.role_id = r.id 
INNER JOIN departments d ON r.department_id = d.id;`;

  // -- LEFT JOIN employees e1 ON e.manager_id = e1.id;
  // -- ,CONCAT(e1.first_name, " ", e1.last_name) as manager

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

function addNewDepartment() {
  inquirer
    .prompt({
      name: "newDepartment",
      type: "input",
      //FIXME: Why does this prompt show up twice until you start typing?
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

//TODO: add try/catch ? at the end?? .catch(err)?
function addNewRole() {
  getDepartments().then((data) => {
    inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "What is the title of the new Role?",
        },
        { name: "roleSalary", type: "input", message: "What is the salary for the new Role?" },
        { name: "roleDepartment", type: "list", message: "In which Department is the new Role?", choices: data },
      ])
      .then(({ roleTitle, roleSalary, roleDepartment }) => {
        connection.query("SELECT id FROM departments WHERE name = ?", roleDepartment, (err, res) => {
          const newRole = { title: roleTitle, salary: roleSalary, department_id: res[0].id };
          connection.query("INSERT INTO roles SET ?", newRole, (err) => {
            if (err) {
              throw err;
            }
            console.log(`\n✨ The new role: "${newRole.title}" was created successfully!\n`);
            mainPrompt();
          });
        });
      });
  });
}

function addNewEmployee() {
  let rolesList = [];
  let employeesList = [];

  getRoles()
    .then((rolesList) => {
      rolesList = rolesList;
    })
    .then(
      (data) =>
        (employeesList = connection.query("SELECT first_name, last_name FROM employees", (err) => {
          if (err) throw err;

          console.log("--------------->" + rolesList);
          console.log("--------------->" + employeesList);
        }))
    )
    .then((data) => {});
  return;
  connection
    .query("SELECT first_name, last_name FROM employees", (err) => {
      if (err) throw err;
    })
    .then((data) => {
      inquirer.prompt([
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
          name: "firstName",
          type: "list",
          message: "In which Department is the new Role?",
          choices: data,
        },
      ]);
    });
}

//TODO: "SELECT id, CONCAT(e.first_name, ' ', e.last_name) as name FROM employee_tracker.employee e";

function updateEmployeeRole() {
  connection.query("SELECT id, CONCAT(first_name, ' ', last_name) as employee FROM employee", (err, allEmployees) => {
    console.log("updateEmployeeRole ---------------> allEmployees", allEmployees);
    if (err) throw err;
    connection.query("SELECT id, title, salary, department_id FROM roles", (err, allRoles) => {
      console.log("updateEmployeeRole -------------> allRoles", allRoles);
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "employeeName",
            type: "list",
            message: "Which Employee's Role would you like to update?",
            choices: allEmployees,
          },
          {
            name: "newRole",
            type: "list",
            message: "What is this Employee's new Role?",
            choices: allRoles,
          },
        ])
        .then(({ employeeName, newRole }) => {
          let employee = allEmployee.find((employeeEl) => employeeEl.name === employeeName);
          let role = allRole.find((employeeEl) => employeeEl.name === newRole);
          connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [role.id, employee.id], (err, res) => {
            if (err) throw err;
            console.log(`\nSuccessfully Updated ${employeeName} Role To ${newRole}\n`);
            mainPrompt();
          });
        });
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

function getDepartments() {
  return connection.query(
    "SELECT * FROM departments"
    //FIXME: why does un-commenting this make it hang up here?
    // , (err) => {
    //   if (err) {
    //     throw err;
    //   }
    // }
  );
}

function getRoles() {
  return connection.query(
    "SELECT * FROM roles"
    //FIXME: why does un-commenting this make it hang up here?
    // , (err) => {
    //   if (err) {
    //     throw err;
    //   }
    // }
  );
}

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
