require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const path = require("path");
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middleware to handle image uploads
// app.use("/api/upload", uploadRoutes);


// Middleware to handle cors

// const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173", // your Vite frontend
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true // required for cookies
}));

app.use(express.json());
app.use(cookieParser())

connectDB()

app.use("/api", authRoutes)
app.use("/api/income", incomeRoutes)
app.use("/api/expense", expenseRoutes)
app.use("/dashboard", dashboardRoutes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})