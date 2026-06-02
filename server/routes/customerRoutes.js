const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

const {
  addCustomer,
  getCustomers,
  getCustomerById,
  deleteCustomer,
  putCustomer,
} = require("../controllers/CustomerController");

router.post("/", addCustomer);
router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.delete("/:id", deleteCustomer);
router.put("/:id", putCustomer);

module.exports = router;
