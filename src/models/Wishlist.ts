const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    customer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        index: true // Fast lookup for specific customers
    },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        addedAt: { type: Date, default: Date.now },
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
    }]
}, { timestamps: true });

// Ensure one wishlist document per user
wishlistSchema.index({ customer: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);