const express = require("express");
const ingredientController = require("../controllers/ingredient.controller");
const router = express.Router();

/**
 * @route POST /ingredient
 * @description Create a new ingredient
 * @body {name, image, price, calo, step, type}
 * @access Admin Login required
 */
router.post("/", ingredientController.createIngredient);

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
router.put("/:id", ingredientController.updateIngredient);
// ----------------------------------------------------------

/**
 * @route DELETE /ingredient/:id
 * @description Delete a ingredient
 * @access Admin Login required
 */
// ----------------------------------------------------------
router.delete("/:id", ingredientController.deleteIngredient);

module.exports = router;
