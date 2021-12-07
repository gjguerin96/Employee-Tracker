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
                const sql = 'SELECT role.title, role.salary, department.name FROM role LEFT JOIN department ON department.id = role.department_id;'
                db.query(sql, function (err, results) {
                    console.table(results);
                    whatNext()
                  });
            }
            else if (answer.next === 'View all employees'){
                const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON  role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;'
                // const sql = 'SELECT * FROM employee'
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
                                
                    db.query('INSERT INTO department (name) SET ?',answer.newDept, function (err, results) {
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