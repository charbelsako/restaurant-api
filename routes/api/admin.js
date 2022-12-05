const router = require('express').Router()

const path = require('path')

const User = require('../../models/User')
const Category = require('../../models/Category')
const Ingredient = require('../../models/Ingredient')
const MenuItem = require('../../models/MenuItem')
const Branch = require('../../models/Branch')

const validateCategoryInput = require('../../validation/category')
const validateIngredientInput = require('../../validation/ingredient')
const validateMenuItemInput = require('../../validation/menuItem')
const validateBranchInput = require('../../validation/branch')
const isEmpty = require('../../validation/is-empty')

const findLocation = require('./utils')

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../client/src/uploads'))
  },
  filename: function (req, file, cb) {
    const name = file
    cb(null, file.originalname)
  },
})

const uploads = multer({ storage: storage })

/*
  @route /api/admin/users
  @method GET
  @desc return all users in the database
  @access private (admin)
*/
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (e) {
    res.status(500).json({ error: "couldn't get users" })
  }
})

/*
  @route /api/admin/users/:email
  @method POST
  @desc Enable/Disable a user from the database
  @access private (admin)
*/
router.post('/users/', async (req, res) => {
  try {
    const email = req.body.email
    const user = await User.findOne({ email: email })
    console.log(user)
    console.log(typeof user.enabled)
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { enabled: !user.enabled },
      { new: true }
    )

    res.json(updatedUser).status(200)
  } catch (e) {
    res.status(500).json({ error: "couldn't disable user" })
  }
})

/*
  @route /api/admin/category/
  @method POST
  @desc adds a category to the database
  @access private (admin)
*/
router.post('/category/', async (req, res) => {
  try {
    const { errors, isValid } = validateCategoryInput(req.body)

    if (!isValid) {
      throw new Error('Category name must be at least 2 characters')
    }

    const categoryName = req.body.name

    const duplicate = await Category.find({ name: categoryName }).lean()
    if (duplicate.length > 0) throw new Error('Category already exists')

    const category = new Category({ name: categoryName })
    const data = await category.save()
    res.json(data).status(200)
  } catch (e) {
    res.status(500).json({ status: 'failed', errors: e.message })
  }
})

/*
  @route /api/admin/ingredient/
  @method POST
  @desc adds a ingredient to the database
  @access private (admin)
*/
router.post('/ingredient/', async (req, res) => {
  try {
    const { errors, isValid } = validateIngredientInput(req.body)

    if (!isValid) {
      if (errors.name) throw new Error(errors.name)
    }

    const ingredientName = req.body.name
    const ingredient = new Ingredient({ name: ingredientName })
    const data = await ingredient.save()
    res.json(data).status(200)
  } catch (e) {
    res.status(500).json({ status: 'failed', errors: e.message })
  }
})

/*
  @route /api/admin/ingredient/:id
  @method GET
  @desc Retrieves an ingredient from the database
  @access private (admin)
*/
router.get('/ingredient/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id)
    res.json(ingredient).status(200)
  } catch (e) {
    res.status(500).json({ status: 'failed', errors: e.message })
  }
})

/*
  @route /api/admin/ingredient/:id
  @method PUT
  @desc Edit an ingredient to the database
  @access private (admin)
*/
router.put('/ingredient/:id', async (req, res) => {
  try {
    const { errors, isValid } = validateIngredientInput(req.body)

    if (!isValid) {
      if (errors.name) throw new Error(errors.name)
    }

    const ingredientName = req.body.name
    const ingredient = await Ingredient.findOneAndUpdate(
      { _id: req.params.id },
      { name: ingredientName },
      { new: true }
    )
    res.json(ingredient).status(200)
  } catch (e) {
    res.status(500).json({ status: 'failed', errors: e.message })
  }
})

/*
  @route /api/admin/ingredient/:id
  @method GET
  @desc Returns the ingredient specified
  @access private (admin)
*/
router.get('/ingredient/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findOne({ _id: req.params.id })
    return res.json(ingredient).status(200)
  } catch (e) {
    res.status(200).json({ error: "couldn't retrieve ingredient" })
  }
})

/*
  @route /api/admin/ingredient/:id
  @method DELETE
  @desc Deletes an ingredient
  @access private (admin)
*/
router.delete('/ingredient/:id', async (req, res) => {
  try {
    const ingredient = new Ingredient.findByIdAndDelete(req.params.id)
    res.json(ingredient).status(200)
  } catch (e) {
    res.status(500).json({ status: 'failed', errors: e.message })
  }
})

