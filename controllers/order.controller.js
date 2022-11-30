const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Order = require("../models/Order");
const User = require("../models/User");

const orderController = {};

orderController.createOrderrrrrrr = catchAsync(async (req, res, next) => {
  // Get data
  const {
    orderItems,
    itemsPrice,
    shippingAddress,
    paymentMethod,
    shippingPrice,
    totalPrice,
  } = req.body;
  const currentUserID = req.userId;

  if (orderItems && orderItems.length === 0) {
    throw new AppError(404, "No orderItems", "Create order Error");
  }
  const order = await Order.create({
    orderItems,
    user: currentUserID,
    itemsPrice,
    shippingAddress,
    paymentMethod,
    shippingPrice,
    totalPrice,
  });

  // Send data
  sendResponse(res, 200, true, order, null, "Create Order successful");
});
orderController.orderDetail = catchAsync(async (req, res, next) => {
  // Get data
  const { id } = req.params;
  const currentUserID = req.userId;

  const order = await Order.findById(id).populate("user", "name email");

  if (!order) throw new AppError(404, "Order not Found", "Get order Error");

  // Send data
  sendResponse(res, 200, true, order, null, "Get Order successful");
});
orderController.paidOrder = catchAsync(async (req, res, next) => {
  // Get data
  const { id, status, update_time, email_address } = req.body;
  const currentUserID = req.userId;

  let order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    throw new AppError(404, "Order not Found", "paid order Error");
  } else {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id,
      status,
      update_time,
      email_address: req.body.payer.email_address,
    };
  }

  order.save();

  // Send data
  sendResponse(res, 200, true, order, null, "Get paid successful");
});

module.exports = orderController;
