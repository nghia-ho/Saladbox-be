require("dotenv/config");

const mongoose = require("mongoose");

const Ingredient = require("../models/Ingredient");
const Order = require("../models/Order");
const SpeacialOrder = require("../models/SpeacialOrder");
const Product = require("../models/Product");
const Favorite = require("../models/Favorite");

const mongoURI = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(mongoURI, () => {
  console.log("Connected to Database!");
});

Ingredient.deleteMany({}, () => console.log("delete  Ingredient success"));
Product.deleteMany({}, () => console.log("delete  Product success"));
Order.deleteMany({}, () => console.log("delete Order success"));
Favorite.deleteMany({}, () => console.log("delete  Favorite success"));
SpeacialOrder.deleteMany({}, () =>
  console.log("delete  SpeacialOrder success")
);
