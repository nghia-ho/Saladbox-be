const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Product = require("../models/Product");
const Ingredient = require("../models/Ingredient");
const { default: mongoose } = require("mongoose");

const productController = {};

productController.getAllProduct = catchAsync(async (req, res, next) => {
  // Get Query
  let { limit, page, ...filterQuery } = req.query;

  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;

  // Process
  const filterConditions = [{ isDeleted: false }, { type: "avaiable" }];
  let sort = { createdAt: -1 };

  if (filterQuery.name) {
    filterConditions.push({
      name: { $regex: filterQuery.name, $options: "i" },
    });
  }
  const price = JSON.parse(filterQuery.price);

  if (price) {
    filterConditions.push({
      price: {
        $gte: JSON.parse(filterQuery.price)[0],
        $lte: JSON.parse(filterQuery.price)[1],
      },
    });
  }

  if (filterQuery.sortBy === "price-lowest") sort = { price: 1 };
  if (filterQuery.sortBy === "price-highest") sort = { price: -1 };
  if (filterQuery.sortBy === "calo-lowest") sort = { calo: 1 };
  if (filterQuery.sortBy === "calo-highest") sort = { calo: -1 };

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Product.countDocuments(filterCriteria);
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let product = await Product.find(filterCriteria)
    .sort(sort)
    .skip(offset)
    .limit(limit);

  // Send Response
  return sendResponse(
    res,
    200,
    true,
    { product, count, totalPage },
    null,
    "Get Product Success"
  );
});

productController.getSingleProduct = catchAsync(async (req, res, next) => {
  // Get data
  const { id } = req.params;

  // Validate input
  let product = await Product.findById(id);
  if (!product) throw new AppError(404, "Product Not Found", "Not Found");

  // Process
  product = await product.populate([
    {
      path: "ingredients",
      select: "name _id calo image",
    },
    {
      path: "category",
      select: "name",
    },
  ]);

  // Send response
  sendResponse(res, 200, true, product, null, "Get Product Success");
});

productController.createNewProduct = catchAsync(async (req, res, next) => {
  // Get data from body and files request
  let { name, decription, arrayListIngredients } = req.body;
  let image = req.files;

  // Validate

  name = JSON.parse(name);
  decription = JSON.parse(decription);
  arrayListIngredients = JSON.parse(req.body.arrayListIngredients);

  const ingredients = await Promise.all(
    arrayListIngredients.map(async (i) => {
      const isValidObject = mongoose.isValidObjectId(i);
      if (!isValidObject) throw new AppError(404, "Invalid ID", "Not Found");

      const ingredient = await Ingredient.findOne({ _id: i });
      if (!ingredient)
        throw new AppError(404, "Ingredient Not Found", "Not Found");

      return ingredient;
    })
  );
  // console.log(ingredient);

  // Process

  let calo = 0;
  let price = 0;

  ingredients.forEach((ingredient) => {
    calo += ingredient.calo;
    price += ingredient.price;
  });

  image = image.map((e) => e.path);

  let product = await Product.create({
    name,
    decription,
    image,
    ingredients: arrayListIngredients,
    price,
    calo,
  });

  await product.populate("ingredients");

  sendResponse(res, 200, true, product, null, "Create Product Success");
});
productController.customProduct = catchAsync(async (req, res, next) => {
  // Get data from body and files request
  let { name, ingredients, price, calo, type } = req.body;

  // Validate
  // console.log(name);
  // console.log(ingredients);
  // console.log(price);
  // console.log(calo);
  // console.log(type);

  const ingredient = await Promise.all(
    ingredients.map(async (i) => {
      const isValidObject = mongoose.isValidObjectId(i);
      if (!isValidObject) throw new AppError(404, "Invalid ID", "Not Found");

      const ingredient = await Ingredient.findOne({ _id: i });
      if (!ingredient)
        throw new AppError(404, "Ingredient Not Found", "Not Found");

      return ingredient;
    })
  );
  // console.log(ingredient);

  // Process

  let product = await Product.create({ name, ingredients, price, calo, type });

  await product.populate("ingredients");

  sendResponse(res, 200, true, product, null, "Custom Product Success");
});
productController.editProduct = catchAsync(async (req, res, next) => {
  // Get data

  const productID = req.params.id;

  // Validate
  let product = await Product.findById(productID);
  if (!product)
    throw new AppError(404, "Product Not Found", "Update Product Error");
  // Process
  const allows = ["name", "decription", "image"];

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  await product.save();
  //send res
  sendResponse(res, 200, true, product, null, "Update Product Success");
});

productController.deletedProduct = catchAsync(async (req, res, next) => {
  // Get data

  const productID = req.params.id;

  // Validate
  let product = await Product.findByIdAndUpdate(
    productID,
    {
      isDeleted: true,
    },
    { new: true }
  );
  if (!product)
    throw new AppError(404, "Product Not Found", "Delete Product Error");
  // Process

  //send res
  sendResponse(res, 200, true, product, null, "Delete Product Success");
});

module.exports = productController;
