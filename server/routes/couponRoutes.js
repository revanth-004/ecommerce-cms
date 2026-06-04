const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");

const {
  postCoupons,
  getCoupons,
  getCouponById,
  deleteCoupon,
  putCoupon,
} = require("../controllers/CouponController");

router.post("/", postCoupons);
router.get("/", getCoupons);
router.get("/:id", getCouponById);
router.delete("/:id", deleteCoupon);
router.put("/:id", putCoupon);

module.exports = router;
