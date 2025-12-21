const mongoose = require("mongoose")
const sellerDashboardSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    // SHOP SETTINGS
    shopConfig: {
        vacationMode: { type: Boolean, default: false }, // Disables "Buy" button temporarily
        minOrderValue: { type: Number, default: 0 },
        returnPolicy: String,
        isSelfShipping: { type: Boolean, default: false } // Admin shipping vs Seller shipping
    },
    
    // ANCHORED ANALYTICS (Updated via Daily Cron)
    performance: {
        totalRevenue: { type: Number, default: 0 },
        orderCancellationRate: { type: Number, default: 0 },
        averageProcessingTime: Number, // Time from Order to "Shipped"
        topSellingProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
    }
}, { timestamps: true });

module.exports = mongoose.model('SellerDashboard', sellerDashboardSchema);