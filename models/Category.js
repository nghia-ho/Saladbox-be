const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = Schema(
  {
    name: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  },
  { timestamp: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
