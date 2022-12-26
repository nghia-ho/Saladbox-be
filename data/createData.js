require("dotenv/config");

const csv = require("csvtojson");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Ingredient = require("../models/Ingredient");
const Product = require("../models/Product");

const mongoURI = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(mongoURI, () => {
  console.log("Connected to Database!");
});

const saladName = [
  "Potato And Egg Salad",
  "Shawarma Salad",
  "Crispy Noodle Salad",
  "Ensalada Murciana",
  "Nam khao",
  "Prawn And Litchi Salad",
  "Kosambari",
  "Fruit Cube Salad",
  "Tossed Salad",
  "Waldorf Salad",
  "Sałatka wiosenna",
  "Crab Louie",
  "Caesar Salad",
  "Leafy Green Salad",
  "Greek Salad",
  "Fattoush",
  "Cobb Salad",
  "Wedge Salad",
  "Insalata Caprese",
  "Chicken Salad",
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
  newIn = newIn.filter((e) => e);
  newIn = newIn.map((e, i) => {
    e.image = `/ingredients/${i + 1}.png`;
    return e;
  });
  return newIn;
};

const productSalad = async () => {
  const category = "637464ef3c08c345541890f2";
  let result = [];

  let step1 = await Ingredient.find({ step: 1 });
  let step2_1 = await Ingredient.find({ step: 2, type: "Protein" });
  let step2_2 = await Ingredient.find({ step: 2, type: "Cheeze" });
  let step2_3 = await Ingredient.find({ step: 2, type: "NutsSeeds" });
  let step2_4 = await Ingredient.find({ step: 2, type: "Fruit" });
  let step2_5 = await Ingredient.find({ step: 2, type: "Vegetable" });
  let step3 = await Ingredient.find({ step: 3 });

  for (let i = 0; i < saladName.length; i++) {
    const newstep1 = step1[Math.floor(Math.random() * step1.length)];
    const newstep2_1 = step2_1[Math.floor(Math.random() * step2_1.length)];
    const newstep2_2 = step2_2[Math.floor(Math.random() * step2_2.length)];
    const newstep2_3 = step2_3[Math.floor(Math.random() * step2_3.length)];
    const newstep2_4 = step2_4[Math.floor(Math.random() * step2_4.length)];
    const newstep2_5 = step2_5[Math.floor(Math.random() * step2_5.length)];
    const newstep3 = step3[Math.floor(Math.random() * step3.length)];

    let step = [
      newstep1,
      newstep2_1,
      newstep2_2,
      newstep2_3,
      newstep2_4,
      newstep2_5,
      newstep3,
    ];
    let calo = 0;
    let price = 0;
    let id = [];

    step.forEach((e) => {
      calo += e.calo;
      price += e.price + e?.price / 2;
      id.push(e._id);
    });

    const item = {
      name: saladName[i],
      decription: `${saladName[i] + faker.lorem.paragraph()}`,
      ingredients: id,
      image: `/salads/${i + 1}.png`,
      category,
      price: price,
      calo: calo,
    };
    // console.log(item);

    result.push(item);
  }
  return result;
};

const productSmoothies = async () => {
  const category = "6374652c3c08c345541890f8";
  let newIn = await csv().fromFile("calories.csv");
  newIn = newIn.map((e, i = 1) => {
    e.Cals_per100grams = Number(e.Cals_per100grams.slice(0, -4));

    if (e.FoodCategory === "Smoothies") {
      return {
        name: e.FoodItem,
        decription: `${e.FoodItem + faker.lorem.paragraph()}`,
        image: `/smoothies/${i}.png`,
        category,
        price: Number(faker.mersenne.rand(2, 50) + "000"),
        calo: e.Cals_per100grams,
      };
    }
  });
  newIn = newIn
    .filter((e) => e)
    .map((e, i) => {
      e.image = `/smoothies/${i + 1}.png`;
      return e;
    });
  return newIn;
};
const productJuice = async () => {
  const category = "637464f63c08c345541890f5";
  let newIn = await csv().fromFile("calories.csv");
  newIn = newIn.map((e, i) => {
    e.Cals_per100grams = Number(e.Cals_per100grams.slice(0, -4));

    if (e.FoodCategory === "(Fruit)Juices") {
      return {
        name: e.FoodItem,
        decription: `${e.FoodItem + faker.lorem.paragraph()}`,
        image: `/juice/${i}.png`,
        category,
        price: Number(faker.mersenne.rand(2, 50) + "000"),
        calo: e.Cals_per100grams,
      };
    }
  });
  newIn = newIn
    .filter((e) => e)
    .map((e, i) => {
      e.image = `/juice/${i + 1}.png`;
      return e;
    });

  return newIn.slice(0, 10);
};

(async () => {
  try {
    const dataInfredient = await ingredient();
    Ingredient.insertMany(dataInfredient);

    const dataProductSalad = await productSalad();
    Product.insertMany(dataProductSalad);

    const dataproductSmoothies = await productSmoothies();
    Product.insertMany(dataproductSmoothies);

    const dataproductJuice = await productJuice();
    Product.insertMany(dataproductJuice);
  } catch (error) {
    console.log(error);
  }
})();
