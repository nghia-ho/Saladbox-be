const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    phone: { type: Number, default: "" },
    address: { type: String, default: "" },
    avatarURL: { type: String, default: "" },
    bmi: { type: Number, default: "" },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamp: true }
);

// Not show the password, isDeleted when send res to client, but monggodb saved
userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
