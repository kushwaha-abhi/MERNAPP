const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErrors = require("../middlewares/handleasyncErrors");
const User= require("../models/userModel");
const sendToken= require("../utils/jwtToken")
// Register User

exports.registerUser= CatchAsyncErrors(async(req, res, next)=>{
    const{name, email, password}=req.body;
       
    const user = await User.create({
        name,email,password,
        avatar:{
            Public_id:"this is a public user",
            url:"profileUrl"
        }
    });
    const token= user.getJWTToken();
    res.status(201).json({
        success:true,
        token
    })
});

exports.loginUser = CatchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    // console.log("function is colled");
    // Checking if both email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Finding the user in the database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Comparing passwords
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Generating JWT token
   sendToken(user,200,res);
});

exports.logout= CatchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null, {
        expires:new Date(Date.now()),
        httpOnly:true,
    })
     res.status(200).json({
        success:true,
        message:"loged out"
     })
})