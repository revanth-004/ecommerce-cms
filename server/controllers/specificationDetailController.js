const SpecificationDetail = require("../models/SpecificationDetail");
const apiResponse = require("../utils/apiResponse");

exports.addSpecificationDetail = async (req, res) => {
  try {
    const newSpecificationDetail = new SpecificationDetail(req.body);
    await newSpecificationDetail.save();
    return apiResponse(res).created(
      newSpecificationDetail,
      "SpecificationDetail created successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getSpecificationDetails = async (req, res) => {
  try {
    const { companyId, brandId, specificationId } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (brandId) filter.brandId = brandId;
    if (specificationId) filter.specificationId = specificationId;

    const specificationDetails = await SpecificationDetail.find(filter);
    return apiResponse(res).success(
      specificationDetails,
      "SpecificationDetails fetched successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getSpecificationDetailById = async (req, res) => {
  try {
    const specificationDetail = await SpecificationDetail.findById(
      req.params.id,
    );
    if (!specificationDetail)
      return apiResponse(res).notFound("SpecificationDetail not found");
    return apiResponse(res).success(
      specificationDetail,
      "SpecificationDetail fetched successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteSpecificationDetail = async (req, res) => {
  try {
    const specificationDetail = await SpecificationDetail.findByIdAndDelete(
      req.params.id,
    );
    if (!specificationDetail)
      return apiResponse(res).notFound("SpecificationDetail not found");
    return apiResponse(res).success(
      null,
      "SpecificationDetail deleted successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putSpecificationDetail = async (req, res) => {
  try {
    const specificationDetail = await SpecificationDetail.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!specificationDetail)
      return apiResponse(res).notFound("SpecificationDetail not found");
    return apiResponse(res).success(
      specificationDetail,
      "SpecificationDetail updated successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
