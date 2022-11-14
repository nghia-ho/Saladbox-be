const User = require("../models/User");

const orderController = {};

orderController.register = async (req, res, next) => {
  res.send("hello");
};

module.exports = orderController;
