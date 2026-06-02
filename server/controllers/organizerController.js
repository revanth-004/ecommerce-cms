const Organizer = require("../models/Organizer");
const apiResponse = require("../utils/apiResponse");

exports.addOrganizer = async (req, res) => {
  try {
    const newOrganizer = new Organizer(req.body);
    await newOrganizer.save();
    return apiResponse(res).created(
      newOrganizer,
      "Organizer created successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find();
    return apiResponse(res).success(
      organizers,
      "Organizers fetched successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.getOrganizerById = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) return apiResponse(res).notFound("Organizer not found");
    return apiResponse(res).success(
      organizer,
      "Organizer fetched successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.deleteOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.findByIdAndDelete(req.params.id);
    if (!organizer) return apiResponse(res).notFound("Organizer not found");
    return apiResponse(res).success(null, "Organizer deleted successfully");
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};

exports.putOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!organizer) return apiResponse(res).notFound("Organizer not found");
    return apiResponse(res).success(
      organizer,
      "Organizer updated successfully",
    );
  } catch (err) {
    return apiResponse(res).error(err.message);
  }
};
