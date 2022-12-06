const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");

const favoriteController = {};

favoriteController.markAsFavorite = catchAsync(async (req, res, next) => {
  // Get data
  const { productId, type } = req.body;
  console.log(type);
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
favoriteController.getFavoriteList = catchAsync(async (req, res, next) => {
  // Get data
  const currentUserID = req.userId;
  console.log(currentUserID);

  //Process
  const favorite = await Favorite.find({ user: currentUserID }).populate(
    "product"
  );
  if (!favorite.length)
    sendResponse(res, 200, true, favorite, null, "Favorite is empty");
  // Send Response
  sendResponse(
    res,
    200,
    true,
    { favorite },
    null,
    "Get favorite List successful"
  );
});

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
