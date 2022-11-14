const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  // Get data from request

  let { email, password, name } = req.body;

  // Validation
  let user = await User.findOne({ email });
  if (user)
    throw new AppError(400, "User already exists", "Registration Error");

  // Process
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({ email, password, name });
  const accessToken = await user.generateToken();

  // Response

  sendResponse(res, 200, true, { user, accessToken }, null, "success");
});

module.exports = userController;
