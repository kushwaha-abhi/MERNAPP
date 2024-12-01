const express= require("express");
const router= express.Router();
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");
const { newOrder, getSingleOrder, myOrder, getAllOrders, UpdateOrders, deleteOrder } = require("../controller/orderController");

router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/:id").get(isAuthenticatedUser,  getSingleOrder);
router.route("/order/me").get(isAuthenticatedUser, myOrder);
router.route("/admin/orders").get(isAuthenticatedUser, authorizedRole("admin"), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser,UpdateOrders);
router.route("/admin/order/:id").delete(isAuthenticatedUser, deleteOrder);
module.exports= router;