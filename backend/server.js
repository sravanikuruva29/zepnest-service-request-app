const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const USERS_FILE = "./users.json";
const REQUESTS_FILE = "./requests.json";

// Home Route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// Register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  let users = JSON.parse(fs.readFileSync(USERS_FILE)).users;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  users.push({
    id: Date.now(),
    name,
    email,
    password,
  });

  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify({ users }, null, 2)
  );

  res.json({
    message: "Registered successfully",
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  let users = JSON.parse(fs.readFileSync(USERS_FILE)).users;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  res.json({
    message: "Login successful",
    user,
  });
});

// Get all requests
app.get("/requests", (req, res) => {
  let requests = JSON.parse(
    fs.readFileSync(REQUESTS_FILE)
  ).requests;

  res.json(requests);
});

// Create request
app.post("/requests", (req, res) => {
  let requests = JSON.parse(
    fs.readFileSync(REQUESTS_FILE)
  ).requests;

  const newRequest = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    address: req.body.address,
    preferredTime: req.body.preferredTime,
    status: "Pending",
  };

  requests.push(newRequest);

  fs.writeFileSync(
    REQUESTS_FILE,
    JSON.stringify({ requests }, null, 2)
  );

  res.json(newRequest);
});

// Update request status
app.put("/requests/:id", (req, res) => {
  let requests = JSON.parse(
    fs.readFileSync(REQUESTS_FILE)
  ).requests;

  requests = requests.map((r) =>
    r.id == req.params.id
      ? { ...r, status: req.body.status }
      : r
  );

  fs.writeFileSync(
    REQUESTS_FILE,
    JSON.stringify({ requests }, null, 2)
  );

  res.json({
    message: "Updated successfully",
  });
});

// Delete request
app.delete("/requests/:id", (req, res) => {
  let requests = JSON.parse(
    fs.readFileSync(REQUESTS_FILE)
  ).requests;

  requests = requests.filter(
    (r) => r.id != req.params.id
  );

  fs.writeFileSync(
    REQUESTS_FILE,
    JSON.stringify({ requests }, null, 2)
  );

  res.json({
    message: "Deleted successfully",
  });
});

// Start Server
app.listen(5000, () => {
  console.log("Server Running");
});