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
 * @route PUT /users/:id
 * @description Update user profile
 * @body {name, phone, address, avatarURL, aboutme}
 * @access Login required
 */
router.put(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),

  authentication.loginRequired,
  userController.updateAccount
);

/**
 * @route DELETE /me/delete
 * @description Deactive account user
 * @access Login required
 */
router.delete(
  "/me/delete",
  authentication.loginRequired,
  userController.deactivateAccount
);

// ADMIN -----------------------------------------------------------------------
/**
 * @route GET /users?page=10&limit=1
 * @description Get all users
 * @access Admin Login required
 */
router.get(
  "/",
  authentication.loginRequired,
  authentication.loginRequiredRoleAdmin,
  userController.getUsers
);

/**
 * @route GET /users/:id
 * @description Get single user
 * @access Admin Login required
 */
router.get(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  // authentication.loginRequired,
  authentication.loginRequiredRoleAdmin,
  userController.getSingleUser
);

module.exports = router;
