const express = require("express");
const auth = require("../middleware/authMiddleware.js");
const { getDashboardData } = require("../controllers/dashboardController.js");
const router = express.Router();
router.get("/", auth, getDashboardData);
module.exports = router;