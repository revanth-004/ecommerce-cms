const Customer = require("../models/Customer");
const apiResponse = require("../utils/apiResponse");

exports.addCustomer = async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    return apiResponse(res).created(
      newCustomer,
      "Customer created successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const { companyId, brandId, ids } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (brandId) filter.brandId = brandId;

    if (ids) {
      const idArray = ids.split(",");
      filter._id = { $in: idArray };
    }
    const customers = await Customer.find(filter);
    return apiResponse(res).success(
      customers,
      "Customers fetched successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return apiResponse(res).notFound("Customer not found");
    return apiResponse(res).success(customer, "Customer fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return apiResponse(res).notFound("Customer not found");
    return apiResponse(res).success(null, "Customer deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) return apiResponse(res).notFound("Customer not found");
    return apiResponse(res).success(customer, "Customer updated successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
