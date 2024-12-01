const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
  },

  orderItems: [
    {
      name: {
        type: String,
        require: true,
      },
      price: {
        type: Number,
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
      image: {
        type: String,
        require: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemsPrice:{
    type:Number,
    default:0,
    required: true,

  },
  taxPrice:{
    type:Number,
    default:0,
    required: true,

  },
  shippingPrice:{
    type:Number,
    default:0,
    required: true,

  },
  totalPrice:{
    type:String,
    required:true,
  },
  orderStatus:{
    type:String,
    required:true,
    default:"Processing"
  },
  deleveredAt:Date,
  createdAt:{
    type:Date,
    default:Date.now(),
  }
});

module.exports= mongoose.model("Order", orderSchema);