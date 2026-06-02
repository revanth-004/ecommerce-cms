const Tax = require("../models/Tax");
const apiResponse = require("../utils/apiResponse");

exports.addTax = async (req, res) => {
  try {
    const newTax = new Tax(req.body);
    await newTax.save();
    return apiResponse(res).created(newTax, "Tax created successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getTaxes = async (req, res) => {
  try {
    const filter = {};
    if (req.query.companyId) {
      filter.companyId = req.query.companyId; // filter by companyId if provided
    }
    const taxes = await Tax.find(filter);
    return apiResponse(res).success(taxes, "Taxes fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getTaxById = async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id);
    if (!tax) return apiResponse(res).notFound("Tax not found");
    return apiResponse(res).success(tax, "Tax fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteTax = async (req, res) => {
  try {
    const tax = await Tax.findByIdAndDelete(req.params.id);
    if (!tax) return apiResponse(res).notFound("Tax not found");
    return apiResponse(res).success(null, "Tax deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putTax = async (req, res) => {
  try {
    const tax = await Tax.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tax) return apiResponse(res).notFound("Tax not found");
    return apiResponse(res).success(tax, "Tax updated successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
