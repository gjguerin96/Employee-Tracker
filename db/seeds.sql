INSERT INTO department (name)
VALUES  ("Accounting"),
        ("Sales"),
        ("Legal"),
        ("Research");

INSERT INTO role (title, salary, department_id)
VALUES  ("Accountant", 60000, 1),
        ("Quality Asssurance", 40000, 2),
        ("Paralegal", 70000, 3),
        ("Research Manager", 50000, 4),
        ("Sales Representative", 60000, 2),
        ("Head Lawyer", 90000, 3);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES  ("Derek", "Payne", 1, NULL),
        ("Gian", "Rosas", 2, 6),
        ("Joan", "Smith", 3, NULL),
        ("David", "Dias", 1, 1),
        ("Riley", "Peters", 4, 5),
        ("Dennis", "Huls", 5, NULL);