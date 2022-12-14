const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  // Get data from request
  const { email, password } = req.body;

  // Logic Validation
  const user = await User.findOne({ email }, ["+password", "+isDeleted"]);

  if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");
  if (user.isDeleted)
    throw new AppError(
      400,
      "Your Account Is Disable, Please Contact Us",
      "Login Error"
    );

  // Process
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "Wrong Password", "Login Error");
  const accessToken = await user.generateToken();

  // Response
  sendResponse(res, 200, true, { user, accessToken }, null, "Login Successful");
});

module.exports = authController;
