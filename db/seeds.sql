INSERT INTO department (id,name)
VALUES (1, "Accounting");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Accountant", 10000, 1);

INSERT INTO employee (id,first_name,last_name,role_id,manager_id)
VALUES (1, "Derek", "Payne", 1, 1);