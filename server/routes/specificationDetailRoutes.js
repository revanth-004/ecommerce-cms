const express = require("express");
const router = express.Router();
const SpecificationDetail = require("../models/SpecificationDetail");

const {
  addSpecificationDetail,
  getSpecificationDetails,
  getSpecificationDetailById,
  deleteSpecificationDetail,
  putSpecificationDetail,
} = require("../controllers/SpecificationDetailController");

router.post("/", addSpecificationDetail);
router.get("/", getSpecificationDetails);
router.get("/:id", getSpecificationDetailById);
router.delete("/:id", deleteSpecificationDetail);
router.put("/:id", putSpecificationDetail);

module.exports = router;
