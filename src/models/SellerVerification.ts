const mongoose = require("mongoose");

const sellerVerificationSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    documents: [{
        docType: { type: String, enum: ['NID', 'Trade_License', 'BIN_Certificate'] },
        fileUrl: String,
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        adminComment: String
    }],
    verificationStatus: { 
        type: String, 
        enum: ['unverified', 'partially_verified', 'verified'], 
        default: 'unverified' 
    },
    appliedAt: { type: Date, default: Date.now },
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // The Admin ID
});

module.exports = mongoose.model("SellerVerification", sellerVerificationSchema)