const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAlluser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controller/userController");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRole("admin"), getAlluser);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizedRole("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizedRole("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizedRole("admin"), deleteUser);

module.exports = router;
