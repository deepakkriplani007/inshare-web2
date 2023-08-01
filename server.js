const express = require("express");
dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));
dotenv.config();
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to Mongodb");
  } catch (err) {
    console.log("mongoose connnection failed", err);
  }
};

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use("/api/files", require("./routes/files"));

app.use("/files", require("./routes/show"));

app.use("/files/download", require("./routes/download"));

app.listen(3000, () => {
  connect();
  // logger.info("logging");
  console.log("connected to backend");
});
