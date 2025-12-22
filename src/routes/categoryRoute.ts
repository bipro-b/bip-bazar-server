const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.route("/")
    .get(categoryController.getAllCategories)
    .post(protect, authorize('seller'), categoryController.createCategory);

module.exports = router;