const Hsn = require("../models/Hsn");
const apiResponse = require("../utils/apiResponse");

exports.addHsn = async (req, res) => {
  try {
    const newHsn = new Hsn(req.body);
    await newHsn.save();
    return apiResponse(res).created(newHsn, "Hsn created successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getHsn = async (req, res) => {
  try {
    const filter = {};
    if (req.query.companyId) {
      filter.companyId = req.query.companyId; // filter by companyId if provided
    }
    const hsn = await Hsn.find(filter);
    return apiResponse(res).success(hsn, "HSN fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getHsnById = async (req, res) => {
  try {
    const hsn = await Hsn.findById(req.params.id);
    if (!hsn) return apiResponse(res).notFound("HSN not found");
    return apiResponse(res).success(hsn, "HSN fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteHsn = async (req, res) => {
  try {
    const hsn = await Hsn.findByIdAndDelete(req.params.id);
    if (!hsn) return apiResponse(res).notFound("HSN not found");
    return apiResponse(res).success(null, "HSN deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putHsn = async (req, res) => {
  try {
    const hsn = await Hsn.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hsn) return apiResponse(res).notFound("HSN not found");
    return apiResponse(res).success(hsn, "HSN updated successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
