const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Your Name"],
    maxLength: [30, "can not exceed 30 fegure"],
  },

  email: {
    type: String,
    required: [true, "Please enter Your Email"],
    unique: true,
    validate: [validator.isEmail, " Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "password shoud be atleast 8 chars"],
    select:false
  },

  avatar: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
  return Jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

// Generating password reset token

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hasing and adding to user schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire= Date.now()+15*60*1000;
    return resetToken;
};

module.exports = mongoose.model("User", userSchema);
