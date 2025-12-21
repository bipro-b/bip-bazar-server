const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, unique: true, required: true }, // From Gateway
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    amount: {
        total: { type: Number, required: true },
        currency: { type: String, default: "BDT" },
        gatewayFee: Number // What bKash/Nagad charged you
    },
    
    paymentMethod: {
        provider: { type: String, enum: ["bkash", "nagad", "card", "cod"] },
        accountNumber: String, // e.g. "017XXXXX123"
    },

    status: {
        type: String,
        enum: ["pending", "success", "failed", "reversed"],
        default: "pending"
    },

    // Raw response from the payment gateway for auditing
    gatewayRawResponse: Object,
    
    paidAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);