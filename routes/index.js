const express = require("express");
const router = express.Router();

const authApi = require("./auth.api");
const userApi = require("./user.api");
const productApi = require("./product.api");
const ingredientApi = require("./ingredient.api");
const categoryApi = require("./category.api");
const orderApi = require("./order.api");
const favoriteApi = require("./favorite.api");

const { sendResponse, AppError } = require("../helpers/utils.js");

// authApi
router.use("/auth", authApi);
// userApi
router.use("/users", userApi);
// productApi
router.use("/product", productApi);
// ingredientApi
router.use("/ingredient", ingredientApi);
// categoryApi
router.use("/category", categoryApi);
// orderApi
router.use("/order", orderApi);
// favoriteAPi
router.use("/favorite", favoriteApi);

router.get("/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT);
});

module.exports = router;
