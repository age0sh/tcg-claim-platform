const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  sellerId: { type: String, required: true },
  buyerId: { type: String, required: true },
  buyerName: { type: String, default: 'Un Coleccionista' }, // 🔥 AHORA ES 100% SEGURO
  items: [{ type: String }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pendiente 📦' },
  pickupCode: { type: String, required: true },
  rating: { type: Number, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);