const express = require("express");
const router = express.Router();

const { sendResponse, AppError } = require("../helpers/utils.js");

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

// userApi
const userApi = require("./user.api");
router.use("/users", userApi);

// productApi
const productApi = require("./product.api");
router.use("/product", productApi);

// ingredientApi
const ingredientApi = require("./ingredient.api");
router.use("/ingredient", ingredientApi);

// categoryApi
const categoryApi = require("./category.api");
router.use("/category", categoryApi);

// orderApi
const orderApi = require("./order.api");
router.use("/order", orderApi);

module.exports = router;
