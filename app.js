const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./models/userModel");
const clientModel = require("./models/clientModel");
const imageModel = require("./models/imageModel");
const studentModel = require("./models/studentModel");
const userRouter = require("./router/userRouter");
const clientRouter = require("./router/clientRouter");
const multerRouter = require("./router/multerRouter");
const studentRouter = require("./router/studentRouter");
const bodyParser = require("body-parser");
const generateStudentCsv = require("./functions/generateStudentCsv");

const app = express();

app.use(bodyParser.json());
app.use("/user", userRouter);
app.use("/client", clientRouter);
app.use("/multer", multerRouter);
app.use("/student", studentRouter);

const port = 3500;

mongoose.connect("mongodb://localhost/Jwt");

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", async () => {
  console.log("Connected to MongoDB");
  await generateStudentCsv();
  mongoose.connection.close();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
