const express = require("express");
const productController = require("../controllers/products");
const router = express.Router();
router.route("/").get(productController.getAllProducts);
router.route("/static").get(productController.getAllProductsStatic);
module.exports = router;
