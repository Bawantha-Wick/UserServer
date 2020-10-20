const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    max: 50
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6
  },
  address: {
    type: String,
    required: true,
    max: 255
  }
});

module.exports = mongoose.model("users", userSchema);
