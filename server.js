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

const empListHelper = []

const makeEmpList = () => {
    db.query('SELECT last_name FROM employee', function (err, results) {
        const lastNames = results.map(a => a.last_name)
        empListHelper.push(lastNames)
        // console.log(testArr[0])
    })
}
makeEmpList()
// const empList = empListHelper[0]

function whatNext() {
    inquirer
        .prompt([
            {
                type:'list',
                name: 'next',
                message: 'Choose an option.',
                choices: ['View all departments','View all roles','View all employees','Add a department','Add a role','Add an employee','Update an employee role', 'Exit']
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
                                
                    db.query('INSERT INTO department (name) VALUES (?)',(answer.newDept), function (err, results) {
                        // console.table(results);
                      });
                    console.log("Department added!")                        
                    whatNext()
                })
            }
            else if (answer.next === 'Add a role'){
                addRole()
            }

            else if (answer.next === 'Add an employee'){
                addEmp()
            }

            else  if (answer.next === 'Update an employee role'){
                updateRole()
            }

            else {
                console.log("Goodbye!")
                return;
            }
        });
}

function addRole(){
    db.query('SELECT name FROM department', function (err, results) {
        const deptList = results.map(a => a.name)

        inquirer.prompt([
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
            }
        ])

        .then((answers) => {
                const deptId = (deptList.indexOf(answers.roleDept)) + 1
                // console.log(answers.roleName,answers.roleSalary,deptId)
                db.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)', [answers.roleName, answers.roleSalary, deptId], function (err, results) {
                    // console.table(results);
                }); 
                console.log("Role added!")                        
                whatNext()                       
                
            })
    })  
}


function addEmp(){
    db.query('SELECT title FROM role', function (err, results) {
        const roleList = results.map(a => a.title)
        const empList = empListHelper[0]

        
        inquirer.prompt([
            {
                type:'input',
                name: 'firstName',
                message: 'Enter employee first name.'
            },
            {
                type:'input',
                name: 'lastName',
                message: 'Enter employee last name.'
            },
            {
                type:'list',
                name: 'empRole',
                message: 'Select employee role.',
                choices: roleList
            },
            {
                type:'list',
                name: 'empMang',
                message: 'Select employee manager.',
                choices: empList
            }
        ])

        .then((answers) => {
                const roleId = (roleList.indexOf(answers.empRole)) + 1
                const mangId = (empList.indexOf(answers.empMang)) + 1

                db.query('INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)',[answers.firstName,answers.lastName,roleId,mangId], function (err, results) {
                    // console.table(results);
                  });
                console.log("Employee added!")                        
                whatNext()
            })
    })  
}

function updateRole() {
    db.query('SELECT title FROM role', function (err, results) {
        const roleList = results.map(a => a.title)
        const empList = empListHelper[0]

        inquirer.prompt([
            {
                type:'list',
                name: 'lastName',
                message: 'Select an employee.',
                choices: empList
            },
            {
                type:'list',
                name: 'empRole',
                message: 'Select their new role.',
                choices: roleList
            }
        ])
        .then((answers) => {
            const roleId = (roleList.indexOf(answers.empRole)) + 1

            db.query('UPDATE employee SET role_id = ? WHERE last_name = ?', [roleId,answers.lastName], function (err, results) {
                console.table(results);
              });
            console.log("Role updated!")                        
            whatNext()
        })
    })    
}

whatNext()