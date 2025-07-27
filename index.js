const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 5055;

let employees = []; // store employee data in-memory
let tasks = [];     // store task data in-memory

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.render("index", { employees, tasks });
});

app.get("/employee", (req, res) => {
  res.render("pages/employee", { employees });
});


app.post("/add-employee", (req, res) => {
  const { id, name, email, phone, role, department, balance, level } = req.body;

  const newEmployee = {
    id,
    name,
    email,
    phone,
    role,
    department,
    balance,
    level,
    created: new Date().toLocaleDateString()
  };

  employees.push(newEmployee);


  console.log("[ADD] New Employee:");
  console.log(JSON.stringify(newEmployee, null, 2));
  console.log("------------------------------");

  res.redirect("/employee");
});


app.post("/edit-employee", (req, res) => {
  const updated = req.body;
  const index = employees.findIndex(emp => emp.id === updated.id);

  if (index !== -1) {
    const oldData = employees[index];
    const newData = {
      ...oldData,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      department: updated.department,
      balance: updated.balance,
      level: updated.level
    };

    employees[index] = newData;


    console.log(`[EDIT] Employee ID: ${updated.id}`);
    console.log("Before:", JSON.stringify(oldData, null, 2));
    console.log("After :", JSON.stringify(newData, null, 2));
    console.log("------------------------------");
  }

  res.redirect("/employee");
});


app.delete("/delete/:id", (req, res) => {
  const empId = req.params.id;
  const employee = employees.find(emp => emp.id === empId);

  if (employee) {
    employees = employees.filter(emp => emp.id !== empId);

    console.log(`[DELETE] Employee ID: ${empId}`);
    console.log(JSON.stringify(employee, null, 2));
    console.log("------------------------------");

    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "Employee not found" });
  }
});

app.get("/taskManagement", (req, res) => {
  res.render("pages/taskManagement", { tasks });
});

app.post("/assign-task", (req, res) => {
  const { employeeId, subject, project, deadline, priority } = req.body;
  const employee = employees.find(emp => emp.id.toString() === employeeId.toString());

  const task = {
    id: Date.now().toString(),
    employeeId,
    employeeName: employee?.name || "Unknown",
    subject,
    project,
    deadline,
    priority,
    assignedAt: new Date().toLocaleDateString()
  };

  tasks.push(task);

  console.log(`[TASK ASSIGNED] To: ${task.employeeName} (${employeeId})`);
  console.log(JSON.stringify(task, null, 2));
  console.log("------------------------------");

  res.redirect("/taskManagement");
});

app.listen(port, () => {
  console.log("Server STARTED successfully");
  console.log(`Server running at http://localhost:` + port);
});
