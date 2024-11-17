const Product= require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErrors= require("../middlewares/handleasyncErrors");
const ApiFeactures = require("../utils/apifeactures");
// create product


exports.createProduct= CatchAsyncErrors(async (req, res, next)=>{
    // console.log(req.body);
     const  product =  await Product.create(req.body);
     res.status(201).json({
        success:true,
          product
     })
    //  next();
} );
 // GET ALL PRODUCTS
exports.getAllProducts= CatchAsyncErrors(async (req, res)=>{
    const apiFeaqctures= new ApiFeactures(Product.find(),req.query).search().filter();
    const products= await apiFeaqctures.query;
    res.status(201).json({
        success:true,
        products
    })
})

// Update Product  - Admin
exports.updateProduct = CatchAsyncErrors(async (req, res) => {
   
        // Wait for the find operation to finish before proceeding
        let product = await Product.findById(req.params.id);
        
        // If the product is not found, return an error
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Now update the product and return the updated version
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        // Return the updated product
        res.status(200).json({
            success: true,
            product
        });
}
)

exports.deleteProduct =CatchAsyncErrors( async (req, res, next) => {
    console.log("Delete route hit with ID:", req.params.id); // Debugging
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } );


exports.getProductDetails = async (req, res, next) => {
    try {
        // Await the result of the query
        const product = await Product.findById(req.params.id);

        // Handle the case where the product is not found
        if (!product) {
           return next( new ErrorHandler("product not found", 404));
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

