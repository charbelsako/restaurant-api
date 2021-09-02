const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// Load User Model
const User = require("../../models/User");

const isAuthenticated = require("../../middleware/auth");

// Load Validation
const validateUpdateProfileInput = require("../../validation/updateProfile");
const validateProfileInput = require("../../validation/register");
const isEmpty = require("../../validation/is-empty");

/* @route  /api/profile/test
   @method GET
   @desc   test profile route
   @access Public
*/
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

/*
  @route  /api/profile
  @method GET
  @desc   get current user's profile
  @access Private
*/
router.get("/", isAuthenticated, (req, res) => {
  const errors = {};

  User.findOne({ email: req.body.email })
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

/*
  @route  /api/profile
  @method POST
  @desc   Edit user profile
  @access Private
*/
router.post("/", isAuthenticated, async (req, res) => {
  // Get errors
  const { errors, isValid } = validateUpdateProfileInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const name = !isEmpty(req.body.name) ? req.body.name : req.user.name;
    const isPasswordEmpty = isEmpty(req.body.password);
    let password = req.body.password;
    if (!isPasswordEmpty) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      password = hash;
    } else {
      password = req.user.password;
    }
    // Update
    User.findOneAndUpdate(
      { _id: req.user.id },
      {
        name: name,
        password: password,
      }
    ).then(profile => res.json(profile));
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

module.exports = router;
