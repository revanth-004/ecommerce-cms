const CMS = require("../models/CMS");
const apiResponse = require("../utils/apiResponse");

exports.postCMS = async (req, res) => {
  try {
    const newCMS = new CMS(req.body);
    await newCMS.save();
    return apiResponse(res).created(newCMS, "CMS created successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getCMS = async (req, res) => {
  try {
    const filter = {};
    if (req.query.companyId) {
      filter.companyId = req.query.companyId; // filter by companyId if provided
    }
    const cms = await CMS.find(filter);
    return apiResponse(res).success(cms, "CMS fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getCMSById = async (req, res) => {
  try {
    const cms = await CMS.findById(req.params.id);
    if (!cms) return apiResponse(res).notFound("CMS not found");
    return apiResponse(res).success(cms, "CMS fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteCMS = async (req, res) => {
  try {
    const cms = await CMS.findByIdAndDelete(req.params.id);
    if (!cms) return apiResponse(res).notFound("CMS not found");
    return apiResponse(res).success(null, "CMS deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putCMS = async (req, res) => {
  try {
    const cms = await CMS.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cms) return apiResponse(res).notFound("CMS not found");
    return apiResponse(res).success(cms, "CMS updated successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
