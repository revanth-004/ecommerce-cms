const express = require("express");
const router = express.Router();
const Organizer = require("../models/Organizer");

const {
  addOrganizer,
  getOrganizers,
  getOrganizerById,
  deleteOrganizer,
  putOrganizer,
} = require("../controllers/organizerController");

router.post("/", addOrganizer);
router.get("/", getOrganizers);
router.get("/:id", getOrganizerById);
router.delete("/:id", deleteOrganizer);
router.put("/:id", putOrganizer);

module.exports = router;
