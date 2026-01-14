const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MyPlantSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  nickname: String,
  purchaseDate: { type: Date, default: Date.now },
  reminders: [{ type: Date }]
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
password: {
  type: String,
  required: true,
  select: false,
},
resetPasswordToken: String,
resetPasswordExpire: Date,

  // Role: user/seller/admin
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
sellerStatus: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},
sellerApprovedAt: Date,
shopName: String,
documents: [{ url: String, name: String }],

   isActive: {
      type: Boolean,
      default: true,     // ✅ ENABLED BY DEFAULT
    },
  // User profile fields
  address: {
    city: String,
    state: String,
    pincode: String,
    line1: String,
    district: String
  },
  phone: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

  myPlants: [MyPlantSchema],
  

settings: {
  darkMode: { type: Boolean, default: false },
  emailNotifications: { type: Boolean, default: true },
  orderUpdates: { type: Boolean, default: true },
  aiReports: { type: Boolean, default: true },
},


  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', UserSchema);
