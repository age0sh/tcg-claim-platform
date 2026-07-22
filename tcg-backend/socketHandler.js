const mongoose = require('mongoose'); 
const Card = require('./models/Card');
const Order = require('./models/Order');
const Drop = require('./models/Drop');

module.exports = (io) => {

  // 🛠️ FUNCIONES AUXILIARES
  const emitirMercado = async () => {
    const liveCards = await Card.find({ status: 'en_vivo' });
    const mercado = {};
    liveCards.forEach(c => mercado[c._id] = c); 
    io.emit("actualizar", mercado);
  };

  const emitirPedidos = async () => {
    const pedidos = await Order.find().sort({ createdAt: -1 }); 
    io.emit("pedidos-actualizados", pedidos.map(p => ({ ...p._doc, id: p._id.toString() })));
  };

  const emitirCalendario = async () => {
    try {
      const drops = await Drop.find().lean();
      const calendario = {};
      
      drops.forEach(d => {
        d.id = d._id.toString();
        if (!calendario[d.date]) calendario[d.date] = [];
        calendario[d.date].push(d);
      });
      
      io.emit("calendario-actualizado", calendario);
    } catch (err) {
      console.error("❌ Error al emitir calendario:", err.message);
    }
  };

   io.on('connection', async (socket) => {
    console.log('⚡ Cliente conectado:', socket.id);

    await emitirMercado();
    await emitirPedidos();
    await emitirCalendario();

    socket.on("solicitar-datos", async () => {
      await emitirMercado();
      await emitirPedidos();
      await emitirCalendario();
    });

    // ==========================================
    // 1. CALENDARIO DE DROPS
    // ==========================================
    socket.on("agendar-drop", async ({ date, seller, sellerId, time, description }) => {
      try {
        await Drop.create({ date, seller, sellerId, time, description });
        await emitirCalendario();
      } catch (err) {
        console.error("Error al agendar:", err);
      }
    });

    socket.on("cancelar-drop", async ({ eventId }) => {
      try {
        await Drop.findByIdAndDelete(eventId);
        await emitirCalendario();
      } catch (err) {
        console.error("Error al cancelar:", err);
      }
    });

    socket.on("actualizar-descripcion", ({ userId, descripcion }) => {
      console.log(`📝 Perfil actualizado: ${userId}`);
    });

    // ==========================================
    // 2. PUBLICAR CARTAS AL MERCADO EN VIVO
    // ==========================================
    socket.on("publicar-lote", async ({ cartas, temporizador, sellerId }) => {
      const unlockTime = Date.now() + (temporizador * 1000);
      
      const cardIds = cartas
        .map(c => c._id || c.id)
        .filter(id => mongoose.Types.ObjectId.isValid(id)); 

      if (cardIds.length === 0) return; 

      await Card.updateMany(
        { _id: { $in: cardIds }, sellerId: sellerId },
        { $set: { status: 'en_vivo', unlockTime: unlockTime, claims: [] } }
      );
      
      await emitirMercado();
    });

    // ==========================================
    // 3. MOTOR DE CLAIMS (Ahora acepta userName real)
    // ==========================================
    socket.on("claim", async ({ cardId, userId, userName, clientTime }) => {
      try {
        const now = Date.now();
        const carta = await Card.findById(cardId);

        if (!carta || carta.status !== 'en_vivo' || now < carta.unlockTime || carta.claims.length >= carta.stock || carta.claims.some(c => c.userId === String(userId))) {
            return;
        }

        await Card.findByIdAndUpdate(cardId, {
          $push: {
            claims: {
              userId: String(userId),
              user: userName || "Usuario", // 🔥 GUARDAMOS EL NOMBRE REAL O FALLBACK
              time: (now - clientTime) + "ms",
              winner: true
            }
          }
        });
        
        await emitirMercado();
      } catch (err) {
        console.error("❌ Error en claim:", err.message);
      }
    });

    // ==========================================
    // 4. TERMINAR LOTE Y GENERAR PEDIDOS
    // ==========================================
    socket.on("terminar-claim", async ({ sellerId }) => {
      const sellerCards = await Card.find({ sellerId, status: 'en_vivo' });
      let resumenVentas = {}; 
      let cardsToUpdate = [];

      for (const carta of sellerCards) {
        cardsToUpdate.push(carta._id);

        if (!carta.claims || carta.claims.length === 0) continue;

        for (const claim of carta.claims) {
          
          if (!resumenVentas[claim.userId]) {
            resumenVentas[claim.userId] = {
              sellerId: sellerId,
              buyerId: claim.userId,
              buyerName: claim.user || "Un Coleccionista", // 🔥 PASA EL NOMBRE SEGURO AL RECIBO
              items: [],
              total: 0,
              status: "Pendiente 📦",
              pickupCode: Math.floor(1000 + Math.random() * 9000).toString(),
              rating: null 
            };
          }
          
          resumenVentas[claim.userId].items.push(carta.name);
          resumenVentas[claim.userId].total += carta.price;

          await Card.findByIdAndUpdate(carta._id, {
            status: 'vendido',
            buyerId: claim.userId,
            buyerName: claim.user || "Un Coleccionista"
          });
        }
      }

      const nuevasOrdenes = Object.values(resumenVentas);
      if (nuevasOrdenes.length > 0) {
        await Order.insertMany(nuevasOrdenes);
      }

      if (cardsToUpdate.length > 0) {
        await Card.updateMany({ _id: { $in: cardsToUpdate } }, { status: 'vendido' });
      }

      await emitirMercado();
      await emitirPedidos();
    });

    // ==========================================
    // 5. LOGÍSTICA DE ENTREGAS
    // ==========================================
    socket.on("actualizar-estado-pedido", async ({ pedidoId, nuevoEstado, codigoVerificacion }) => {
      const pedido = await Order.findById(pedidoId);
      
      if (pedido) {
        if (nuevoEstado === "Entregado ✅") {
          if (pedido.pickupCode === codigoVerificacion) {
            pedido.status = nuevoEstado;
            await pedido.save();
            await emitirPedidos();
          } else {
            socket.emit("error-logistica", "El código de verificación es incorrecto. No se pudo entregar.");
          }
        } else {
          pedido.status = nuevoEstado;
          await pedido.save();
          await emitirPedidos();
        }
      }
    });

    socket.on("disconnect", () => console.log("❌ Cliente desconectado:", socket.id));
  });
};