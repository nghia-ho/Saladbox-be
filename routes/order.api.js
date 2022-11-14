const express = require("express");
const router = express.Router();

/**
 * @route POST /oders
 * @description Create a new Oders
 * @body {productName,userName,amount0.}
 * @access Login required
 */

/**
 * @route GET /oders?page=1&limit=10
 * @description Get orders with pagination
 * @access Admin Login required
 */

/**
 * @route GET /oders/:id
 * @description Get a single order
 * @access Admin Login required
 */

/**
 * @route PUT /oders
 * @description Update the oders
 * @body
 * @access Admin Login required
 */

/**
 * @route DELETE /oders/:id
 * @description Delete a oder
 * @access Login required
 */

module.exports = router;
