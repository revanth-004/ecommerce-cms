const express = require("express");
const router = express.Router();
const CMS = require("../models/CMS");

const {
  postCMS,
  getCMS,
  getCMSById,
  deleteCMS,
  putCMS,
} = require("../controllers/cmsController");

router.post("/", postCMS);
router.get("/", getCMS);
router.get("/:id", getCMSById);
router.delete("/:id", deleteCMS);
router.put("/:id", putCMS);

module.exports = router;
