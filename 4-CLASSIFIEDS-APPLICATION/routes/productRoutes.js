const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");

const auth = require("../middleware/auth");

router.get("/", productController.home);

router.get("/product/:id", productController.showProduct);

router.get("/sell", auth, productController.showSell);

router.post("/sell", auth, productController.createProduct);

router.get("/my-listings", auth, productController.myListings);

router.post(
    "/product/delete/:id",
    auth,
    productController.deleteProduct
);

module.exports = router;