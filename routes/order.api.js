const express = require("express");
const orderController = require("../controllers/order.controller");
const authentication = require("../middlewares/authentication");
const router = express.Router();

/**
 * @route POST /order
 * @description Create a new order
 * @body {productName,userName,amount0.}
 * @access Login required
 */
router.post("/", authentication.loginRequired, orderController.createOrder);

/**
 * @route GET /order?page=1&limit=10
 * @description Get orders with pagination
 * @access Admin Login required
 */

/**
 * @route GET /order?page=1&limit=10
 * @description Get user's orders with pagination
 * @access Login required
 */
router.get("/", authentication.loginRequired, orderController.getOrders);

/**
 * @route GET /order/:id
 * @description Get a single order
 * @access Admin Login required
 */
router.get("/:id", authentication.loginRequired, orderController.orderDetail);

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

/**
 * @route DELETE /order/:id
 * @description Delete a oder
 * @access Login required
 */

module.exports = router;
