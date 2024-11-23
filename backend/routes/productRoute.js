const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controller/productController");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");
const router = express.Router();

router.route("/products").get(isAuthenticatedUser, authorizedRole("admin") , getAllProducts);
router.route("/products/new").post(isAuthenticatedUser,createProduct);
router.route("/products/:id").put(isAuthenticatedUser,updateProduct);
router.route("/products/:id").delete( isAuthenticatedUser , deleteProduct)
.get( isAuthenticatedUser , getProductDetails);

module.exports = router;
