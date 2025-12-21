const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, lowercase: true }, // e.g., "electronics-gadgets"
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null } // For sub-categories
});

module.exports = mongoose.model('Category', categorySchema);