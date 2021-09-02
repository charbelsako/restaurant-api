const User = require("../models/User");
// const bcrypt = require("bcryptjs");
const config = require("../config/keys");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  // extract token from request
  const token = req.header("authorization");
  if (!token) {
    // return error
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], config.secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      res.send({ message: "Invalid Token" }).status(401);
    }
    req.user = user;

    next();
  } catch (err) {
    return res.json({ message: "Invalid Token" }).status(401);
  }
};
