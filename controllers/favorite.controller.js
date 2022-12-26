const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");

const favoriteController = {};

// Role User: Add to Favorite List
favoriteController.markAsFavorite = catchAsync(async (req, res, next) => {
  // Get data
  const { productId, type } = req.body;
  const currentUserID = req.userId;

  //Logic
  const favoriteProduct = await Favorite.findOne({
    product: productId,
    user: currentUserID,
  });
  if (favoriteProduct)
    throw new AppError(
      404,
      "Product already mark as favorite",
      "Mask Product as Favorite Error"
    );
  const product = await Product.findById(productId);
  if (!product)
    throw new AppError(
      404,
      "Product Not Found",
      "Mask product as Favorite Error"
    );
  // Process
  await Favorite.create({
    user: currentUserID,
    product: product,
    type,
  });
  const favorite = await Favorite.find({}).populate("product");
  // Send data
  sendResponse(
    res,
    200,
    true,
    { favorite },
    null,
    "Create favorite List successful"
  );
});

// Role User: Get Favorite List
favoriteController.getFavoriteList = catchAsync(async (req, res, next) => {
  let { limit, page } = req.query;
  limit = parseInt(limit) || 5;
  page = parseInt(page) || 1;

  // Get data
  const currentUserID = req.userId;

  //Process
  let sort = { createdAt: 1 };
  const count = await Favorite.countDocuments({ user: currentUserID });
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);
  let favorite = await Favorite.find({ user: currentUserID })

    .populate("product")
    .sort(sort)
    .skip(offset)
    .limit(limit);

  if (!favorite.length)
    sendResponse(res, 200, true, [], null, "Favorite is empty");
  // Send Response

  sendResponse(
    res,
    200,
    true,
    { favorite, totalPage, count },
    null,
    "Get favorite List successful"
  );
});
// Role User: Delete from Favorite List
favoriteController.deleteFavoriteItem = catchAsync(async (req, res, next) => {
  // Get data
  const currentUserID = req.userId;
  const { id } = req.params;
  //Process
  const favoriteList = await Favorite.findOneAndDelete({
    product: id,
    user: currentUserID,
  });
  if (!favoriteList)
    throw new AppError(
      404,
      "Product from favorite list not Found",
      "Delete Product from favorite list error"
    );
  const favorite = await Favorite.find({}).populate("product");

  // Send Response
  sendResponse(
    res,
    200,
    true,
    { favorite },
    null,
    "Delete product from list successful"
  );
});

module.exports = favoriteController;
