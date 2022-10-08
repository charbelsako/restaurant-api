const router = require("express").Router()
const MenuItem = require("../../models/MenuItem")
/**
 * @method: GET
 * @route: /menu/
 * @returns: all the menu items
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find({})

    res.status(200).json({ items })
  } catch (e) {
    res.status(500).json({ err: e })
  }
})

module.exports = router
