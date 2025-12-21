const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true }, // Customer facing ID (e.g., #BD-100234)
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    
    // 1. SPLIT SHIPMENT LOGIC
    // Grouping items by seller allows independent shipping/returns per seller
    sellerGroups: [{
        seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        items: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            name: String, // Snapshot in case price/name changes later
            quantity: Number,
            price: Number,
            tax: Number,
            shippingCost: Number
        }],
        subTotal: Number,
        fulfillmentStatus: {
            type: String,
            enum: ["pending", "packed", "shipped", "delivered", "returned", "refunded"],
            default: "pending"
        },
        tracking: {
            carrier: String, // e.g., "RedX", "Pathao"
            id: String,
            url: String
        }
    }],

    // 2. DETAILED LOGISTICS & ADDRESS
    shippingAddress: {
        fullName: String,
        phone: String,
        alternativePhone: String,
        area: String, // For Bangladesh: Dhaka City, Chittagong, etc.
        zone: String, // Specific delivery zone for logistics APIs
        fullAddress: String,
        landmark: String,
        addressType: { type: String, enum: ["home", "office"] }
    },

    // 3. FINANCIALS & TAXATION
    pricing: {
        itemsTotal: Number,
        shippingTotal: Number,
        taxTotal: Number,
        discountTotal: Number,
        couponUsed: String,
        grandTotal: Number
    },

    // 4. RETURNS & DISPUTES (The "Amazon" Layer)
    returnInfo: {
        isReturnable: { type: Boolean, default: true },
        returnRequested: { type: Boolean, default: false },
        reason: String,
        condition: { type: String, enum: ["sealed", "opened", "damaged"] },
        refundStatus: { type: String, enum: ["not_applicable", "pending", "processed", "rejected"] },
        refundTransactionId: String,
        evidencePhotos: [String] // URLs of damaged product photos
    },

   ratingSummary: {
        averageRating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
        starsCount: {
            1: { type: Number, default: 0 },
            2: { type: Number, default: 0 },
            3: { type: Number, default: 0 },
            4: { type: Number, default: 0 },
            5: { type: Number, default: 0 }
        }
    },
    
    history: [{
        status: String,
        timestamp: Date,
        comment: String 
    }]

}, { timestamps: true });

orderSchema.index({ "sellerGroups.seller": 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);