require("dotenv").config();
const mongoose = require("mongoose");

function connectDB() {
  const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_CONNECTION_URL);
      console.log("connected to Mongodb");
    } catch (err) {
      console.log("mongoose connnection failed", err);
    }
  };
  connect();
}
module.exports = connectDB;
