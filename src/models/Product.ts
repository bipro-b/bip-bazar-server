const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'pending'},
    tags:[String],

    slug: { type: String, required: true, unique: true, index: true }, 
    metaTitle: String,
    metaDescription: String,
    searchKeywords: [String], 
    
    isSponsored: { type: Boolean, default: false },
    adWeight: { type: Number, default: 0 }, 
    organicScore: { type: Number, default: 0 }, 
    
   
    stats: {
        totalImpressions: { type: Number, default: 0 },
        totalClicks: { type: Number, default: 0 },
        totalOrders: { type: Number, default: 0 },
        ctr: { type: Number, default: 0 } 
    },
    
    commissionRate: { type: Number, default: 10 }, 
    brand: { type: String, index: true },
    specifications: [{ key: String, value: String }]



}, { timestamps: true });

productSchema.index({ "stats.totalOrders": -1, "stats.totalClicks": -1 });
productSchema.index({ isSponsored: -1, adWeight: -1 });

module.exports = mongoose.model('Product', productSchema);