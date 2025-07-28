const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3000;

//Middleaware
app.use(express.json());

//send request
app.get("/", (req, res) => {
  res.send("Hello World");
});

//connect to database
mongoose
  .connect("mongodb://localhost:27017/login", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.post("/signin", (req, res) => {
  const newUser = new User({
    userName: req.body.userName,
    password: req.body.password,
  });
  newUser
    .save()
    .then(() => {
      res.status(201).send("new user created");
    })
    .catch((err) => {
      res.status(400).send("Error creating user: " + err.message);
    });
});

app.get("/signin", (req, res) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((err) =>
      res.status(500).send("Error fetching users: " + err.message)
    );
});

app.delete("/signin/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).send("User deleted"))
    .catch((err) =>
      res.status(500).send("Error deleting users: " + err.message)
    );
});

app.put("/signin/:id", (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      userName: req.body.userName,
    },
    { new: true }
  )
    .then((updatedUser) => res.json({ updatedUser }))
    .catch((err) =>
      res.status(500).send("Error updating users: " + err.message)
    );
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
