const Brand = require("../models/Brand");
const apiResponse = require("../utils/apiResponse");

exports.addBrand = async (req, res) => {
  try {
    const newBrand = new Brand(req.body);
    await newBrand.save();
    return apiResponse(res).created(newBrand, "Brand created successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getBrands = async (req, res) => {
  try {
    const filter = {};
    if (req.query.companyId) {
      filter.companyId = req.query.companyId; // filter by companyId if provided
    }
    const brands = await Brand.find(filter);
    return apiResponse(res).success(brands, "Brands fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return apiResponse(res).notFound("Brand not found");
    return apiResponse(res).success(brand, "Brand fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return apiResponse(res).notFound("Brand not found");
    return apiResponse(res).success(null, "Brand deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!brand) return apiResponse(res).notFound("Brand not found");
    return apiResponse(res).success(brand, "Brand updated successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
