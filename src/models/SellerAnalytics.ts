const mongoose = require("mongoose");

const sellerAnalyticsSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    dailyStats: [{
        date: String, // YYYY-MM-DD
        revenue: Number,
        ordersCount: Number,
        cancelledOrders: Number,
        pageViews: Number // Clicks on their shop page
    }],
    
    topProducts: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        soldCount: Number,
        revenue: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model("SellerAnalytics", sellerAnalyticsSchema);