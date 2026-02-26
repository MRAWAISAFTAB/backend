const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel
} = require("../controllers/expenseController.js");

// Add new income
router.post("/add", auth, addExpense);

// Get all income
router.get("/get", auth, getAllExpense);

// Download all income as Excel
router.get("/downloadexcel", auth, downloadExpenseExcel);

// Delete an income by ID

module.exports = router;