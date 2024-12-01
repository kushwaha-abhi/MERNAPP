const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErrors = require("../middlewares/handleasyncErrors");
const ApiFeactures = require("../utils/apifeactures");
// create product

exports.createProduct = CatchAsyncErrors(async (req, res, next) => {
  // console.log(req.body);

  req.body.user= req.body.id
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
  //  next();
});
// GET ALL PRODUCTS
exports.getAllProducts = CatchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 5;

  // Logging for debugging
  console.log("Starting getAllProducts");

  const productCount = await Product.countDocuments();
  console.log("Product count fetched:", productCount);

  const apiFeactures = new ApiFeactures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  console.log("Applying query features");
  const products = await apiFeactures.query;

  console.log("Products fetched:", products.length);

  res.status(200).json({
    success: true,
    products,
    productCount,
  });

  console.log("Response sent");
});


// Update Product  - Admin
exports.updateProduct = CatchAsyncErrors(async (req, res) => {
  // Wait for the find operation to finish before proceeding
  let product = await Product.findById(req.params.id);

  // If the product is not found, return an error
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Now update the product and return the updated version
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  // Return the updated product
  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = CatchAsyncErrors(async (req, res, next) => {
  console.log("Delete route hit with ID:", req.params.id); // Debugging
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

exports.getProductDetails = async (req, res, next) => {
  try {
    // Await the result of the query
    const product = await Product.findById(req.params.id);

    // Handle the case where the product is not found
    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }

    // Send a response with the product
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    // Catch and handle any errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.createProductReview = CatchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  if (!Array.isArray(product.reviews)) {
    product.reviews = [];
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user && rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user && rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numofReviews = product.reviews.length;
  }

  const avgRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  product.ratings = avgRating / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});


exports.getProductReviews = CatchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews || [], 
  });
});

exports.deleteReviews = CatchAsyncErrors(async (req, res, next) => {
  const { productId, reviewId } = req.query;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== reviewId.toString()
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = reviews.length > 0 ? avg / reviews.length : 0;
  const numofReviews = reviews.length;

  await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      ratings,
      numofReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
