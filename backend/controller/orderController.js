const Order = require("../models/orderModels");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErrors = require("../middlewares/handleasyncErrors");
const ApiFeactures = require("../utils/apifeactures");

exports.newOrder = CatchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

const order= await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user._id
});

res.status(201).json({
    success:true,
    message:"Your Order has Placed",
    order
})
    
});

exports.getSingleOrder = CatchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
  
    if (!order) {
      return next(new ErrorHandler("Order does not exist with this ID", 404));
    }
  
    res.status(200).json({
      success: true,
      message: "This is your order",
      order,
    });
  });
  
// get logged in orders

exports.myOrder= CatchAsyncErrors(async(req,res,next)=>{
    const orders= await Order.find( {user: req.user._id});

    if(!orders){
        return next(ErrorHandler("Order not Exits with this id", 404));
    }
    res.status(200).json({
        success:true,
        message:"This is your Order",
        orders
    })
});

exports.getAllOrders = CatchAsyncErrors(async(req,res, next)=>{
    const orders= await Order.find();
    let totalAmount= 0;
    orders.forEach((ele)=>{
        totalAmount+=ele.totalPrice;
    });

    res.status(200).json({
        success:true,
        orders,
    })
})


// Update orders

exports.UpdateOrders = CatchAsyncErrors(async(req,res, next)=>{
    const order= await Order.findById(req.params.id);
    if(order.orderStatus==="Delevered"){
        return next(new ErrorHandler("you order has already delevered to you", 400));
    }

    order.orderItems.forEach( async (ele)=>{
        await updateStock(ele.product, ele.quantity);
    })

   order.orderStatus= req.body.status;

   if(req.body.status==="Delevered"){
   order.deleveredAt = Date.now();

   }

   await order.save({
    validateBeforeSave:false
   })
    res.status(200).json({
        success:true,
        order,
    });
});


async function updateStock(id , quantity){
    const product= await Product.findById(id);

    product.stock= product.stock-=quantity;
    product.save({
        validateBeforeSave:false,
    })
}


// delete order

exports.deleteOrder= CatchAsyncErrors(async(req,res, next)=>{
    const order= await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        message:"you order cancelled",
    })

})