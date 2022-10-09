const router = require('express').Router()
const MenuItem = require('../../models/MenuItem')
const Category = require('../../models/Category')

/**
 * @method: GET
 * @route: /menu/items
 * @returns: all the menu items
 * @access Public
 */
router.get('/items', async (req, res) => {
  try {
    const items = await MenuItem.find({}).populate('category')

    res.status(200).json({ items })
  } catch (e) {
    res.status(500).json({ err: e })
  }
})

/**
 * @method: GET
 * @route: /menu/categories
 * @returns: all the menu items
 * @access Public
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({})

    res.status(200).json({ categories })
  } catch (e) {
    res.status(500).json({ err: e })
  }
})

module.exports = router
