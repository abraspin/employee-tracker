// Import our dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Create/configure our MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "pV2XnNfDhy3jTWEe",
  database: "employees_db",
});

// Connect to the MySQL server, and call `mainPrompt()` when connected
connection.connect((err) => {
  if (err) {
    throw err;
  }
  welcomeLogger();
  mainPrompt();
});

welcomeLogger();
mainPrompt();

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

function onMainPromptAnswer({ action }) {
  switch (action) {
    case "View All Departments":
      viewAllDepartments();
      break;
    case "View All Roles":
      viewAllRoles();
      break;
    case "View All Employees":
      // rangeSearch();
      break;
    case "Add New Department":
      // songSearch();
      break;
    case "Add New Role":
      // songAndAlbumSearch();
      break;
    case "Add New Employee":
      // songAndAlbumSearch();
      break;
    case "Update Employee Role":
      // songAndAlbumSearch();
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
// function artistSearch() {
//   inquirer
//     .prompt({
//       name: "artist",
//       type: "input",
//       message: "What artist would you like to search for?",
//     })
//     .then(({ artist }) => {
//       const query = "SELECT position, song, year FROM top5000 WHERE ?";
//       connection.query(query, { artist }, (err, res) => {
//         if (err) {
//           throw err;
//         }
//         for (let i = 0; i < res.length; i++) {
//           console.log(`Position: ${res[i].position} || Song: ${res[i].song} || Year: ${res[i].year}`);
//         }
//         mainPrompt();
//       });
//     });
// }

// function multiSearch() {
//   const query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
//   connection.query(query, (err, res) => {
//     if (err) {
//       throw err;
//     }
//     for (let i = 0; i < res.length; i++) {
//       console.log(res[i].artist);
//     }
//     mainPrompt();
//   });
// }

// function rangeSearch() {
//   inquirer
//     .prompt([
//       {
//         name: "start",
//         type: "input",
//         message: "Enter starting position: ",
//         validate: (value) => isNaN(value) === false,
//       },
//       {
//         name: "end",
//         type: "input",
//         message: "Enter ending position: ",
//         validate: (value) => isNaN(value) === false,
//       },
//     ])
//     .then(({ start, end }) => {
//       const query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
//       connection.query(query, [start, end], (err, res) => {
//         if (err) {
//           throw err;
//         }
//         for (let i = 0; i < res.length; i++) {
//           const song = res[i];
//           console.log(`Position: ${song.position} || Song: ${song.song} || Artist:  ${song.artist} || Year: ${song.year}`);
//         }
//         mainPrompt();
//       });
//     });
// }

// function songSearch() {
//   inquirer
//     .prompt({
//       name: "title",
//       type: "input",
//       message: "What song would you like to look for?",
//     })
//     .then(({ title }) => {
//       connection.query("SELECT * FROM top5000 WHERE ?", { song: title }, (err, res) => {
//         if (err) {
//           throw err;
//         }
//         const result = res[0];
//         console.log(`Position: ${result.position} || Song: ${result.song} || Artist:  ${result.artist} || Year: ${result.year}`);
//         mainPrompt();
//       });
//     });
// }

// function songAndAlbumSearch() {
//   inquirer
//     .prompt({
//       name: "artist",
//       type: "input",
//       message: "What artist would you like to search for?",
//     })
//     .then(({ artist }) => {
//       // Big query! Use a template literal split over multiple lines to make it easier to read
//       const query = `
// SELECT
//   top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist
// FROM
//   top_albums
// INNER JOIN
//   top5000 ON (top_albums.artist = top5000.artist AND top_albums.year = top5000.year)
// WHERE
//   (top_albums.artist = ? AND top5000.artist = ?)
// ORDER BY
//   top_albums.year, top_albums.position
//       `;
//       // You could use good-old standard string concatenation, ie:
//       // let query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
//       // query += "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
//       // query += "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";

//       connection.query(query, [artist, artist], (err, res) => {
//         if (err) {
//           throw err;
//         }
//         console.log(`${res.length} matches found!`);
//         for (let i = 0; i < res.length; i++) {
//           const result = res[i];
//           console.log(
//             `${i + 1}) Year: ${result.year} || Album Position: ${result.position} || Artist:  ${result.artist} || Song: ${
//               result.song
//             } || Album: ${result.album}`
//           );
//         }
//         mainPrompt();
//       });
//     });
// }
