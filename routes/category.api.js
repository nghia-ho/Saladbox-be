const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const { param, body } = require("express-validator");
const categoryController = require("../controllers/category.controller");

/**
 * @route POST /category
 * @description Create a category
 * @body
 * @access Admin Login required
 */
router.post(
  "/",
  validators.validate([body("name").exists().notEmpty()]),
  categoryController.createNewCategory
);

/**
 * @route GET /category
 * @description Get category
 * @access public
 */
router.get("/", categoryController.getCategory);

/**
 * @route PUT /category/:id
 * @description Update category
 * @body
 * @access Login required
 */
router.put("/:id", categoryController.UpdateCategory);
/**
 * @route DELETE /category/:id
 * @description Delete category
 * @access Login required
 */
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
