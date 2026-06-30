const { createServer } = require("http");
const { Server } = require("socket.io");

// Detecta el puerto que asigna la nube, o usa el 4000 si estás en tu PC
const PORT = process.env.PORT || 4000;

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

let mercado = {}; 
let lastClaim = {};
let pedidos = []; 
// 🔥 Nueva base de datos en memoria para el Calendario
let dropsAgendados = {};

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);
  
  socket.emit("estado-inicial", mercado);
  socket.emit("pedidos-actualizados", pedidos);
  // 🔥 Enviamos el calendario actual al conectarse
  socket.emit("calendario-actualizado", dropsAgendados);

  // 📅 AGENDAR O EDITAR DROP
  socket.on("agendar-drop", ({ day, seller, sellerId, time, items }) => {
    // 🛡️ BARRERA DE SEGURIDAD: Si el día ya está ocupado por OTRO vendedor, lo bloqueamos
    if (dropsAgendados[day] && dropsAgendados[day].sellerId !== sellerId) {
      return; 
    }
    
    dropsAgendados[day] = { seller, sellerId, time, items };
    io.emit("calendario-actualizado", dropsAgendados);
  });

  // 🗑️ CANCELAR DROP
  socket.on("cancelar-drop", ({ day, sellerId }) => {
    // Solo borramos si el que lo pide es el dueño real
    if (dropsAgendados[day] && dropsAgendados[day].sellerId === sellerId) {
      delete dropsAgendados[day];
      io.emit("calendario-actualizado", dropsAgendados);
    }
  });

  // 📦 RECIBIR NUEVAS CARTAS DEL VENDEDOR
  socket.on("publicar-lote", ({ cartas, temporizador, sellerId, sellerName }) => {
    const unlockTime = Date.now() + (temporizador * 1000);
    cartas.forEach((carta) => {
      const cardId = sellerId + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      mercado[cardId] = {
        id: cardId,
        name: carta.name,
        price: carta.price,
        language: carta.lang,
        rarity: carta.rarity,
        category: carta.category,
        set: carta.set,
        sellerId: sellerId,
        sellerName: sellerName || "Vendedor Anónimo",
        stock: parseInt(carta.stock) || 1,
        unlockTime: unlockTime,
        claims: []
      };
    });
    io.emit("actualizar", mercado);
  });

  // ⚡ RECIBIR INTENTO DE CLAIM
  socket.on("claim", ({ cardId, userId, clientTime }) => {
    const now = Date.now();
    const carta = mercado[cardId];

    if (!carta || now < carta.unlockTime || (lastClaim[userId] && now - lastClaim[userId] < 1000) || carta.claims.length >= carta.stock || carta.claims.some(c => c.userId === userId)) return;

    lastClaim[userId] = now;
    carta.claims.push({
      id: now + Math.random(),
      userId: userId,
      user: userId.substring(0, 8),
      time: (now - clientTime) + "ms",
      winner: true
    });
    io.emit("actualizar", mercado);
  });

  // 🛑 TERMINAR CLAIM Y GENERAR PEDIDOS
  socket.on("terminar-claim", ({ sellerId }) => {
    const sellerCards = Object.values(mercado).filter(c => c.sellerId === sellerId);
    let resumenVentas = {}; 

    sellerCards.forEach(carta => {
      carta.claims.forEach(claim => {
        if (!resumenVentas[claim.userId]) {
          resumenVentas[claim.userId] = {
            id: "PED_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            sellerId: sellerId,
            buyerId: claim.userId,
            buyerName: claim.user,
            items: [],
            total: 0,
            status: "Pendiente 📦",
            // 🔥 Generamos un código de verificación aleatorio de 4 dígitos
            pickupCode: Math.floor(1000 + Math.random() * 9000).toString(),
            rating: null // Para guardar la valoración del comprador después
          };
        }
        const precioNumerico = parseInt(carta.price.replace(/\D/g, "")) || 0;
        resumenVentas[claim.userId].items.push(carta.name);
        resumenVentas[claim.userId].total += precioNumerico;
      });
      delete mercado[carta.id];
    });

    Object.values(resumenVentas).forEach(pedido => pedidos.push(pedido));
    io.emit("actualizar", mercado);
    io.emit("pedidos-actualizados", pedidos);
  });

  // 🚚 ACTUALIZAR ESTADO DEL PEDIDO CON VALIDACIÓN DE CÓDIGO
  socket.on("actualizar-estado-pedido", ({ pedidoId, nuevoEstado, codigoVerificacion }) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido) {
      // 🛡️ Si intentan marcar como entregado, el código DEBE coincidir
      if (nuevoEstado === "Entregado ✅") {
        if (pedido.pickupCode === codigoVerificacion) {
          pedido.status = nuevoEstado;
          io.emit("pedidos-actualizados", pedidos);
        } else {
          // Si el código falla, le avisamos exclusivamente al vendedor que falló
          socket.emit("error-logistica", "El código de verificación es incorrecto. No se pudo entregar.");
        }
      } else {
        // Para cualquier otro estado (Enviado, Listo en local), cambia directo sin código
        pedido.status = nuevoEstado;
        io.emit("pedidos-actualizados", pedidos);
      }
    }
  });

  // ⭐ GUARDAR VALORACIÓN DEL VENDEDOR
  socket.on("valorar-pedido", ({ pedidoId, estrellas }) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido && pedido.status === "Entregado ✅") {
      pedido.rating = estrellas;
      io.emit("pedidos-actualizados", pedidos);
    }
  });

  socket.on("disconnect", () => console.log("Usuario desconectado:", socket.id));
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor de WebSockets corriendo en el puerto ${PORT}`);
});