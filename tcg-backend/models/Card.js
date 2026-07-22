const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  language: { type: String, required: true },
  rarity: { type: String, required: true },
  category: { type: String, enum: ['Pokemon', 'Trainer', 'Item', 'Stadium'], required: true },
  collectionName: { type: String, required: true },
  stock: { type: Number, default: 1 },
  condition: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  status: { type: String, enum: ['inventario', 'en_vivo', 'vendido'], default: 'inventario' },
  buyerId: { type: String, default: null },
  buyerName: { type: String, default: null },
  
  // 🔥 NUEVO: Controles para la subasta en vivo
  unlockTime: { type: Number, default: 0 },
  claims: [{
    userId: { type: String },
    user: { type: String },
    time: { type: String },
    winner: { type: Boolean }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);