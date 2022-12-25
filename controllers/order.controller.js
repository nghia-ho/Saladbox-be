const express = require("express");
const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Order = require("../models/Order");
const SpeacialOrder = require("../models/SpeacialOrder");
const User = require("../models/User");

const orderController = {};

// Role User: Create Order
orderController.createOrder = catchAsync(async (req, res, next) => {
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

// Role User: Create Order
orderController.createOrderCustom = catchAsync(async (req, res, next) => {
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
    throw new AppError(404, "No orderItems", "Create Order  Weekly Error");
  }
  const order = await SpeacialOrder.create({
    orderItems,
    user: currentUserID,
    itemsPrice,
    shippingAddress,
    paymentMethod,
    shippingPrice,
    totalPrice,
  });

  // Send data
  sendResponse(res, 200, true, order, null, "Create Order  Weekly successful");
});

// Role User & Admin: Get Single Order
orderController.orderDetail = catchAsync(async (req, res, next) => {
  // Get data
  const { id } = req.params;

  const order = await Order.findById(id).populate("user", "name email");
  // Send data
  if (order) sendResponse(res, 200, true, order, null, "Get Order successful");
  if (!order) {
    const order = await SpeacialOrder.findById(id).populate(
      "user",
      "name email"
    );
    sendResponse(res, 200, true, order, null, "Get Order successful");
  } else throw new AppError(404, "Order not Found", "Get order Error");
});

// Role User: Pay for Single Order
orderController.paidOrder = catchAsync(async (req, res, next) => {
  // Get data
  const { id, status, update_time, email_address } = req.body;
  const currentUserID = req.userId;

  let order = await Order.findById(req.params.id);
  let speacial = await SpeacialOrder.findById(req.params.id);

  if (order && !speacial) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id,
      status,
      update_time,
      email_address: req.body.payer.email_address,
    };
    await order.save();
    // Send data
    sendResponse(res, 200, true, order, null, "Get paid successful");
  } else if (speacial && !order) {
    speacial.isPaid = true;
    speacial.paidAt = Date.now();
    speacial.paymentResult = {
      id,
      status,
      update_time,
      email_address: req.body.payer.email_address,
    };
    await speacial.save();
    // Send data
    sendResponse(res, 200, true, speacial, null, "Get paid successful");
  } else if (!speacial && !order) {
    throw new AppError(404, "Order Not Found", "Paid Order Error");
  }
  // sendResponse(res, 200, true, speacial, null, "Get paid successful");
});

