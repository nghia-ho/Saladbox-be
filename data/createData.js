const fs = require("fs");
const csv = require("csvtojson");
require("dotenv/config");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Ingredient = require("../models/Ingredient");
const Product = require("../models/Product");
const express = require("express");

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, () => {
  console.log("Connected to Database!");
});

const productName = [
  "Potato And Egg Salad",
  "Chicken Shawarma Salad",
  "Crispy Noodle Salad",
  "Mixed Salad With Lotus Root",
  "Pomegranate And Kiwi Salad",
  "Prawn And Litchi Salad",
  "Broccoli, Babycorn And Colourful Pasta Salad",
  "Fruit Cube Salad",
  "Compressed Melon Sliders",
  "Tossed Salad",
  "Waldorf Salad",
  "Chicken Piccata With Bread Salad",
  "Watermelon, Olive And Feta Salad",
  "Corn And Raw Mango Salad",
];

const ingredient = async () => {
  let newIn = await csv().fromFile("calories.csv");
  newIn = newIn.map((e, i = 1) => {
    e.Cals_per100grams = Number(e.Cals_per100grams.slice(0, -4));

    if (e.FoodCategory === "Vegetables Salad") {
      return {
        name: e.FoodItem,
        price: Number(faker.mersenne.rand(1, 20) + "000"),
        calo: e.Cals_per100grams,
        type: e.FoodCategory,
        step: 1,
      };
    }
    if (e.FoodCategory === "Vegetable") {
      return {
        name: e.FoodItem,
        price: Number(faker.mersenne.rand(1, 20) + "000"),
        calo: e.Cals_per100grams,
        type: e.FoodCategory,
        step: 2,
      };
    }
    if (e.FoodCategory === "Fruit") {
      return {
        name: e.FoodItem,
        price: Number(faker.mersenne.rand(1, 20) + "000"),
        calo: e.Cals_per100grams,
        type: e.FoodCategory,
        step: 2,
      };
    }

    if (e.FoodCategory === "NutsSeeds") {
      return {
        name: e.FoodItem,
        price: Number(faker.mersenne.rand(5, 15) + "000"),
        calo: e.Cals_per100grams,
        type: e.FoodCategory,
        step: 2,
      };
    }

    if (e.FoodCategory === "Cheeze") {
      return {
        name: e.FoodItem,
        price: Number(faker.mersenne.rand(10, 20) + "000"),
        calo: e.Cals_per100grams,
        type: e.FoodCategory,
        step: 2,
      };
    }

    if (e.FoodCategory === "Protein") {
      return {
        name: e.FoodItem,
        price: Number(faker.mersenne.rand(2, 50) + "000"),
        calo: e.Cals_per100grams,
        type: e.FoodCategory,
        step: 2,
      };
    } else return "";
  });

  for (let i = 0; i < 10; i++) {
    const sauce = {
      name: `${faker.address.country()} sauce`,
      price: Number(faker.mersenne.rand(1, 20) + "000"),
      calo: faker.mersenne.rand(1, 20),
      image: "",
      type: "sauce",
      step: 3,
    };
    newIn.push(sauce);
  }

  newIn = newIn
    .filter((e) => e)
    .map(async (e, i) => {
      e.image = `/ingredients/${i + 1}.png`;
      await Ingredient.create(e);
    });
  Promise.all(newIn);
  return newIn;
};

const product = async () => {
  for (let i = 0; i < productName.length; i++) {
    let step1 = await Ingredient.find({ step: 1 });
    let step2_1 = await Ingredient.find({ step: 2, type: "Fruit" });
    let step2_2 = await Ingredient.find({ step: 2, type: "Cheeze" });
    let step2_3 = await Ingredient.find({ step: 2, type: "NutsSeeds" });
    let step2_4 = await Ingredient.find({ step: 2, type: "Fruit" });
    let step2_5 = await Ingredient.find({ step: 2, type: "Vegetable" });
    let step3 = await Ingredient.find({ step: 3 });

    step1 = step1[Math.floor(Math.random() * step1.length)];
    step2_1 = step2_1[Math.floor(Math.random() * step2_1.length)];
    step2_2 = step2_2[Math.floor(Math.random() * step2_2.length)];
    step2_3 = step2_3[Math.floor(Math.random() * step2_3.length)];
    step2_4 = step2_4[Math.floor(Math.random() * step2_4.length)];
    step2_5 = step2_5[Math.floor(Math.random() * step2_5.length)];
    step3 = step3[Math.floor(Math.random() * step3.length)];

    let step = [step1, step2_1, step2_2, step2_3, step2_4, step2_5, step3];
    let calo = 0;
    let price = 0;
    let id = [];

    step.map((e) => {
      calo += e.calo;
      price += e.price + e?.price / 2;
      id.push(e._id);
    });

    const item = {
      name: productName[i],
      decription: `${productName[i] + faker.lorem.paragraph()}`,
      ingredients: id,
      image: `/salads/${i + 1}.png`,
      price: price,
      calo: calo,
    };
    await Product.create(item);
  }
};
//  ingredient();
product();