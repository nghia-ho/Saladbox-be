require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { sendResponse, AppError } = require("./helpers/utils.js");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

const indexRouter = require("./routes/index");
app.use("/api", indexRouter);

app.use("/", function (req, res, next) {
  res.status(200).send("Salad Box is coming");
});

const mongoose = require("mongoose");

// DB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose
  .connect(mongoURI)
  .then(() => console.log(`DB connected `))
  .catch((err) => console.log(err));

// catch 404 and forard to error handler
app.use((req, res, next) => {
  const err = new AppError(404, "Not Found", "Bad Request");
  next(err);
});

/* Initialize Error Handling */
app.use((err, req, res, next) => {
  console.log("ERROR", err);
  return sendResponse(
    res,
    err.statusCode ? err.statusCode : 500,
    false,
    null,
    { message: err.message },
    err.isOperational ? err.errorType : "Internal Server Error"
  );
});

module.exports = app;