// Role Admin & User: Get All Orders
orderController.getOrders = catchAsync(async (req, res, next) => {
  // Get Query
  let { limit, page, ...filterQuery } = req.query;

  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;

  // Get data
  const currentUserID = req.userId;
  const role = req.role;

  let sort = { createdAt: -1 };

  if (filterQuery.sort) {
    const sortBy = filterQuery.sort.orderBy;
    const sortOrder = filterQuery.sort.order === "desc" ? 1 : -1;
    if (sortBy === "_id") sort = { _id: sortOrder };
    if (sortBy === "user") sort = { user: sortOrder };
    if (sortBy === "createdAt") sort = { createdAt: sortOrder };
    if (sortBy === "isPaid") sort = { isPaid: sortOrder };
    if (sortBy === "totalPrice") sort = { totalPrice: sortOrder };
    if (sortBy === "isDeliverd") sort = { isDeliverd: sortOrder };
  }

  // ROLE USER
  if (role === "user") {
    const count = await Order.countDocuments({ user: currentUserID }); // count number
    const totalPage = Math.ceil(count / limit); // totalPage
    const offset = limit * (page - 1); // skip

    const orders = await Order.find({ user: currentUserID })
      .populate("user")
      .sort(sort)
      .skip(offset)
      .limit(limit);

    if (!orders.length) {
      sendResponse(
        res,
        200,
        true,
        { orders: [] },
        null,
        "Your Orders is Empty"
      );
    }
    sendResponse(
      res,
      200,
      true,
      { orders, count, totalPage },
      null,
      "Get orders successful"
    );
  } else {
    // ROLE ADMIN
    let orders = await Order.find({});

    const count = await Order.countDocuments({}); // count number
    const totalPage = Math.ceil(count / limit); // totalPage
    const offset = limit * (page - 1); // skip

    if (filterQuery.query) {
      orders = await Order.find({}).populate("user");
      orders = orders.filter((e) =>
        e.user.name.toLowerCase().match(filterQuery.query)
      );
      sendResponse(res, 200, true, { orders }, null, "Get orders successful");
    }

    let endDate = new Date();
    let past6Date = new Date(endDate - 6 * 60 * 60 * 24 * 1000);
    let past5Date = new Date(endDate - 5 * 60 * 60 * 24 * 1000);
    let past4Date = new Date(endDate - 4 * 60 * 60 * 24 * 1000);
    let past3Date = new Date(endDate - 3 * 60 * 60 * 24 * 1000);
    let past2Date = new Date(endDate - 2 * 60 * 60 * 24 * 1000);
    let past1Date = new Date(endDate - 1 * 60 * 60 * 24 * 1000);

    let day = [];

    orders.forEach((dTotalSale) => {
      if (dTotalSale.createdAt.getDate() === endDate.getDate()) {
        day.push({ day1: dTotalSale.totalPrice });
      } else {
        day.push({ day1: 0 });
      }

      if (dTotalSale.createdAt.getDate() === past1Date.getDate()) {
        day.push({ day2: dTotalSale.totalPrice });
      } else {
        day.push({ day1: 0 });
      }

      if (dTotalSale.createdAt.getDate() === past2Date.getDate()) {
        day.push({ day3: dTotalSale.totalPrice });
      } else {
        day.push({ day1: 0 });
      }

      if (dTotalSale.createdAt.getDate() === past3Date.getDate()) {
        day.push({ day4: dTotalSale.totalPrice });
      } else {
        day.push({ day4: 0 });
      }

      if (dTotalSale.createdAt.getDate() === past4Date.getDate()) {
        day.push({ day5: dTotalSale.totalPrice });
      } else {
        day.push({ day1: 0 });
      }

      if (dTotalSale.createdAt.getDate() === past5Date.getDate()) {
        day.push({ day6: dTotalSale.totalPrice });
      } else {
        day.push({ day6: 0 });
      }

      if (dTotalSale.createdAt.getDate() === past6Date.getDate()) {
        day.push({ day7: dTotalSale.totalPrice });
      } else {
        day.push({ day7: 0 });
      }
    });

    const day1 = day.filter((e) => e.day1).reduce((a, c) => a + c.day1, 0);
    const day2 = day.filter((e) => e.day2).reduce((a, c) => a + c.day2, 0);
    const day3 = day.filter((e) => e.day3).reduce((a, c) => a + c.day3, 0);
    const day4 = day.filter((e) => e.day4).reduce((a, c) => a + c.day4, 0);
    const day5 = day.filter((e) => e.day5).reduce((a, c) => a + c.day5, 0);
    const day6 = day.filter((e) => e.day6).reduce((a, c) => a + c.day6, 0);
    const day7 = day.filter((e) => e.day7).reduce((a, c) => a + c.day7, 0);
    const totalSale = [day1, day2, day3, day4, day5, day6, day7];

    orders = await Order.find({})
      .populate("user")
      .sort(sort)
      .skip(offset)
      .limit(limit);

    sendResponse(
      res,
      200,
      true,
      { totalSale, orders, count, totalPage },
      null,
      "Get orders successful"
    );
  }
});

