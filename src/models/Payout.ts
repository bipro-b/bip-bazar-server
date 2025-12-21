const mongoose = require("mongoose")

const payoutSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    payoutId: { type: String, unique: true }, // e.g., PAY-2025-001
    
    amount: {
        gross: Number,      // Total money from orders
        commission: Number, // What you take (e.g., 10%)
        shipping: Number,   // Deducted if you provide logistics
        net: Number         // Final amount sent to seller
    },
    
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Orders included in this batch
    
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'completed', 'failed'], 
        default: 'pending' 
    },
    
    paymentMethod: {
        type: { type: String, enum: ['bank_transfer', 'bkash', 'nagad'] },
        reference: String // Transaction ID from the bank/gateway
    },
    
    paidAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Payout", payoutSchema);