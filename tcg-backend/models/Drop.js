const mongoose = require('mongoose');

const dropSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Guardará la fecha en formato "2026-07-22"
  seller: { type: String, required: true },
  sellerId: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Drop', dropSchema);