// Role Admin & User: Get Order Speacial Order (7s)
orderController.getOrdersCustom = catchAsync(async (req, res, next) => {
  // Get Query
  let { limit, page, ...filterQuery } = req.query;

  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;

  // Get data
  const currentUserID = req.userId;
  const role = req.role;

  let sort = { createdAt: -1 };

  if (filterQuery.sort) {
    const sortBy = filterQuery.sort.orderBy;
    const sortOrder = filterQuery.sort.order === "desc" ? 1 : -1;
    if (sortBy === "_id") sort = { _id: sortOrder };
    if (sortBy === "user") sort = { user: sortOrder };
    if (sortBy === "createdAt") sort = { createdAt: sortOrder };
    if (sortBy === "isPaid") sort = { isPaid: sortOrder };
    if (sortBy === "totalPrice") sort = { totalPrice: sortOrder };
    if (sortBy === "isDeliverd") sort = { isDeliverd: sortOrder };
  }
  if (role === "user") {
    //USER ROLE
    const count = await SpeacialOrder.countDocuments({ user: currentUserID });
    const totalPage = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const orders = await SpeacialOrder.find({ user: currentUserID })
      .populate("user")
      .sort(sort)
      .skip(offset)
      .limit(limit);

    if (!orders.length) {
      sendResponse(
        res,
        200,
        true,
        { orders: [] },
        null,
        "Your Orders is Empty"
      );
    }
    sendResponse(
      res,
      200,
      true,
      { orders, count, totalPage },
      null,
      "Get orders successful"
    );
  } else {
    //ROLE ADMIN
    let orders = await SpeacialOrder.find({});

    const count = await SpeacialOrder.countDocuments({}); // count number
    const totalPage = Math.ceil(count / limit); // totalPage
    const offset = limit * (page - 1); // skip

    if (filterQuery.query) {
      orders = await SpeacialOrder.find({}).populate("user");
      orders = orders.filter((e) =>
        e.user.name.toLowerCase().match(filterQuery.query)
      );
      sendResponse(res, 200, true, { orders }, null, "Get orders successful");
    }

    let endDate = new Date();
    let past6Date = new Date(endDate - 6 * 60 * 60 * 24 * 1000);
    let past5Date = new Date(endDate - 5 * 60 * 60 * 24 * 1000);
    let past4Date = new Date(endDate - 4 * 60 * 60 * 24 * 1000);
    let past3Date = new Date(endDate - 3 * 60 * 60 * 24 * 1000);
    let past2Date = new Date(endDate - 2 * 60 * 60 * 24 * 1000);
    let past1Date = new Date(endDate - 1 * 60 * 60 * 24 * 1000);

    let day = [];

    orders.forEach((dTotalSale) => {
      if (dTotalSale.createdAt.getDate() === endDate.getDate()) {
        day.push({ day1: dTotalSale.totalPrice });
      } else {
        day.push({ day1: 0 });
      }

      if (dTotalSale.createdAt.getDate() === past1Date.getDate()) {
        day.push({ day2: dTotalSale.totalPrice });
      } else {
        day.push({ day1: 0 });
      }

      if (dTotalSale.createdAt.getDate() === past2Date.getDate()) {
        day.push({ day3: dTotalSale.totalPrice });
      } else {
        day.push({ day1: 0 });
      }

      if (dTotalSale.createdAt.getDate() === past3Date.getDate()) {
        day.push({ day4: dTotalSale.totalPrice });
      } else {
        day.push({ day4: 0 });
      }

      if (dTotalSale.createdAt.getDate() === past4Date.getDate()) {
        day.push({ day5: dTotalSale.totalPrice });
      } else {
        day.push({ day1: 0 });
      }

      if (dTotalSale.createdAt.getDate() === past5Date.getDate()) {
        day.push({ day6: dTotalSale.totalPrice });
      } else {
        day.push({ day6: 0 });
      }

      if (dTotalSale.createdAt.getDate() === past6Date.getDate()) {
        day.push({ day7: dTotalSale.totalPrice });
      } else {
        day.push({ day7: 0 });
      }
    });

    const day1 = day.filter((e) => e.day1).reduce((a, c) => a + c.day1, 0);
    const day2 = day.filter((e) => e.day2).reduce((a, c) => a + c.day2, 0);
    const day3 = day.filter((e) => e.day3).reduce((a, c) => a + c.day3, 0);
    const day4 = day.filter((e) => e.day4).reduce((a, c) => a + c.day4, 0);
    const day5 = day.filter((e) => e.day5).reduce((a, c) => a + c.day5, 0);
    const day6 = day.filter((e) => e.day6).reduce((a, c) => a + c.day6, 0);
    const day7 = day.filter((e) => e.day7).reduce((a, c) => a + c.day7, 0);

    const totalSale = [day1, day2, day3, day4, day5, day6, day7];

    orders = await SpeacialOrder.find({})
      .populate("user")
      .sort(sort)
      .skip(offset)
      .limit(limit);

    sendResponse(
      res,
      200,
      true,
      { totalSale, orders, count, totalPage },
      null,
      "Get orders successful"
    );
  }
});

