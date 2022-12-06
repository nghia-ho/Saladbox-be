const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    type: {
      type: String,
      enum: ["custom", "avaiable"],
      default: "avaiable",
    },
  },
  { timestamps: true }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
