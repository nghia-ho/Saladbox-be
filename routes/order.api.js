const express = require("express");
const orderController = require("../controllers/order.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const router = express.Router();
const { param, body } = require("express-validator");

/**
 * @route POST /order
 * @description Create a new order
 * @body {productName,userName,amount0.}
 * @access Login required
 */
router.post("/", authentication.loginRequired, orderController.createOrder);
/**
 * @route POST /order
 * @description Create a new order
 * @body {productName,userName,amount0.}
 * @access Login required
 */
router.post(
  "/custom",
  authentication.loginRequired,
  orderController.createOrderCustom
);

/**
 * @route GET /order?page=1&limit=10
 * @description Get user's orders with pagination
 * @access Login required
 */
router.get("/", authentication.loginRequired, orderController.getOrders);
/**
 * @route GET /order?page=1&limit=10
 * @description Get user's orders with pagination
 * @access Login required
 */
router.get(
  "/custom",
  authentication.loginRequired,
  orderController.getOrdersCustom
);

/**
 * @route GET /order/:id
 * @description Get a single order
 * @access Login Required
 */
router.get(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequired,
  orderController.orderDetail
);

/**
 * @route GET /order/:id/payment
 * @description Paid order
 * @access Login required
 */
router.put("/:id/pay", authentication.loginRequired, orderController.paidOrder);

/**
 * @route PUT /order
 * @description Update the order
 * @body
 * @access Admin Login required
 */
router.put(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequired,
  orderController.editOrder
);
router.put(
  "/custom/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequired,
  orderController.editOrderCustom
);

/**
 * @route DELETE /order/:id
 * @description Delete a oder
 * @access Login required
 */
router.delete(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequired,
  orderController.deleteOrder
);

module.exports = router;