// Role Admin :Edit Order
orderController.editOrder = catchAsync(async (req, res, next) => {
  // Get data

  const orderId = req.params.id;

  // Validate
  let order = await Order.findById(orderId);
  if (!order) throw new AppError(404, "Order Not Found", "Update Order Error");
  // Process
  const allows = ["isDeliverd", "phone", "district", "address"];

  if (req.body.isDeliverd) {
    allows.forEach((field) => {
      if (req.body[field] !== undefined) {
        order[field] = true;
        order.isPaid = true;
      }
    });
    await order.save();
  } else {
    allows.forEach((field) => {
      if (req.body[field] !== undefined) {
        order.shippingAddress[field] = req.body[field];
      }
    });
    await order.save();
  }

  //send res
  sendResponse(res, 200, true, order, null, "Update Order Success");
});
// Role Admin :Edit Speacial Order
orderController.editOrderCustom = catchAsync(async (req, res, next) => {
  // Get data

  const orderId = req.params.id;
  const { isDeliverd, phone, district, address, day } = req.body;
  console.log(day);
  // Validate
  let order = await SpeacialOrder.findById(orderId);
  if (!order) throw new AppError(404, "Order Not Found", "Update Order Error");
  // Process
  const allows = ["isDeliverd", "phone", "district", "address"];

  if (req.body.isDeliverd) {
    allows.forEach((field) => {
      if (req.body[field] !== undefined) {
        order[field] = true;
        order.isPaid = true;
      }
    });
    await order.save();
  } else if (isDeliverd || phone || district || address) {
    allows.forEach((field) => {
      if (req.body[field] !== undefined) {
        order.shippingAddress[field] = req.body[field];
      }
    });
    await order.save();
  } else {
    if (day === 0) order.day1 = true;
    if (day === 1) order.day2 = true;
    if (day === 2) order.day3 = true;
    if (day === 3) order.day4 = true;
    if (day === 4) order.day5 = true;
    if (day === 5) order.day6 = true;
    if (day === 6) order.day7 = true;
    await order.save();
  }

  //send res
  sendResponse(res, 200, true, order, null, "Update Order Success");
});

// Role Admin :Edit Speacial Order & Order
orderController.deleteOrder = catchAsync(async (req, res, next) => {
  // Get data

  const orderId = req.params.id;

  let order = await Order.findById(orderId);
  let speacial = await SpeacialOrder.findById(orderId);

  if (order && !speacial) {
    order = await Order.findByIdAndUpdate(
      orderId,
      {
        isDeleted: true,
      },
      { new: true }
    );
    //send response
    sendResponse(res, 200, true, { order }, null, "Delete Order Success");
  } else if (speacial && !order) {
    speacial = await SpeacialOrder.findByIdAndUpdate(
      orderId,
      {
        isDeleted: true,
      },
      { new: true }
    );
    //send response
    sendResponse(
      res,
      200,
      true,
      { order: speacial },
      null,
      "Delete Order Success"
    );
  } else if (!speacial && !order) {
    throw new AppError(404, "Order Not Found", "Delete Order Error");
  }
});

module.exports = orderController;
