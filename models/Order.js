const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    orderItems: [
      {
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        product_id: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: Number, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "paypal"],
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: Date },
      email_address: { type: String },
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDeliverd: { type: Boolean, required: true, default: false },
    deliverdAt: { type: Date },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
