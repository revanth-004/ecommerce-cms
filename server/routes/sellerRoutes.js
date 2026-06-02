const express = require("express");
const router = express.Router();
const Seller = require("../models/Seller");

const {
  addSeller,
  getSellers,
  getSellerById,
  deleteSeller,
  putSeller,
} = require("../controllers/sellerController");

router.post("/", addSeller);
router.get("/", getSellers);
router.get("/:id", getSellerById);
router.delete("/:id", deleteSeller);
router.put("/:id", putSeller);

module.exports = router;
