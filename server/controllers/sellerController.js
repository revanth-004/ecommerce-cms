const Seller = require("../models/Seller");
const apiResponse = require("../utils/apiResponse");

exports.addSeller = async (req, res) => {
  try {
    const newSeller = new Seller(req.body);
    await newSeller.save();
    return apiResponse(res).created(newSeller, "Seller created successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getSellers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.companyId) {
      filter.companyId = req.query.companyId; // filter by companyId if provided
    }
    const sellers = await Seller.find(filter);
    return apiResponse(res).success(sellers, "Sellers fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return apiResponse(res).notFound("Seller not found");
    return apiResponse(res).success(seller, "Seller fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) return apiResponse(res).notFound("Seller not found");
    return apiResponse(res).success(null, "Seller deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!seller) return apiResponse(res).notFound("Seller not found");
    return apiResponse(res).success(seller, "Seller updated successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
