const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const speacialOrderSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    address: { type: String, default: "" },
    product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    totalPrice: { type: Number, required: true },
    shippingFee: { type: Number, default: 15000 },
    phone: { type: Number, default: "" },
    orderDate: { type: Date, default: "" },
    day: [
      {
        day1: { type: Boolean, default: false },
      },
      {
        day2: { type: Boolean, default: false },
      },
      {
        day3: { type: Boolean, default: false },
      },
      {
        day4: { type: Boolean, default: false },
      },
      {
        day5: { type: Boolean, default: false },
      },
      {
        day6: { type: Boolean, default: false },
      },
      {
        day7: { type: Boolean, default: false },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "handling order", "success", "reject"],
      default: "pending",
    },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamp: true }
);

const SpeacialOrder = mongoose.model("SpeacialOrder", speacialOrderSchema);
module.exports = SpeacialOrder;
