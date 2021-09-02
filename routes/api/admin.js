const router = require("express").Router();

const path = require("path");

const { isAdmin } = require("../../middleware/middleware");
const isAuthenticated = require("../../middleware/auth");

const User = require("../../models/User");
const Category = require("../../models/Category");
const MenuItem = require("../../models/MenuItem");
const Branch = require("../../models/Branch");

const validateCategoryInput = require("../../validation/category");
const validateMenuItemInput = require("../../validation/menuItem");
const validateBranchInput = require("../../validation/branch");
const isEmpty = require("../../validation/is-empty");

const findLocation = require("./utils");

const multer = require("multer");
const uploads = multer({ dest: "uploads/" });

/*
  @route /api/admin/users
  @method GET
  @desc return all users in the database
  @access private (admin)
*/
router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: "couldn't get users" });
  }
});

/*
  @route /api/admin/users/:email
  @method POST
  @desc Enable/Disable a user from the database
  @access private (admin)
*/
router.post("/users/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    console.log(user);
    console.log(typeof user.enabled);
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { enabled: !user.enabled },
      { new: true }
    );

    res.json(updatedUser).status(200);
  } catch (e) {
    res.status(500).json({ error: "couldn't disable user" });
  }
});

/*
  @route /api/admin/category/
  @method POST
  @desc adds a category to the database
  @access private (admin)
*/
router.post("/category/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { errors, isValid } = validateCategoryInput(req.body);

    if (!isValid) {
      return res.json({ errors });
    }

    const categoryName = req.body.name;
    const category = new Category({ name: categoryName });
    const data = await category.save();
    res.json(data).status(200);
  } catch (e) {
    res.status(200).json({ error: "couldn't add category" });
  }
});

/*
  @route /api/admin/category/:name
  @method PUT
  @desc updates a category to the database
  @access private (admin)
*/
router.put("/category/:name", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { errors, isValid } = validateCategoryInput(req.body);

    if (!isValid) {
      return res.json({ errors }).status(400);
    }

    const cat = await Category.findOne({ name: req.params.name });
    if (cat) {
      await Category.findOneAndUpdate(
        { name: req.params.name },
        { name: req.body.name }
      );
      return res.json({ success: true }).status(200);
    }

    return res.json({ message: "no match found" }).status(200);
  } catch (e) {
    res.status(200).json({ error: "couldn't update category" });
  }
});

/*
  @route /api/admin/category/:name
  @method DELETE
  @desc deletes a category to the database
  @access private (admin)
*/
router.delete("/category/:name", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const cat = await Category.findOne({ name: req.params.name });
    if (cat) {
      await Category.findOneAndDelete({ name: req.params.name });
      return res.json({ success: true }).status(200);
    }
    return res.json({ message: "no match found" }).status(200);
  } catch (e) {
    res.status(200).json({ error: "couldn't delete category" });
  }
});

/*
  @route /api/admin/menuitem/
  @method POST
  @desc adds a menu item to the database
  @access private (admin)
*/
router.post("/menuitem/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { errors, isValid } = validateMenuItemInput(req.body);

    let categorySearch;
    // check if category exists
    if (!isEmpty(req.body.category)) {
      categorySearch = await Category.findOne({ name: req.body.category });
      if (!categorySearch) {
        isValid = false;
        errors.category = "Category isn't in database";
      }
    } else {
      errors.category = "Category field is empty";
    }

    let foundName = await MenuItem.findOne({ name: req.body.name });
    if (foundName) {
      errors.name = "already exists";
    }

    if (!isValid || !isEmpty(errors)) {
      return res.json({ errors }).status(400);
    }

    const name = req.body.name;
    const price = req.body.price;
    const categoryId = categorySearch.id;

    const menuItem = new MenuItem({ name, price, category: categoryId });
    const data = await menuItem.save();
    res.json(data).status(200);
  } catch (e) {
    res.status(200).json({ error: "couldn't add menu item" });
  }
});

