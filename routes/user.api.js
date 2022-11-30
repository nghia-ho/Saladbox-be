const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");
/**
 * @route POST /users
 * @description Register new user
 * @body {name, enail, password)
 * @access Public
 */
router.post(
  "/",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  userController.register
);
/**
 * @route GET /users/me
 * @description Get current user profile
 * @access Login required
 */
router.get("/me", authentication.loginRequired, userController.getCurrentUser);

/**
 * @route GET /users?page=10&limit=1
 * @description Get all users
 * @access Admin Login required
 */
router.get("/", authentication.loginRequired, userController.getUsers);

/**
 * @route GET /users/:id
 * @description Get single user
 * @access Admin Login required
 */
/**
 * @route PUT /users/:id
 * @description Update user profile
 * @body
 * @access Login required
 */
/**
 * @route DELETE /users/:id
 * @description Deactive account user
 * @access Login required
 */

module.exports = router;
