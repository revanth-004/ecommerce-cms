const Specification = require("../models/Specification");
const apiResponse = require("../utils/apiResponse");

exports.addSpecification = async (req, res) => {
  try {
    const newSpecification = new Specification(req.body);
    await newSpecification.save();
    return apiResponse(res).created(
      newSpecification,
      "Specification created successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getSpecifications = async (req, res) => {
  try {
    const { companyId, brandId } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (brandId) filter.brandId = brandId;

    const specifications = await Specification.find(filter);
    return apiResponse(res).success(
      specifications,
      "Specifications fetched successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getSpecificationById = async (req, res) => {
  try {
    const specification = await Specification.findById(req.params.id);
    if (!specification)
      return apiResponse(res).notFound("Specification not found");
    return apiResponse(res).success(
      specification,
      "Specification fetched successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteSpecification = async (req, res) => {
  try {
    const specification = await Specification.findByIdAndDelete(req.params.id);
    if (!specification)
      return apiResponse(res).notFound("Specification not found");
    return apiResponse(res).success(null, "Specification deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putSpecification = async (req, res) => {
  try {
    const specification = await Specification.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!specification)
      return apiResponse(res).notFound("Specification not found");
    return apiResponse(res).success(
      specification,
      "Specification updated successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