/*
  @route /api/admin/menuitem/:name
  @method PUT
  @desc updates a menu item to the database
  @access private (admin)
*/
router.put("/menuitem/:name", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { errors, isValid } = validateMenuItemInput(req.body);

    let categorySearch;
    // check if category exists
    if (!isEmpty(req.body.category)) {
      categorySearch = await Category.findOne({ name: req.body.category });
      if (!categorySearch) {
        isValid = false;
        errors.category = "Category isn't in database";
      }
    } else {
      errors.category = "Category field is empty";
    }

    if (!isValid || !isEmpty(errors)) {
      return res.json({ errors }).status(400);
    }
    const menuItem = await MenuItem.findOne({ name: req.params.name });
    if (menuItem) {
      await MenuItem.findOneAndUpdate(
        { _id: menuItem.id },
        { name: req.body.name, price: req.body.price, category: categorySearch.id }
      );
      return res.json({ success: true }).status(200);
    }

    return res.json({ message: "no match found" }).status(200);
  } catch (e) {
    res.status(200).json({ error: "couldn't update menu item" });
  }
});

/*
  @route /api/admin/menuitem/:name
  @method DELETE
  @desc deletes a menu item to the database
  @access private (admin)
*/
router.delete("/menuitem/:name", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const cat = await MenuItem.findOne({ name: req.params.name });
    if (cat) {
      await MenuItem.findOneAndDelete({ name: req.params.name });
      return res.json({ success: true }).status(200);
    }
    return res.json({ message: "no match found" }).status(200);
  } catch (e) {
    res.status(200).json({ error: "couldn't delete menu item" });
  }
});

/*
  @route  /api/admin/branch/
  @method GET
  @desc   Get all branches
  @access Private
*/
router.get("/branch/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const branchList = await Branch.find().populate("location", ["lat", "lon"]);
    return res.json(branchList).status(200);
  } catch (e) {
    res.json(e.message);
  }
});

/*
  @route  /api/admin/branch/
  @method POST
  @desc   Create a branch
  @access Private
*/
router.post("/branch/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    // TODO: missing validation
    const { errors, isValid } = validateBranchInput(req.body);

    if (!isValid) {
      return res.json({ errors }).status(400);
    }

    const lat = req.body.lat;
    const lon = req.body.lon;
    const label = req.body.label;

    let location = findLocation(lat, lon);

    const branch = new Branch({
      location: location.id,
      label: label,
    });
    await branch.save();
    return res.json(branch).status(200);
  } catch (e) {
    res.send(e.message).status(500);
  }
});

/*
  @route  /api/admin/branch/
  @method PUT
  @desc   UPDATE a branch
  @access Private
*/
router.put("/branch/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    // TODO: missing validation
    const { errors, isValid } = validateBranchInput(req.body);

    if (!isValid) {
      return res.json({ errors }).status(400);
    }

    const branchId = req.params.id;
    const lat = parseFloat(req.body.lat);
    const lon = parseFloat(req.body.lon);

    let location = findLocation(lat, lon);

    const branch = await Branch.findOneAndUpdate(
      {
        _id: branchId,
      },
      { location: location.id }
    );

    return res.json(branch).status(200);
  } catch (e) {
    res.send(e.message).status(500);
  }
});

/*
  @route  /api/admin/branch/:id
  @method DELETE
  @desc   Delete an address
  @access Private
*/
router.delete("/branch/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const branchList = await Branch.findOneAndDelete({ id: id });
    return res.json(branchList).status(200);
  } catch (e) {
    res.json(e.message);
  }
});

/*
  @route  /api/admin/accept/:id
  @method POST
  @desc   Accept an order
  @access Private
*/
router.post("/accept/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const order = Order.findOneAndUpdate(
      { id: req.params.id },
      { status: "accepted" },
      { new: true }
    );

    return res.json(order).status(200);
  } catch (e) {
    res.json(e.message);
  }
});

/*
  @route  /api/admin/reject/:id
  @method POST
  @desc   Reject an order
  @access Private
*/
router.post("/reject/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const order = Order.findOneAndUpdate(
      { id: req.params.id },
      { status: "rejected" },
      { new: true }
    );

    return res.json(order).status(200);
  } catch (e) {
    res.json(e.message).status(500);
  }
});

router.post("/profile-upload-single", uploads.single("profile-file"));

router.get("/uploads", (req, res) => {
  res.sendFile(path.join(__dirname, "../../upload.html"));
});

module.exports = router;
