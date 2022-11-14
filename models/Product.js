const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    name: { type: String, required: true },
    decription: { type: String, default: "" },
    ingredients: {
      type: [Schema.Types.ObjectId],
      ref: "Ingredient",
    },

    image: [{ type: String, default: "" }],
    price: { type: Number, required: true },
    calo: { type: Number, required: true },
    type: {
      type: String,
      enum: ["custom", "avaiable"],
      default: "avaiable",
    },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamp: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
