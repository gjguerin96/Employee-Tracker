const mysql = require('mysql2');
const inquirer = require('inquirer');
// const console = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '1234',
      database: 'employees_db'
    }
);
const myFunction = () => {
    db.query('SELECT name FROM department', function (err, results) {
        function getValues(item) {
            return item.name
        }
        
        return(results.map(getValues))
    })
}

const deptList = ["Accounting","Sales","Legal","Research"];
const roleList = ["Accountant","Sales Representative","Quality Assurance","Head Lawyer","Paralegal","Research Manager"]
const roleQuestions = [
    {
        type:'input',
        name: 'roleName',
        message: 'Enter role name.'
    },
    {
        type:'input',
        name: 'roleSalary',
        message: 'Enter role salary.'
    },
    {
        type:'list',
        name: 'roleDept',
        message: 'Select role department.',
        choices: deptList
    },
]


function whatNext() {
    inquirer
        .prompt([
            {
                type:'list',
                name: 'next',
                message: 'Choose an option.',
                choices: ['View all departments','View all roles','View all employees','Add a department','Add a role','Add an employee','Update an employee role']
            }  
        ])
        .then((answer) => {
            if (answer.next === 'View all departments'){
                db.query('SELECT * FROM department', function (err, results) {
                    console.table(results);
                    whatNext()
                  });
                
            }
            else if (answer.next === 'View all roles'){
                db.query('SELECT * FROM role', function (err, results) {
                    console.table(results);
                    whatNext()
                  });
            }
            else if (answer.next === 'View all employees'){
                // const sql = 'SELECT id, manager_id FROM employee t1 INNER JOIN employee t2 ON t1.id = t2.manager_id;'
                const sql = 'SELECT * FROM employee'
                db.query(sql, function (err, results) {
                    console.table(results);
                    whatNext()
                  });
            }
            else if (answer.next === 'Add a department'){
                inquirer.prompt([
                    {
                        type:'input',
                        name: 'newDept',
                        message: 'Enter new department.',
                    }  
                ])
                .then((answer) => {
                    deptList.push(answer.newDept)
                    // console.log(deptList)
                    // const sql2 = 'INSERT INTO department (name) VALUES (answer.newDept)'; 
                                
                    db.query('INSERT INTO department (name) VALUES (?)',(answer.newDept), function (err, results) {
                        // console.table(results);
                      });                        
                    whatNext()
                })
            }
            else if (answer.next === 'Add a role'){
                inquirer.prompt([
                    roleQuestions[0],
                    roleQuestions[1],
                    roleQuestions[2]
                ])
                .then((answers) => {
                    roleList.push(answer.roleDept)
                    db.query('INSERT INTO role (title,salary) VALUES (?)(?)(?)',(answers.roleName,answers.roleSalary,answers.roleDept), function (err, results) {
                        // console.table(results);
                      });                        
                    whatNext()
                })
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