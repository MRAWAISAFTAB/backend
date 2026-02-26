const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const { registerUser, loginUser, getUserInfo, logout } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const {changePassword} = require("../controllers/authController");


// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/getUser/:id", auth, getUserInfo);
router.post("/change-password", auth, changePassword);

// Multer storage config
const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = file.fieldname + "-" + Date.now() + ext;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

// Upload route (protected)
router.post("/upload", auth, upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).send({ message: "No file uploaded" });

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { profileImageUrl: req.file.path.replace(/\\/g, "/") }, // ✅
        { new: true }
    );

    res.status(200).send({
        message: "Profile image uploaded",
        profileImageUrl: updatedUser.profileImageUrl
    });
});

module.exports = router;