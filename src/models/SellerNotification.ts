const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { 
        type: String, 
        enum: ['new_order', 'low_stock', 'payout_processed', 'policy_update', 'customer_msg'] 
    },
    title: String,
    message: String,
    link: String,     // Redirects seller to the specific order or product page
    isRead: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, { timestamps: true });

module.exports= mongoose.model("SellerNotification",notificationSchema)