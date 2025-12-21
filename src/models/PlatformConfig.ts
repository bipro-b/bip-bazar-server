const mongoose = require("mongoose")

const platformConfigSchema = new mongoose.Schema({
    general: {
        siteName: { type: String, default: "MyDropShip" },
        supportEmail: String,
        maintenanceMode: { type: Boolean, default: false }
    },
    fees: {
        defaultCommissionRate: { type: Number, default: 10 }, // 10%
        paymentGatewayFee: { type: Number, default: 2.5 }    // bKash/Nagad fee
    },
    logistics: {
        deliveryChargeInsideDhaka: { type: Number, default: 60 },
        deliveryChargeOutsideDhaka: { type: Number, default: 120 }
    }
});

module.exports = mongoose.model("PlatformConfig", platformConfigSchema);