const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel
} = require("../controllers/incomeController");

// Add new income
router.post("/add", auth, addIncome);

// Get all income
router.get("/get", auth, getAllIncome);

// Download all income as Excel
router.get("/downloadexcel", auth, downloadIncomeExcel);

// Delete an income by ID
router.delete("/:id", auth, deleteIncome);

module.exports = router;