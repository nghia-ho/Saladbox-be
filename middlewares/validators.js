const { sendResponse } = require("../helpers/utils");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const validators = {};

// using middlewares (req, res, next) => {}
validators.validate = (validationArray) => async (req, res, next) => {
  // await a promise to catch a error
  await Promise.all(validationArray.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  // if not error
  if (errors.isEmpty()) return next();

  const message = errors
    .array()
    .map((error) => error.msg)
    .join(" & ");

  return sendResponse(res, 422, false, null, { message }, "Validation Error");
};

validators.checkObjectId = (paramId) => {
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new Error("Invalid ObjectId");
  }
  return true;
};

module.exports = validators;