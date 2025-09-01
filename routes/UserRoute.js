const express = require('express');
const router = express.Router();
const controller = require('../controller/User');
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars", // folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage ,
  limits: { fileSize: 2 * 1024 * 1024 }
 });

router.post('/signup', controller.signUp);
router.post('/login', controller.login);
router.get("/profile", auth, controller.getProfile);
router.put("/profile/avatar", auth, upload.single("avatar"), controller.updateAvatar);

module.exports = router;
