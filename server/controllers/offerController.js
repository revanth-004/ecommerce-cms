const Offer = require("../models/Offer");
const apiResponse = require("../utils/apiResponse");

exports.postOffers = async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    await newOffer.save();
    return apiResponse(res).created(newOffer, "Offer created successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getOffers = async (req, res) => {
  try {
    const { companyId, brandId, ids } = req.query;
    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (brandId) filter.brandId = brandId;

    if (ids) {
      const idArray = ids.split(",");
      filter._id = { $in: idArray };
    }

    const offers = await Offer.find(filter);
    return apiResponse(res).success(offers, "Offers fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return apiResponse(res).notFound("Offer not found");
    return apiResponse(res).success(offer, "Offer fetched successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return apiResponse(res).notFound("Offer not found");
    return apiResponse(res).success(null, "Offer deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!offer) return apiResponse(res).notFound("Offer not found");
    return apiResponse(res).success(offer, "Offer updated successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
