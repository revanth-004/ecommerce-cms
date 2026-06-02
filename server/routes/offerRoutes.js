const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");

const {
  postOffers,
  getOffers,
  getOfferById,
  deleteOffer,
  putOffer,
} = require("../controllers/OfferController");

router.post("/", postOffers);
router.get("/", getOffers);
router.get("/:id", getOfferById);
router.delete("/:id", deleteOffer);
router.put("/:id", putOffer);

module.exports = router;
