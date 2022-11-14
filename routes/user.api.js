const express = require("express");
const router = express.Router();
const { register } = require("../controllers/user.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
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
  register
);
/**
 * @route GET /users/me
 * @description Get user profile page
 * @access Login required
 */
/**
 * @route PUT /users/me
 * @description Update user profile
 * @body
 * @access Login required
 */
/**
 * @route DELETE /users/me
 * @description Deactive account user
 * @access Login required
 */
/**
 * @route GET /users?page=10&limit=1
 * @description Get all user page
 * @access Admin Login required
 */
/**
 * @route GET /users/:userId
 * @description Get single user
 * @access Admin Login required
 */

module.exports = router;
