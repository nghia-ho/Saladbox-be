const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const validators = require("../middlewares/validators");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { param, body } = require("express-validator");
const authentication = require("../middlewares/authentication");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dcui8saaz",
  api_key: "276626599479948",
  api_secret: "U0OHUelldUsVAPLW4NFtoEE9TfI",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
  },
});

/**
 * @route GET /products
 * @description Get all product with pagination
 * @access Public
 */
router.get("/", productController.getAllProduct);

/**
 * @route GET /products/admin
 * @description Get all product with pagination
 * @access Public
 */

router.get(
  "/admin",
  authentication.loginRequiredRoleAdmin,
  productController.getAllProductByAdmin
);

/**
 * @route GET /products/:id
 * @description Get single product
 * @access Public
 */
router.get(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  productController.getSingleProduct
);

/**
 * @route POST /products
 * @description Create new product
 * @access Admin Login required
 */
router.post(
  "/",
  validators.validate([
    body("name").exists().notEmpty().isString(),
    body("decription").exists().notEmpty().isString(),
    body("category").exists().notEmpty().custom(validators.checkObjectId),
  ]),
  authentication.loginRequiredRoleAdmin,
  productController.createNewProduct
);

/**
 * @route POST /products
 * @description Create custom product
 * @body name, decription, image
 * @access  Login required
 */
router.post(
  "/custom",
  authentication.loginRequired,
  validators.validate([
    body("name").exists().notEmpty(),
    body("ingredients").exists().notEmpty(),
    body("price").exists().notEmpty(),
    body("calo").exists().notEmpty(),
    body("type").exists().notEmpty(),
  ]),
  authentication.loginRequired,
  productController.customProduct
);

/**
 * @route PUT /products/:id
 * @description Edit infomation of product
 * @body name, decription, image
 * @access Admin Login required
 */
router.put(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequiredRoleAdmin,
  productController.editProduct
);
/**
 * @route DELETE /products/:id
 * @description Delete product
 * @access Admin Login required
 */
router.delete(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequiredRoleAdmin,
  productController.deletedProduct
);

module.exports = router;
