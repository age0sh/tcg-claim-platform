const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

let mercado = {}; 
let lastClaim = {};
// 🔥 Nueva base de datos en memoria para los pedidos terminados
let pedidos = []; 

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);
  
  socket.emit("estado-inicial", mercado);
  socket.emit("pedidos-actualizados", pedidos);

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
    let resumenVentas = {}; // Agruparemos por comprador (userId)

    sellerCards.forEach(carta => {
      carta.claims.forEach(claim => {
        // Si es la primera carta que gana este usuario, le creamos su "carrito"
        if (!resumenVentas[claim.userId]) {
          resumenVentas[claim.userId] = {
            id: "PED_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            sellerId: sellerId,
            buyerId: claim.userId,
            buyerName: claim.user,
            items: [],
            total: 0,
            status: "Pendiente 📦"
          };
        }
        
        // Limpiamos el símbolo de moneda para sumar números reales
        const precioNumerico = parseInt(carta.price.replace(/\D/g, "")) || 0;
        
        resumenVentas[claim.userId].items.push(carta.name);
        resumenVentas[claim.userId].total += precioNumerico;
      });

      // Eliminamos la carta del mercado público
      delete mercado[carta.id];
    });

    // Guardamos los nuevos pedidos generados
    Object.values(resumenVentas).forEach(pedido => pedidos.push(pedido));

    // Avisamos a todos los clientes que el mercado y los pedidos cambiaron
    io.emit("actualizar", mercado);
    io.emit("pedidos-actualizados", pedidos);
  });

  // 🚚 ACTUALIZAR ESTATUS DEL PEDIDO (Vendedor)
  socket.on("actualizar-estado-pedido", ({ pedidoId, nuevoEstado }) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido) {
      pedido.status = nuevoEstado;
      io.emit("pedidos-actualizados", pedidos);
    }
  });

  socket.on("disconnect", () => console.log("Usuario desconectado:", socket.id));
});

// Detecta el puerto que asigna la nube, o usa el 4000 si estás en tu PC
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor de WebSockets corriendo en el puerto ${PORT}`);
});