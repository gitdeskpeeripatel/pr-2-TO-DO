const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 5055;

let employees = []; // store employee data in-memory
let tasks = []; // store task data in-memory

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

// Add employee
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
  res.redirect("/employee");
});

// Edit employee
app.post("/edit-employee", (req, res) => {
  const updated = req.body;
  const index = employees.findIndex(emp => emp.id === updated.id);

  if (index !== -1) {
    employees[index] = {
      ...employees[index],
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      department: updated.department,
      balance: updated.balance,
      level: updated.level
    };
  }
  res.redirect("/employee");
});

// Delete employee
app.delete("/delete/:id", (req, res) => {
  const empId = req.params.id;
  employees = employees.filter(emp => emp.id !== empId);
  res.json({ success: true });
});

// Task Management
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
  res.redirect("/taskManagement");
});

app.listen(port, () => {
  console.log("Server STARTED successfully");
  console.log(`Server running at http://localhost:`+port);
});