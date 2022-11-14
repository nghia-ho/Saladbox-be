const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    address: { type: String, default: "" },
    product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    totalPrice: { type: Number, required: true },
    shippingFee: { type: Number, default: 15000 },
    phone: { type: Number, default: "" },
    orderDate: { type: Date, default: "" },
    status: {
      type: String,
      enum: ["pending", "handling order", "success", "reject"],
      default: "pending",
    },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamp: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
