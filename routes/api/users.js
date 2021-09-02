const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../../middleware/auth");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateAddressInput = require("../../validation/address");

// Load User model
const User = require("../../models/User");
const Address = require("../../models/Address");
const Order = require("../../models/Order");
// const Location = require("../../models/Location");
const { findLocation, getNearestRestaurant } = require("./utils");
const Distance = require("geo-distance");

// Config
const { secret } = require("../../config/keys");
const isEmpty = require("../../validation/is-empty");

/*
  @route  /api/users/test
  @method GET
  @desc   Test users route
  @access Public
*/
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

/*
  @route  /api/users/register
  @method POST
  @desc   Register a user
  @access Public
*/
router.post("/register", (req, res) => {
  // Get errors
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Check if the email exists
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        //Gimme dat salt
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

/*
  @route  /api/users/login
  @method POST
  @desc   Login user / Returning `JWT` token
  @access Public
*/
router.post("/login", (req, res) => {
  // Get errors
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email })
    .then(user => {
      // Check for user
      if (!user) {
        // user doesn't exist
        errors.password = "Invalid Credentials";
        return res.status(404).json(errors);
      }

      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Logged In Successfully
          // Create JWT payload
          const payload = {
            id: user.id,
            name: user.name,
            type: user.type,
          };
          // Sign token
          jwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
            res.json({ success: true, token: `Bearer ${token}` });
          });
        } else {
          errors.password = "Invalid Credentials";
          return res.status(400).json(errors);
        }
      });
    })
    .catch(err => res.send(err.message));
});

/*
  @route  /api/users/current
  @method GET
  @desc   Return current user
  @access Private
*/
router.get("/current", isAuthenticated, (req, res) => {
  console.log(req.user);
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
});

/*
  @route  /api/users/refresh
  @method POST
  @desc   Refresh the users' token
  @access Public
*/
// router.post("/refresh", async (req, res) => {
//   // the payload is the currently logged in user.
//   try {
//     const payload = await axios.post("/api/users/current");
//     jwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
//       res.json({ success: true, token: `Bearer ${token}` });
//     });
//   } catch (e) {
//     res.json(e);
//   }
// });

/*
  @route  /api/users/menu
  @method GET
  @desc   Show the menu
  @access Public
*/
router.get("/menu", async (req, res) => {
  try {
    let limit = 10;
    if (!isEmpty(req.query.limit)) {
      limit = req.query.limit;
    }
    let page = 0;
    if (!isEmpty(req.query.page)) {
      page = req.query.page;
    }
    if (!isEmpty(req.query.search)) {
      const menuItems = await MenuItem.find({ name: req.query.search })
        .populate("category", "name")
        .limit(limit)
        .skip(limit * page);
      return res.json(menuItems).status(200);
    }
    const menuItems = await MenuItem.find()
      .populate("category", "name")
      .limit(limit);
    return res.json(menuItems).status(200);
  } catch (e) {
    res.json({ error: e.message }).status(500);
  }
});

/*
  @route  /api/users/menu/:category
  @method GET
  @desc   Filter the menu based on a category
  @access Public
*/
router.get("/menu/:category", async (req, res) => {
  try {
    //
    const categoryName = req.params.category;
    const category = await Category.findOne({ name: categoryName });

    const id = category.id;
    const menuItems = await MenuItem.find({ category: category.id }).populate(
      "category",
      ["name"]
    );
    console.log(menuItems);
    return res.json(menuItems).status(200);
  } catch (e) {
    res.json(e.message);
  }
});

/*
  @route  /api/users/address/
  @method GET
  @desc   Get all addresses
  @access Private
*/
router.get("/address/", isAuthenticated, async (req, res) => {
  try {
    const addressList = await Address.find({ user: req.user.id }).populate(
      "location",
      ["lat", "lon"]
    );
    return res.json(addressList).status(200);
  } catch (e) {
    res.json(e.message);
  }
});

/*
  @route  /api/users/address/
  @method POST
  @desc   Create an address
  @access Private
*/
router.post("/address/", isAuthenticated, async (req, res) => {
  try {
    // TODO: missing validation
    const { errors, isValid } = validateAddressInput(req.body);

    if (!isValid) {
      return res.json({ errors }).status(400);
    }

    const lat = req.body.lat;
    const lon = req.body.lon;

    let location = await findLocation(lat, lon);

    const address = new Address({
      user: req.user.id,
      location: location.id,
    });

    await address.save();

    return res.json(address).status(200);
  } catch (e) {
    res.send(e.message).status(500);
  }
});

/*
  @route  /api/users/address/
  @method PUT
  @desc   UPDATE an address
  @access Private
*/
router.put("/address/:id", isAuthenticated, async (req, res) => {
  try {
    const { errors, isValid } = validateAddressInput(req.body);

    if (!isValid) {
      return res.json({ errors }).status(400);
    }

    const addressId = req.params.id;
    const lat = parseFloat(req.body.lat);
    const lon = parseFloat(req.body.lon);

    let location = await findLocation(lat, lon);

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
      },
      { location: location.id }
    );

    return res.json(address).status(200);
  } catch (e) {
    res.send(e.message).status(500);
  }
});

/*
  @route  /api/users/address/:id
  @method DELETE
  @desc   Delete an address
  @access Private
*/
router.delete("/address/:id", isAuthenticated, async (req, res) => {
  try {
    const id = req.params.id;
    const addressList = await Address.findOneAndDelete({ id: id });
    return res.json(addressList).status(200);
  } catch (e) {
    res.json(e.message);
  }
});

/*
  @route  /api/users/order/
  @method GET
  @desc   List orders
  @access Private
*/
router.get("/order", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items", ["name", "price"])
      .populate("address", ["location"])
      .populate("location", ["lat", "lon"]);
    return res.json(orders).status(200);
  } catch (e) {
    res.json(e.message);
  }
});

/*
  @route  /api/users/order/
  @method POST
  @desc   Create Order
  @access Private
*/
router.post("/order", isAuthenticated, async (req, res) => {
  try {
    // TODO: add validation
    console.log(req.body);
    const menuItemsIds = req.body.items.split(",");
    const addressId = req.body.address;
    const address = await Address.find({ id: addressId });
    const currentLocation = { lat: address.lat, lon: address.lon };

    let chosenBranch = getNearestRestaurant(currentLocation);

    if (chosenBranch == null) {
      res.json({ message: "you're not near any branch" });
    }

    const order = new Order({
      branch: chosenBranch.id,
      items: [...menuItemsIds],
      address: addressId,
    });

    await order.save();

    return res.json(order).status(200);
  } catch (e) {
    res.json(e.message);
  }
});

/*
  @route  /api/users/order/
  @method POST
  @desc   Create Order
  @access Private
*/
router.post("/order", isAuthenticated, async (req, res) => {});

module.exports = router;
