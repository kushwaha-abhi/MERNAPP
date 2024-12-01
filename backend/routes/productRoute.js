const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReviews,
} = require("../controller/productController");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");
const router = express.Router();

router
  .route("/products")
  .get(isAuthenticatedUser, authorizedRole("admin"), getAllProducts);
router.route("/products/new").post(isAuthenticatedUser, createProduct);
router.route("/products/:id").put(isAuthenticatedUser, updateProduct);
router
  .route("/products/:id")
  .delete(isAuthenticatedUser, deleteProduct)
  .get(isAuthenticatedUser, getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/reviews").get(getProductReviews).delete(deleteReviews);

module.exports = router;
