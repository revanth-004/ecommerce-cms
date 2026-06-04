const Coupon = require("../models/Coupon");
const apiResponse = require("../utils/apiResponse");

exports.postCoupons = async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    return apiResponse(res).created(newCoupon, "Coupon created successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getCoupons = async (req, res) => {
  try {
    const { companyId, brandId, ids } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (brandId) filter.brandId = brandId;

    if (ids) {
      const idArray = ids.split(",");
      filter._id = { $in: idArray };
    }

    const coupons = await Coupon.find(filter);
    return apiResponse(res).success(coupons, "Coupons fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return apiResponse(res).notFound("Coupon not found");
    return apiResponse(res).success(coupon, "Coupon fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return apiResponse(res).notFound("Coupon not found");
    return apiResponse(res).success(null, "Coupon deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) return apiResponse(res).notFound("Coupon not found");
    return apiResponse(res).success(coupon, "Coupon updated successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
