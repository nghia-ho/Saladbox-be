const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const { param, body } = require("express-validator");
const favoriteController = require("../controllers/favorite.controller");
const authentication = require("../middlewares/authentication");

/**
 * @route POST /favorite
 * @description Adđ product to favorite list
 * @body
 * @access Login required
 */
router.post(
  "/",
  authentication.loginRequired,
  favoriteController.markAsFavorite
);

/**
 * @route GET /favorite
 * @description Get all favorite list
 * @access Login required
 */
router.get(
  "/",
  authentication.loginRequired,
  favoriteController.getFavoriteList
);

/**
 * @route DELETE /favorite/:id
 * @description Remove a product from favorite list
 * @access Login required
 */
router.delete(
  "/:id",
  authentication.loginRequired,
  favoriteController.deleteFavoriteItem
);

module.exports = router;
