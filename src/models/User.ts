const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // --- CORE IDENTITY ---
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: String, required: true, unique: true },
    avatar: { type: String, default: "https://example.com/default-avatar.png" },
    role: { 
        type: String, 
        enum: ['customer', 'seller', 'admin', 'moderator'], 
        default: 'customer' 
    },

    // --- SECURITY & VERIFICATION ---
    isVerified: { type: Boolean, default: false },
    verificationMethods: {
        emailVerified: { type: Boolean, default: false },
        phoneVerified: { type: Boolean, default: false },
        otp: { code: String, expiresAt: Date }
    },

    // --- CUSTOMER SPECIFIC (Wishlist & Behavior) ---
    customerProfile: {
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        loyaltyPoints: { type: Number, default: 0 },
        membershipLevel: { type: String, enum: ['silver', 'gold', 'platinum'], default: 'silver' },
        savedPaymentMethods: [{
            provider: String, // e.g., "bKash"
            maskedNumber: String, // e.g., "017****1234"
            token: String // For recurring payments/one-click checkout
        }]
    },

    // --- SELLER SPECIFIC (The Marketplace Layer) ---
    sellerProfile: {
        shopName: { type: String, sparse: true },
        shopSlug: { type: String, sparse: true, unique: true },
        shopLogo: String,
        shopDescription: String,
        isOfficialStore: { type: Boolean, default: false }, // Like "Daraz Mall"
        rating: { average: Number, count: Number },
        legal: {
            tradeLicense: String, // URL to document
            binNumber: String,    // Business Identification Number
            bankAccount: {
                holderName: String,
                accountNumber: String,
                bankName: String,
                branchName: String
            }
        },
        performanceMetrics: {
            cancellationRate: { type: Number, default: 0 },
            onTimeShipment: { type: Number, default: 0 }
        }
    },

    // --- LOGISTICS (Multiple Addresses) ---
    addresses: [{
        label: { type: String, enum: ['home', 'office', 'other'] },
        fullName: String,
        phone: String,
        division: String, // e.g., "Dhaka"
        city: String,     // e.g., "Dhaka North"
        area: String,     // e.g., "Banani"
        fullAddress: String,
        isDefault: { type: Boolean, default: false }
    }],

    status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' }

}, { timestamps: true });

// Indexing for search performance
userSchema.index({ email: 1, phoneNumber: 1 });
userSchema.index({ "sellerProfile.shopSlug": 1 });

module.exports = mongoose.model('User', userSchema);