const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Category = require("../models/Category");
const Product = require("../models/Product");

const categoryController = {};

// Role Admin: Create New Category
categoryController.createNewCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  console.log(name);
  const category = await Category.findOne({ name });

  if (category)
    throw new AppError(
      400,
      "The Category already exists",
      "Create Category Error"
    );

  const newCategory = await Category.create({ name });

  sendResponse(res, 200, true, newCategory, null, "Create Category Success");
});

// Role User: Get Category
categoryController.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.find({});

  sendResponse(res, 200, true, category, null, "Get Category success");
});

// Role Admin: Update Category
categoryController.UpdateCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  let category = await Category.findByIdAndUpdate(id, { name }, { new: true });

  sendResponse(res, 200, true, { category }, "Update Category success");
});

// Role Admin: Delete Category
categoryController.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const categoryProduct = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  sendResponse(res, 200, true, categoryProduct, null, "Get Category success");
});

module.exports = categoryController;
