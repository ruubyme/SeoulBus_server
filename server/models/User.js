const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
