const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");
const { param, body } = require("express-validator");
const categoryController = require("../controllers/category.controller");

/**
 * @route POST /category
 * @description Create a category
 * @body {name}
 * @access Admin Login required
 */
router.post(
  "/",
  validators.validate([body("name").exists().notEmpty()]),
  authentication.loginRequiredRoleAdmin,
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
router.put(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequiredRoleAdmin,
  categoryController.UpdateCategory
);
/**
 * @route DELETE /category/:id
 * @description Delete category
 * @access Login required
 */
router.delete(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequiredRoleAdmin,
  categoryController.deleteCategory
);

module.exports = router;
