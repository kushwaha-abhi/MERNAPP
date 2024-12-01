const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErrors = require("../middlewares/handleasyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const getResetPassowrdToken = require("../models/userModel");
const sendEmail = require("../utils/sendEmail.js");
// Register User

exports.registerUser = CatchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      Public_id: "this is a public user",
      url: "profileUrl",
    },
  });
  const token = user.getJWTToken();
  res.status(201).json({
    success: true,
    token,
  });
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
  sendToken(user, 200, res);
});

exports.logout = CatchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "loged out",
  });
});

exports.forgotPassword = CatchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/${resetToken}`;

  const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you did not request this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});
// reset password
exports.resetPassword = CatchAsyncErrors(async (req, res, next) => {
  const getResetPassowrdToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    getResetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    next(
      new ErrorHandler(
        "reset password token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("password does not matches", 400));
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// get user details

exports.getUserDetails = CatchAsyncErrors(async (req, res, next) => {
  console.log("req.user:", req.user); // Debugging log

  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "User not authenticated" });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // console.log("User function is called");
  // console.log(user);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = CatchAsyncErrors(async (req, res, next) => {
  // Retrieve user with password field explicitly included
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
      return next(new ErrorHandler("User not found", 404));
  }

  // console.log("Update password called for user:", user);

  // Check if old password matches
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 401));
  }

  // Check if new passwords match
  if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("New passwords do not match", 400));
  }

  // Update password
  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
      success: true,
      message: "Password updated successfully",
  });
});



// Update user Profile

exports.updateProfile  = CatchAsyncErrors(async(req,res,next)=>{
    const newUserData ={
      name:req.body.name,
      email:req.body.email,
      
    }

    const user= await User.findByIdAndUpdate(req.user.id, newUserData ,{
      new:true,
      runvalidators:true,
      userFindAndModify:false,
    })

    res.status(200).json({
      success:true,
      message:"Profile is updated successfully"
    })
});



// get single  user

exports.getSingleUser= CatchAsyncErrors(async(req,res,next)=>{
  const user= await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler("user does not exits with id"))
  }
  res.status(200).json({
    success:true,
    user,
  });
});

// Get all users

exports.getAlluser= CatchAsyncErrors(async(req,res,next)=>{
  const users= await User.find();
  console.log(users)
  res.status(200).json({
    success:true,
    users,
  });
});


exports.updateUserRole  = CatchAsyncErrors(async(req,res,next)=>{
  const newUserData ={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role,
  }

  const user= await User.findByIdAndUpdate(req.user.id, newUserData ,{
    new:true,
    runvalidators:true,
    userFindAndModify:false,
  })

  res.status(200).json({
    success:true,
    message:"Profile is updated successfully"
  })
});

exports.deleteUser  = CatchAsyncErrors(async(req,res,next)=>{

  const user= await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`No user exist with id ${req.params.id}`));
  }

  await user.deleteOne(user);

  res.status(200).json({
    success:true,
    message:"user  is deleted successfully"
  })
});