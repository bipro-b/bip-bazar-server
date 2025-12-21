const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    customer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true, // One active cart per user
        index: true 
    },
    // Grouping by seller at the schema level for faster UI rendering
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        quantity: { type: Number, required: true, min: 1 },
        
        // SNAPSHOT DATA: Important for "Amazon-grade" reliability
        // Copy these so the cart stays fast without multiple DB lookups
        priceAtAdd: Number, 
        titleSnapshot: String,
        imageSnapshot: String,
        
        selectedAttributes: [{ name: String, value: String }] // e.g., Size: XL, Color: Blue
    }],
    
    // Summary fields updated via Middleware to keep the UI snappy
    cartStats: {
        totalItems: { type: Number, default: 0 },
        totalPrice: { type: Number, default: 0 }
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);