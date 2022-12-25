const express = require("express");
const ingredientController = require("../controllers/ingredient.controller");
const router = express.Router();
const validators = require("../middlewares/validators");
const { param, body } = require("express-validator");
const authentication = require("../middlewares/authentication");

/**
 * @route POST /ingredient
 * @description Create a new ingredient
 * @body {name, image, price, calo, step, type}
 * @access Admin Login required
 */
router.post(
  "/",
  body("name").exists().notEmpty().isString(),
  body("price").exists().notEmpty(),
  body("calo").exists().notEmpty(),
  body("type").exists().notEmpty().isString(),
  authentication.loginRequiredRoleAdmin,
  ingredientController.createIngredient
);

// ----------------------------------------------------------
/**
 * @route GET /ingredient?page=1&limit=10
 * @description Get ingredient with pagination
 * @access public
 */
router.get("/", ingredientController.getIngredient);
// ----------------------------------------------------------

/**
 * @route PUT /ingredient
 * @description Update the ingredient
 * @body {name, image, price, calo, step, type}
 * @access Admin Login required
 */
router.put(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequiredRoleAdmin,
  ingredientController.updateIngredient
);
// ----------------------------------------------------------

/**
 * @route DELETE /ingredient/:id
 * @description Delete a ingredient
 * @access Admin Login required
 */
// ----------------------------------------------------------
router.delete(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequiredRoleAdmin,
  ingredientController.deleteIngredient
);

module.exports = router;
