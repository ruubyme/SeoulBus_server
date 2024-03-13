const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const connectionString = process.env.ATLAS_URI;

const connectDatabase = async () => {
  try {
    mongoose.connect(connectionString);
    console.log("db connected");
  } catch (error) {
    console.error("db connect failed", error);
  }
};

const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log("Connection to the database closed");
  } catch (error) {
    console.error("Error closing the database", error);
  }
};

module.exports = { connectDatabase, closeDatabase };
