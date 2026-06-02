const express = require("express");
const router = express.Router();
const Specification = require("../models/Specification");

const {
  addSpecification,
  getSpecifications,
  getSpecificationById,
  deleteSpecification,
  putSpecification,
} = require("../controllers/SpecificationController");

router.post("/", addSpecification);
router.get("/", getSpecifications);
router.get("/:id", getSpecificationById);
router.delete("/:id", deleteSpecification);
router.put("/:id", putSpecification);

module.exports = router;
