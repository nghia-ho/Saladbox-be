const { catchAsync } = require("../helpers/utils");
const Favorite = require("../models/Favorite");

const favoriteController = {};

favoriteController.markAsFavorite = catchAsync(async (req, res, next) => {});
favoriteController.getFavoriteList = catchAsync(async (req, res, next) => {});
favoriteController.deleteFavoriteItem = catchAsync(
  async (req, res, next) => {}
);

module.exports = favoriteController;
