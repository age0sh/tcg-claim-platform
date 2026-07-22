require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Necesario para levantar el servidor de sockets
const { Server } = require('socket.io'); // Librería de tiempo real

const app = express();
const server = http.createServer(app); // Creamos el servidor HTTP
const io = new Server(server, { 
    cors: { origin: "*" } // Permitimos que tu frontend de Next.js se conecte
});

// ################# MIDDLEWARES #################
app.use(cors());
app.use(express.json());

// Inyectamos la instancia de 'io' en el objeto request (req)
// Esto permite que tus rutas puedan emitir mensajes (ej. req.io.emit)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ################# CONEXIÓN MONGODB #################
mongoose.connect(process.env.MONGO_URI)
  .then(async () => { // <-- Le agregamos "async" aquí
    console.log('✅ MongoDB Conectado');

    // 🔥 LA CURA: Borramos el índice viejo "day_1" que estaba causando el error
    const Drop = require('./models/Drop');
    await Drop.syncIndexes();
    console.log("🧹 Reglas del calendario actualizadas en MongoDB");
  })
  .catch(err => console.error('❌ Error de conexión:', err));
// ################# RUTAS #################
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/seller', require('./routes/sellerRoutes')); // Aquí conectamos las nuevas rutas

// ################# SOCKETS (Tiempo Real) #################
// Importamos y ejecutamos la lógica de sockets
require('./socketHandler')(io);

// ################# INICIAR SERVIDOR #################
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor encendido en http://localhost:${PORT}`);
});

