const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController = {};

// Register
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
  sendResponse(res, 200, true, { user, accessToken }, null, "Register Success");
});
// Get Account
userController.getCurrentUser = catchAsync(async (req, res, next) => {
  //Validate user
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User Not Found", "Get User Error");
  // Response
  sendResponse(res, 200, true, user, null, "Get User Success");
});

// Edit Account
userController.updateAccount = catchAsync(async (req, res, next) => {
  // Get data
  let { newPassword, passwordConfirmation } = req.body;
  const currentUserId = req.userId;
  const userId = req.params.id;

  // Logic Validation
  if (currentUserId !== userId)
    throw new AppError(400, "Permission Required", "Update User Error");
  let user = await User.findOne({ _id: currentUserId }, "+password");
  if (!user) throw new AppError(400, "User not found", "Update User Error");

  if (newPassword && passwordConfirmation) {
    const isMatch = await bcrypt.compare(newPassword, user.password);
    if (isMatch)
      throw new AppError(
        400,
        "New password must be differently older password",
        "Update User Error"
      );

    if (newPassword !== passwordConfirmation) {
      throw new AppError(
        400,
        "New password and password confirmation must be match",
        "Update User Error"
      );
    } else {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(newPassword, salt);
      user.password = password;
    }
  } else if (newPassword || passwordConfirmation)
    throw new AppError(
      400,
      "Missing info to change password",
      "Update User Error"
    );

  // Process
  const allows = ["name", "phone", "address", "avatarURL", "aboutme"];

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  // Response
  sendResponse(res, 200, true, user, null, "Update User Successfull");
});

// Deactive Account
userController.deactivateAccount = catchAsync(async (req, res, next) => {
  //getdata
  const currentUserId = req.userId;
  // Validation
  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(404, "User Not Found", "Get User Error");
  // Process
  user.isDeleted = true;
  await user.save();

  //Send Response
  sendResponse(res, 200, true, user, null, "Deactivate Account Successfull");
});

// Admin can get all account
userController.getUsers = catchAsync(async (req, res, next) => {
  // Get Query
  let { limit, page, ...filterQuery } = req.query;

  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;

  // Process
  const filterConditions = [{ isDeleted: false }];
  let sort = { createdAt: -1 };

  if (filterQuery.name) {
    filterConditions.push({
      name: { $regex: filterQuery.name, $options: "i" },
    });
  }

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await User.countDocuments(filterCriteria);
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let user = await User.find(filterCriteria)
    .sort(sort)
    .skip(offset)
    .limit(limit);

  // Send Response
  return sendResponse(
    res,
    200,
    true,
    { user, count, totalPage },
    null,
    "Get user Success"
  );
});

//admin can get single account's user
userController.getSingleUser = catchAsync(async (req, res, next) => {
  // Response
  // const userId = req.userId;
  // const user = await User.findById(userId);
  // if (!user) throw new AppError(404, "User Not Found", "Get User Error");

  sendResponse(res, 200, "true", "user", null, "success");
});

module.exports = userController;