/*
  @route /api/admin/category/:name
  @method PUT
  @desc updates a category to the database
  @access private (admin)
*/
// router.put('/category/:name', async (req, res) => {
//   try {
//     const { errors, isValid } = validateCategoryInput(req.body)

//     if (!isValid) {
//       return res.json({ errors }).status(400)
//     }

//     const cat = await Category.findOne({ name: req.params.name })
//     if (cat) {
//       await Category.findOneAndUpdate(
//         { name: req.params.name },
//         { name: req.body.name }
//       )
//       return res.json({ success: true }).status(200)
//     }

//     return res.json({ message: 'no match found' }).status(200)
//   } catch (e) {
//     res.status(200).json({ error: "couldn't update category" })
//   }
// })

/*
  @route /api/admin/category/:id
  @method PUT
  @desc Edits the category
  @access private (admin)
*/
router.put('/category/:id', async (req, res) => {
  try {
    const { errors, isValid } = validateCategoryInput(req.body)
    if (!isValid) {
      return res.json({ errors }).status(400)
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { name: req.body.name },
      { new: true }
    )
    return res.json(category).status(200)
  } catch (e) {
    res.status(200).json({ error: "couldn't retrieve cateogry" })
  }
})

/*
  @route /api/admin/category/:id
  @method GET
  @desc Returns the category specified
  @access private (admin)
*/
router.get('/category/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id })
    return res.json(category).status(200)
  } catch (e) {
    res.status(200).json({ error: "couldn't retrieve cateogry" })
  }
})

/*
  @route /api/admin/category/:id
  @method DELETE
  @desc deletes a category from the database
*/
router.delete('/category/:id', async (req, res) => {
  try {
    const cat = await Category.findOne({ _id: req.params.id })
    if (cat) {
      await Category.findOneAndDelete({ _id: req.params.id })
      return res.json({ success: true }).status(200)
    }
    throw new Error('no match found')
  } catch (e) {
    res.status(500).json({ error: "couldn't delete category" })
  }
})

/*
  @route /api/admin/menuitem/
  @method POST
  @desc adds a menu item to the database
  @access private (admin)
*/
router.post('/menuitem/', uploads.single('itemImage'), async (req, res) => {
  try {
    let { errors, isValid } = validateMenuItemInput(req.body)

    let categorySearch
    // check if category exists
    if (!isEmpty(req.body.category)) {
      categorySearch = await Category.findOne({ name: req.body.category })
      if (!categorySearch) {
        isValid = false
        throw new Error("Category isn't in database")
      }
    } else {
      throw new Error('Category field is empty')
    }

    let foundName = await MenuItem.findOne({ name: req.body.name })
    if (foundName) {
      throw new Error('Item name already exists')
    }

    if (!isValid || !isEmpty(errors)) {
      if (errors.price) throw new Error(errors.price)
      if (errors.name) throw new Error(errors.name)
    }

    console.log(req.file)
    const name = req.body.name
    const price = req.body.price
    const categoryId = categorySearch.id
    const ingredients = req.body.ingredients.split(',')
    const image = req.file.filename

    const menuItem = new MenuItem({
      name,
      price,
      category: categoryId,
      ingredients: ingredients,
      image,
    })
    const savedItem = await menuItem.save()
    await savedItem.populate([{ path: 'category' }, { path: 'ingredients' }])
    res.json(savedItem).status(200)
  } catch (e) {
    console.error(e)
    res.status(500).json({ status: 'failed', errors: e.message })
  }
})

/*
  @route /api/admin/menuitem/:name
  @method PUT
  @desc updates a menu item to the database
  @access private (admin)
*/
router.put('/menuitem/:id', uploads.single('itemImage'), async (req, res) => {
  try {
    console.log(req.body)
    const { errors, isValid } = validateMenuItemInput(req.body)

    let categorySearch
    // check if category exists
    if (!isEmpty(req.body.category)) {
      categorySearch = await Category.findOne({ name: req.body.category })
      if (!categorySearch) {
        isValid = false
        errors.category = "Category isn't in database"
      }
    } else {
      errors.category = 'Category field is empty'
    }

    if (!isValid || !isEmpty(errors)) {
      return res.json({ errors }).status(400)
    }
    const menuItem = await MenuItem.findOne({ _id: req.params.id })
    if (menuItem) {
      const image = req.file.filename

      await MenuItem.findOneAndUpdate(
        { _id: menuItem.id },
        {
          name: req.body.name,
          price: req.body.price,
          category: categorySearch.id,
          image,
        }
      )
      return res.json({ success: true }).status(200)
    }

    return res.json({ message: 'no match found' }).status(200)
  } catch (e) {
    res.status(200).json({ error: "couldn't update menu item" })
  }
})

