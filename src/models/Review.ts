const mongoose= require("mongoose");

const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Links to order to show "Verified Purchase"
    
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    images: [String], // Customers can upload photos of the received product
    
    // Amazon-style "Was this helpful?"
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    // Seller's reply
    sellerReply: {
        comment: String,
        repliedAt: Date
    },
    
    status: { type: String, enum: ['pending', 'published', 'flagged'], default: 'published' }
}, { timestamps: true });

// Ensure a user can only review a product once
reviewSchema.index({ product: 1, customer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);