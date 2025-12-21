const mongoose = require("mongoose")

const promotionSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, unique: true, uppercase: true }, // e.g., WINTER20
    description: String,
    
    discountType: { type: String, enum: ['percentage', 'fixed_amount'], default: 'percentage' },
    discountValue: Number,
    
    conditions: {
        minPurchase: { type: Number, default: 0 },
        maxDiscount: Number, // Cap for percentage discounts
        usageLimit: Number,  // Total times this coupon can be used
        limitPerUser: { type: Number, default: 1 }
    },
    
    isActive: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Promotion", promotionSchema);