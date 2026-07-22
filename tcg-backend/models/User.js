const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true // Elimina espacios en blanco al inicio o final
  },
  nombres: { type: String, required: true, trim: true },
  apellidos: { type: String, required: true, trim: true },
  ciudad: { type: String, required: true },
  correo: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, // ¡IMPORTANTE! Guarda siempre el correo en minúsculas
    trim: true 
  },
  password: { type: String, required: true }, 
  rol: { 
    type: String, 
    enum: ['comprador', 'vendedor', 'admin', 'premium'], 
    default: 'comprador' 
  },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);