/*
  @route /api/admin/menuitem/:id
  @method GET
  @desc Returns the menu item specified
  @access private (admin)
*/
router.get('/menuitem/:id', async (req, res) => {
  try {
    const item = await MenuItem.findOne({ _id: req.params.id })
      .populate('category')
      .populate('ingredients')
    return res.json(item).status(200)
  } catch (e) {
    res.status(200).json({ error: "couldn't retrieve menu item" })
  }
})

/*
  @route /api/admin/menuitem/:id
  @method DELETE
  @desc deletes a menu item to the database
  @access private (admin)
*/
router.delete('/menuitem/:id', async (req, res) => {
  try {
    const item = await MenuItem.findOne({ _id: req.params.id })
    if (item) {
      await MenuItem.findOneAndDelete({ _id: req.params.id })
      return res.json({ success: true }).status(200)
    }
    return res.json({ message: 'no match found' }).status(200)
  } catch (e) {
    res.status(200).json({ error: "couldn't delete menu item" })
  }
})

/*
  @route  /api/admin/branch/
  @method GET
  @desc   Get all branches
  @access Private
*/
router.get('/branch/all', async (req, res) => {
  try {
    const branchList = await Branch.find().populate('location', ['lat', 'lon'])
    return res.json(branchList).status(200)
  } catch (e) {
    res.json(e.message)
  }
})

/*
  @route  /api/admin/branch/
  @method POST
  @desc   Create a branch
  @access Private
*/
router.post('/branch/', async (req, res) => {
  try {
    const { errors, isValid } = validateBranchInput(req.body)

    if (!isValid) {
      return res.json({ errors }).status(400)
    }

    const lat = req.body.lat
    const lon = req.body.lon
    const label = req.body.label

    let location = findLocation(lat, lon)

    const branch = new Branch({
      location: location.id,
      label: label,
    })
    await branch.save()
    return res.json(branch).status(200)
  } catch (e) {
    res.send(e.message).status(500)
  }
})

/*
  @route  /api/admin/branch/
  @method PUT
  @desc   UPDATE a branch
  @access Private
*/
router.patch('/branch/:id', async (req, res) => {
  try {
    const { errors, isValid } = validateBranchInput(req.body)

    if (!isValid) {
      return res.json({ errors }).status(400)
    }

    const branchId = req.params.id
    const lat = parseFloat(req.body.lat)
    const lon = parseFloat(req.body.lon)

    let location = findLocation(lat, lon)

    const branch = await Branch.findOneAndUpdate(
      {
        _id: branchId,
      },
      { location: location.id }
    )

    return res.json(branch).status(200)
  } catch (e) {
    res.send(e.message).status(500)
  }
})

/*
  @route  /api/admin/branch/:id
  @method DELETE
  @desc   Delete an address
  @access Private
*/
router.delete('/branch/:id', async (req, res) => {
  try {
    const id = req.params.id
    const branchList = await Branch.findOneAndDelete({ id: id })
    return res.json(branchList).status(200)
  } catch (e) {
    res.json(e.message)
  }
})

/*
  @route  /api/admin/accept/:id
  @method POST
  @desc   Accept an order
  @access Private
*/
router.post('/accept/:id', async (req, res) => {
  try {
    const order = Order.findOneAndUpdate(
      { id: req.params.id },
      { status: 'accepted' },
      { new: true }
    )

    return res.json(order).status(200)
  } catch (e) {
    res.json(e.message)
  }
})

/*
  @route  /api/admin/reject/:id
  @method POST
  @desc   Reject an order
  @access Private
*/
router.post('/reject/:id', async (req, res) => {
  try {
    const order = Order.findOneAndUpdate(
      { id: req.params.id },
      { status: 'rejected' },
      { new: true }
    )

    return res.json(order).status(200)
  } catch (e) {
    res.json(e.message).status(500)
  }
})

/*
  @route  /api/admin/profile-upload-single
  @method POST
  @desc   Upload an image
  @access Private
*/
router.post(
  '/profile-upload-single',
  uploads.single('profile-file'),
  (req, res) => {
    console.log('done')
    res.send('done').status(200)
  }
)

router.get('/uploads', (req, res) => {
  res.sendFile(path.join(__dirname, '../../upload.html'))
})

module.exports = router
