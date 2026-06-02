const express = require("express");
const router = express.Router();
const Hsn = require("../models/Hsn");

const {
  addHsn,
  getHsn,
  getHsnById,
  deleteHsn,
  putHsn,
} = require("../controllers/HsnController");

router.post("/", addHsn);
router.get("/", getHsn);
router.get("/:id", getHsnById);
router.delete("/:id", deleteHsn);
router.put("/:id", putHsn);

module.exports = router;
