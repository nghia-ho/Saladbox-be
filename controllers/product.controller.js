const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Product = require("../models/Product");
const Ingredient = require("../models/Ingredient");
const { default: mongoose } = require("mongoose");
const { faker } = require("@faker-js/faker");

const productController = {};

// Get All Product
productController.getAllProduct = catchAsync(async (req, res, next) => {
  // Get Query
  let { limit, page, ...filterQuery } = req.query;

  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;

  // Process
  const filterConditions = [{ type: "avaiable" }];
  let sort = { updatedAt: -1 };

  if (filterQuery.name) {
    filterConditions.push({
      name: { $regex: filterQuery.name, $options: "i" },
    });
  }
  if (filterQuery.category) {
    filterConditions.push({ category: filterQuery.category });
  }

  if (filterQuery.price) {
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

  if (filterQuery.sort) {
    const sortBy = filterQuery.sort.orderBy;
    const sortOrder = filterQuery.sort.order === "desc" ? 1 : -1;
    if (sortBy === "name") sort = { name: sortOrder };
    if (sortBy === "image") sort = { image: sortOrder };
    if (sortBy === "category") sort = { category: sortOrder };
    if (sortBy === "price") sort = { price: sortOrder };
    if (sortBy === "calo") sort = { calo: sortOrder };
    if (sortBy === "isDeleted") sort = { isDeleted: sortOrder };
    if (sortBy === "sort") sort = { sort: sortOrder };
  }

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Product.countDocuments(filterCriteria);
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let product = await Product.find(filterCriteria)
    .populate("category")
    .populate("ingredients")
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

// Get Single Product
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

// Role admin: Create New Product
productController.createNewProduct = catchAsync(async (req, res, next) => {
  // Get data from body and files request
  let { name, decription, ingredients, category, image, type } = req.body;

  // let image = req.files;

  // Validate
  // ingredients = JSON.parse(req.body.ingredients);
  if (!ingredients?.length)
    throw new AppError(
      402,
      "Ingredient Does Not Empty",
      "Create Product Error"
    );

  const ingredientList = await Promise.all(
    ingredients.map(async (i) => {
      const isValidObject = mongoose.isValidObjectId(i);
      if (!isValidObject)
        throw new AppError(402, "Invalid IDDD", "Create Product Error");

      const ingredient = await Ingredient.findOne({ _id: i });
      if (!ingredient)
        throw new AppError(404, "Ingredient Not Found", "Create Product Error");

      return ingredient;
    })
  );

  // Process

  let calo = 0;
  let price = 0;

  ingredientList.forEach((ingredient) => {
    calo += ingredient.calo;
    price += ingredient.price;
  });

  let product = await Product.create({
    name,
    decription,
    image,
    ingredients,
    category,
    type,
    price,
    calo,
  });

  await product.populate([{ path: "ingredients" }, { path: "category" }]);

  sendResponse(res, 200, true, product, null, "Create Product Success");
});

//Role user: Can custom product by choosing ingredient
productController.customProduct = catchAsync(async (req, res, next) => {
  // Get data from body and files request
  let { name, ingredients, price, calo, type, image } = req.body;

  // Validate

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
  const decription = `${name + faker.lorem.paragraph()}`;
  // Process

  let product = await Product.create({
    name,
    ingredients,
    price,
    calo,
    image,
    type,
    decription,
  });

  await product.populate("ingredients");

  sendResponse(res, 200, true, product, null, "Custom Product Success");
});

//Role admin: Can edit product
productController.editProduct = catchAsync(async (req, res, next) => {
  // Get data

  const productID = req.params.id;

  // Validate
  let product = await Product.findById(productID);
  if (!product)
    throw new AppError(404, "Product Not Found", "Update Product Error");
  // Process
  console.log(req.body);
  const allows = [
    "name",
    "decription",
    "image",
    "ingredients",
    "category",
    "price",
    "calo",
    "type",
  ];

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  await product.save();
  //send res
  sendResponse(res, 200, true, product, null, "Update Product Success");
});

//Role admin: Can delete product
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
