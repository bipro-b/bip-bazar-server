const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['view', 'click', 'add_to_cart','ordered'], required: true },
    source: { type: String, enum: ['search', 'organic', 'sponsored', 'home_page'] },
    metadata: {
        ip: String,
        userAgent: String,
        searchTerm: String // What the user searched to find this
    }
}, { timestamps: true });

module.exports = mongoose.model("Interation", interactionSchema);