const {model, Schema}= require("mongoose")

const vendorSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  shopName: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true }, 
  logo: String,
  banner: String,
  description: String,
  isVerified: { type: Boolean, default: false },
  commissionRate: { type: Number, default: 10 },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    routingNumber: String
  },
  status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'pending' }
}, { timestamps: true });

module.exports= model('Vendor', vendorSchema);