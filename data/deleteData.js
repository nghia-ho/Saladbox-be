const Ingredient = require("../models/Ingredient");
const Product = require("../models/Product");

require("dotenv/config");
const mongoose = require("mongoose");

const express = require("express");

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, () => {
  console.log("Connected to Database!");
});

Ingredient.remove({}, () => console.log("delete ingredient success"));

Product.remove({}, () => console.log("delete product success"));
