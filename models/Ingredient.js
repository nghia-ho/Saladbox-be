const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    calo: { type: Number, required: true },
    image: { type: String, default: "" },
    type: {
      type: String,
      required: true,
      enum: [
        "Vegetables Salad",
        "Vegetable",
        "Fruit",
        "NutsSeeds",
        "Cheeze",
        "Protein",
        "sauce",
      ],
    },

    step: { type: Number, required: true, default: 0 },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const Ingredient = mongoose.model("Ingredient", ingredientSchema);
module.exports = Ingredient;
