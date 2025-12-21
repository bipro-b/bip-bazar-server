const mongoose = require("mongoose");

const platformStatsSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true }, // YYYY-MM-DD
    metrics: {
        totalGmv: { type: Number, default: 0 },       // Gross Merchandise Value
        totalOrders: { type: Number, default: 0 },
        newUsers: { type: Number, default: 0 },
        newSellers: { type: Number, default: 0 },
        activeListings: { type: Number, default: 0 }
    },
    topSellingCategories: [{
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        revenue: Number
    }],
    geographicData: [{
        division: String, // e.g., Dhaka, Chittagong
        orderCount: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model("PlatformStat", platformStatsSchema)