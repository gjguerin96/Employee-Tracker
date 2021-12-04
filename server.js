const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: '1234',
      database: 'employees_db'
    }
);

function whatNext() {
    inquirer
        .prompt([
            {
                type:'list',
                name: 'next',
                message: 'What do you want to do next?',
                choices: ['View all departments','View all roles','View all employees','Add a department','Add a role','Add an employee','Update an employee role']
            }  
        ])
        .then((answer) => {
            if (answer.next === 'View all departments'){
                return
            }
            else if (answer.next === 'View all roles'){
                return
            }
            else if (answer.next === 'View all employees'){
                return
            }
            else if (answer.next === 'Add a department'){
                return
            }
            else if (answer.next === 'Add a role'){
                return
            }
            else if (answer.next === 'Add an employee'){
                return
            }
            else {
                return
            }
        });
}

whatNext()