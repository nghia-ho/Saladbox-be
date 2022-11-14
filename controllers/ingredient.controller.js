const { body } = require("express-validator");
const { sendResponse } = require("../helpers/utils");
const Ingredient = require("../models/Ingredient");
const Product = require("../models/Product");

const ingredientController = {};

ingredientController.createIngredient = async (req, res, next) => {
  // Get data
  let { name, image, price, calo, type } = req.body;
  let step;
  // Validate

  // Process

  if (type === "Vegetable" || "Fruit" || "NutsSeeds" || "Cheeze" || "Protein")
    step = 2;
  if (type === "Vegetables Salad") step = 1;
  if (type === "sauce") step = 3;

  let ingredient = await Ingredient.create({
    name,
    image,
    price,
    calo,
    step,
    type,
  });

  sendResponse(res, 200, true, ingredient, null, "Create Product Success");
};
ingredientController.getIngredient = async (req, res, next) => {
  // get data
  // let { limit, page, ...filterQuery } = req.query;

  // limit = limit || 10;
  // page = page || 1;

  // // check get
  // const filterConditions = [{ isDeleted: false }];

  // if (filterQuery.name) {
  //   filterConditions.push({
  //     name: { $regex: filterQuery.name, $options: "i" },
  //   });
  // }

  // const filterCriteria = filterConditions.length
  //   ? { $and: filterConditions }
  //   : {};

  let ingredient = await Ingredient.find({});
  // .sort({ createdAt: -1 })
  // .limit(limit);
  // process
  // Send Request

  return sendResponse(
    res,
    200,
    true,
    { ingredient },
    null,
    "Get Product Success"
  );
};
ingredientController.updateIngredient = async (req, res, next) => {
  // Get data

  const ingredientID = req.params.id;

  // Validate
  let ingredient = await Ingredient.findById(ingredientID);
  if (!ingredient)
    throw new AppError(404, "Product Not Found", "Update Product Error");
  // Process
  const allows = ["name", "price", "calo", "image", "type"];

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      ingredient[field] = req.body[field];
    }
  });

  await ingredient.save();

  if (req.body.calo) {
    //tim product chua ingredientID
    const x = await Product.find({ ingredients: ingredientID });

    await Promise.all(
      // đi qua các product để tìm các ingredientID bên trong
      x.map(async (e) => {
        let alo = 0;
        await Promise.all(
          // đi qua từng ingredientID để tìm ingredient đầy đủ
          e.ingredients.map(async (i) => {
            const x = await Ingredient.findById(i);

            alo += x.calo;
            // e.calo = alo;

            // update calo
            await Product.findByIdAndUpdate(e._id, { calo: alo });
          })
        );
      })
    );
  }

  if (req.body.price) {
    //tim product chua ingredientID
    const x = await Product.find({ ingredients: ingredientID });

    await Promise.all(
      // đi qua các product để tìm các ingredientID bên trong
      x.map(async (e) => {
        let price = 0;
        await Promise.all(
          // đi qua từng ingredientID để tìm ingredient đầy đủ
          e.ingredients.map(async (i) => {
            const x = await Ingredient.findById(i);

            price += x.price;
            // e.price = alo;

            // update calo
            await Product.findByIdAndUpdate(e._id, { price });
          })
        );
      })
    );
  }

  //send res
  sendResponse(res, 200, true, ingredient, null, "Update Product Success");
};
ingredientController.deleteIngredient = async (req, res, next) => {
  // Get data

  const ingredientID = req.params.id;

  // Validate
  let ingredient = await Ingredient.findByIdAndUpdate(
    ingredientID,
    {
      isDeleted: true,
    },
    { new: true }
  );
  if (!ingredient)
    throw new AppError(404, "Product Not Found", "Delete Product Error");
  // Process

  //send res
  sendResponse(res, 200, true, ingredient, null, "Delete Product Success");
};

module.exports = ingredientController;
