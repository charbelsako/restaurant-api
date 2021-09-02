const mongoose = require("mongoose");
const { Schema } = mongoose;

//Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "user",
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
