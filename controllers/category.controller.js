const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Category = require("../models/Category");
const Product = require("../models/Product");

const categoryController = {};

// Role Admin: Create New Category
categoryController.createNewCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const category = await Category.findOne({ name });

  if (category)
    throw new AppError(
      400,

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

  const isDeleted = await Category.findById(id);

  const categoryProduct = await Category.findByIdAndUpdate(
    id,
    { isDeleted: !isDeleted.isDeleted },
    { new: true }
  );

  const product = await Product.updateMany(
    { category: id },
    { $set: { isDeleted: !isDeleted.isDeleted } }
  );

  sendResponse(res, 200, true, categoryProduct, null, "Get Category success");
});

module.exports = categoryController;
