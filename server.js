require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors({
  origin: "https://frontend-two-xi-28.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes); // ✅ fixed
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("hello world!");
});

// ✅ Required for Vercel — export instead of listen
module.exports = app;