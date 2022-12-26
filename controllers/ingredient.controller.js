const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Ingredient = require("../models/Ingredient");
const Product = require("../models/Product");

const ingredientController = {};

// Role Admin: Create Ingredient
ingredientController.createIngredient = catchAsync(async (req, res, next) => {
  // Get data
  let { name, image, price, calo, type } = req.body;
  let step;

  //validate
  const currentIngredient = await Ingredient.findOne({ name });

  if (currentIngredient)
    throw new AppError(
      400,
      "The Ingredient already exists",
      "Create Ingredient Error"
    );
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

  sendResponse(res, 200, true, ingredient, null, "Create Ingredient Success");
});

// Role Admin & User: Get Ingredient
ingredientController.getIngredient = catchAsync(async (req, res, next) => {
  // Get Query
  let { limit, page, ...filterQuery } = req.query;

  limit = limit || 10;
  page = page || 1;

  // Process
  let sort = { updatedAt: -1 };

  const filterConditions = [{}];

  if (filterQuery.sort) {
    const sortBy = filterQuery.sort.orderBy;
    const sortOrder = filterQuery.sort.order === "desc" ? 1 : -1;
    if (sortBy === "name") sort = { name: sortOrder };
    if (sortBy === "image") sort = { image: sortOrder };
    if (sortBy === "step") sort = { step: sortOrder };
    if (sortBy === "price") sort = { price: sortOrder };
    if (sortBy === "calo") sort = { calo: sortOrder };
    if (sortBy === "type") sort = { type: sortOrder };
    if (sortBy === "isDeleted") sort = { isDeleted: sortOrder };
  }
  // console.log(sort);
  if (filterQuery.name) {
    filterConditions.push({
      name: { $regex: filterQuery.name, $options: "i" },
    });
  }

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Product.countDocuments(filterCriteria);
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const getAll = await Ingredient.find({});
  const type = [...new Set(getAll.map((i) => i.type))];

  let ingredient = await Ingredient.find(filterCriteria)
    .sort(sort)
    .limit(limit)
    .sort(sort)
    .skip(offset);
  // Send Request

  return sendResponse(
    res,
    200,
    true,
    { ingredient, count, totalPage, type },
    null,
    "Get Inredient Success"
  );
});

// Role Admin: Update Ingredient
ingredientController.updateIngredient = catchAsync(async (req, res, next) => {
  // Get data

  const ingredientID = req.params.id;

  // Validate

  let ingredient = await Ingredient.findById(ingredientID);
  if (!ingredient)
    throw new AppError(404, "Ingredient Not Found", "Update Ingredient Error");

  const currentIngredient = await Ingredient.findOne({ name: req.body.name });

  if (currentIngredient)
    throw new AppError(
      400,
      "The Ingredient already exists",
      "Create Ingredient Error"
    );

  // Process
  const allows = ["name", "price", "calo", "image", "type"];

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      ingredient[field] = req.body[field];
    }
  });

  if (req.body.type) {
    if (
      req.body.type === "Vegetable" ||
      "Fruit" ||
      "NutsSeeds" ||
      "Cheeze" ||
      "Protein"
    )
      step = 2;
    ingredient.step = 2;
    if (req.body.type === "Vegetables Salad") ingredient.step = 1;
    if (req.body.type === "sauce") ingredient.step = 3;
  }

  await ingredient.save();

  if (req.body.calo) {
    //Find product have ingredientID
    const ingredient = await Product.find({ ingredients: ingredientID });
    await Promise.all(
      // Map through all product have ingredient to find IngredientID
      ingredient.map(async (e) => {
        let calorie = 0;
        await Promise.all(
          e.ingredients.map(async (i) => {
            const ingredient = await Ingredient.findById(i);
            calorie += ingredient.calo;
            // e.calo = alo;
            // update calo
            await Product.findByIdAndUpdate(e._id, { calo: calorie });
          })
        );
      })
    );
  }

  if (req.body.price) {
    const ingredient = await Product.find({ ingredients: ingredientID });

    await Promise.all(
      ingredient.map(async (e) => {
        let price = 0;
        await Promise.all(
          e.ingredients.map(async (i) => {
            const ingre = await Ingredient.findById(i);
            price += ingre.price;
            await Product.findByIdAndUpdate(e._id, { price });
          })
        );
      })
    );
  }

  //send res
  sendResponse(res, 200, true, ingredient, null, "Update Product Success");
});

// Role Admin: Delete Ingredient
ingredientController.deleteIngredient = catchAsync(async (req, res, next) => {
  // Get data

  const ingredientID = req.params.id;

  // Process
  let ingredient = await Ingredient.findByIdAndUpdate(
    ingredientID,
    {
      isDeleted: true,
    },
    { new: true }
  );
  if (!ingredient)
    throw new AppError(404, "Product Not Found", "Delete Product Error");

  const caloOfIngredient = ingredient.calo;
  const priceOfIngredient = ingredient.price;

  // modify calo & price
  const ingredients = await Product.find({ ingredients: ingredientID });
  await Promise.all(
    ingredients.map(async (e) => {
      let calo = 0;
      let price = 0;
      calo = e.calo - caloOfIngredient;
      price = e.price - priceOfIngredient;
      await Product.findByIdAndUpdate(e._id, { calo: calo, price: price });
    })
  );

  // Delete ingredient in Product
  await Product.updateMany(
    { ingredients: ingredientID },
    { $pull: { ingredients: ingredientID } }
  );

  //send res
  sendResponse(res, 200, true, ingredient, null, "Delete Product Success");
});

module.exports = ingredientController;
