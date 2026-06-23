import { useState, useEffect } from "react";

export function CalendarView({ userId, userRole, userName, socket, calendario }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const [selectedDay, setSelectedDay] = useState(null);
  const [formTime, setFormTime] = useState("");
  const [formItems, setFormItems] = useState("");

  const handleDayClick = (day) => {
    if (userRole === "vendedor") {
      const existingDrop = calendario[day];
      if (existingDrop) {
        if (existingDrop.sellerId === userId) {
          setSelectedDay(day);
          setFormTime(existingDrop.time);
          setFormItems(existingDrop.items);
        } else {
          alert(`⛔ Este día ya está reservado por la tienda: ${existingDrop.seller}`);
        }
      } else {
        setSelectedDay(day);
        setFormTime("");
        setFormItems("");
      }
    }
  };

  const handleScheduleDrop = (e) => {
    e.preventDefault();
    if (!formTime || !formItems) return alert("Por favor, llena la hora y la descripción.");
    socket.emit("agendar-drop", { day: selectedDay, seller: userName, sellerId: userId, time: formTime, items: formItems });
    setSelectedDay(null);
  };

  const handleDeleteDrop = () => {
    if(window.confirm("¿Estás seguro de cancelar tu reserva?")) {
      socket.emit("cancelar-drop", { day: selectedDay, sellerId: userId });
      setSelectedDay(null);
    }
  };

  return (
    <div style={{ color: "white", maxWidth: "900px", margin: "0 auto", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      <div style={{ textAlign: "center", marginBottom: "30px", width: "100%" }}>
        <h2 style={{ color: "#3498db", margin: "0 0 10px 0" }}>📅 Calendario de Drops</h2>
        <p style={{ color: "gray", fontSize: "14px", margin: 0, padding: "0 10px" }}>
          {userRole === "vendedor" 
            ? "⭐ Haz clic en días vacíos para agendar, o en tus días azules para editar." 
            : "Explora las fechas para no perderte las aperturas y subastas."}
        </p>
      </div>

      {/* 🔥 Contenedor Responsivo: Centrado y deslizable en móvil */}
      <div style={{ width: "100%", overflowX: "auto", paddingBottom: "15px", display: "flex", justifyContent: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(45px, 1fr))", gap: "8px", minWidth: "340px", width: "100%" }}>
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
            <div key={d} style={{ textAlign: "center", color: "gray", fontWeight: "bold", paddingBottom: "5px", fontSize: "12px" }}>{d}</div>
          ))}
          
          {days.map(day => {
            const hasDrop = calendario[day];
            const isMine = hasDrop && hasDrop.sellerId === userId;
            const isPointer = userRole === "vendedor" && (!hasDrop || isMine);

            return (
              <div 
                key={day} 
                onMouseEnter={() => hasDrop && setHoveredDay(day)} 
                onMouseLeave={() => setHoveredDay(null)} 
                onClick={() => handleDayClick(day)}
                style={{ 
                  position: "relative", 
                  minHeight: "80px", // Reducido para móvil
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: hasDrop ? (isMine ? "rgba(46, 204, 113, 0.2)" : "rgba(52, 152, 219, 0.2)") : "#111", 
                  border: hasDrop ? (isMine ? "1px solid #2ecc71" : "1px solid #3498db") : "1px solid #333", 
                  borderRadius: "8px", 
                  padding: "8px", 
                  cursor: isPointer ? "pointer" : (hasDrop ? "help" : "default"),
                  transition: "all 0.2s"
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "14px", color: hasDrop ? (isMine ? "#2ecc71" : "#3498db") : "gray" }}>{day}</span>
                {hasDrop && <div style={{ marginTop: "5px", fontSize: "10px", color: "#ccc", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>{hasDrop.seller.substring(0,6)}...</div>}
                
                {hoveredDay === day && !selectedDay && (
                  <div style={{ position: "absolute", bottom: "110%", left: "50%", transform: "translateX(-50%)", background: "#222", padding: "10px", borderRadius: "8px", width: "160px", zIndex: 10, border: "1px solid #444", boxShadow: "0 4px 12px rgba(0,0,0,0.5)", pointerEvents: "none" }}>
                    <div style={{ color: "#3498db", fontWeight: "bold", marginBottom: "5px", fontSize: "13px" }}>{hasDrop.seller}</div>
                    <div style={{ fontSize: "11px", color: "white" }}>⏰ {hasDrop.time}</div>
                    <div style={{ fontSize: "11px", color: "gray", marginTop: "5px" }}>📦 {hasDrop.items}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Reserva (sin cambios) */}
      {selectedDay && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(3px)", padding: "20px" }}>
          <div style={{ background: "#111", padding: "30px", borderRadius: "12px", border: "1px solid #333", width: "100%", maxWidth: "350px" }}>
            <h3 style={{ color: "#fff", margin: "0 0 5px 0" }}>{calendario[selectedDay] ? "Editar Drop" : "Agendar Drop"}</h3>
            <p style={{ color: "gray", fontSize: "13px", marginBottom: "20px" }}>Día {selectedDay}</p>
            
            <form onSubmit={handleScheduleDrop} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ color: "gray", fontSize: "12px", marginBottom: "5px", display: "block" }}>Hora</label>
                <input type="text" placeholder="20:00 CST" value={formTime} onChange={e => setFormTime(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #333", background: "#222", color: "white", outline: "none" }} />
              </div>
              <div>
                <label style={{ color: "gray", fontSize: "12px", marginBottom: "5px", display: "block" }}>Descripción</label>
                <input type="text" placeholder="Ej. Booster Box 151..." value={formItems} onChange={e => setFormItems(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #333", background: "#222", color: "white", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setSelectedDay(null)} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #444", background: "transparent", color: "white", cursor: "pointer" }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: "#3498db", color: "white", cursor: "pointer", fontWeight: "bold" }}>Guardar</button>
              </div>
              {calendario[selectedDay] && (
                 <button type="button" onClick={handleDeleteDrop} style={{ padding: "10px", borderRadius: "6px", border: "none", background: "#e74c3c", color: "white", cursor: "pointer", fontWeight: "bold", marginTop: "5px" }}>🗑️ Cancelar Reserva</button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
// 🔥 VISTA DE PERFIL AVANZADA (Comprador vs Vendedor)
export function ProfileView({ userId, userName, userRole, socket }) {
  const [description, setDescription] = useState("¡Bienvenido a mi espacio TCG! Coleccionista y vendedor apasionado de expansiones clásicas y modernas.");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [misComprasHistorial, setMisComprasHistorial] = useState([]);

  // Escuchar el historial de compras real desde los sockets
  useEffect(() => {
    if (socket) {
      socket.on("pedidos-actualizados", (data) => {
        // Si soy comprador, filtro los recibos donde yo gané
        setMisComprasHistorial(data.filter(p => p.buyerId === userId));
      });
    }
    return () => { if (socket) socket.off("pedidos-actualizados"); };
  }, [socket, userId]);

  // 🔥 Mock de cartas para presumir en el Mostrador (3 Espacios)
  const cartasMostrador = [
    { name: "Charizard Gold Star", rarity: "ALTERNATIVE FA", set: "POR" },
    { name: "Umbreon VMAX", rarity: "FA", set: "MEG" },
    { name: "Pikachu Illustrator", rarity: "FOIL", set: "PROMO" }
  ];

  // ======================================================
  // VISTA DE PERFIL EN MODO VENDEDOR
  // ======================================================
  if (userRole === "vendedor") {
    return (
      <div style={{ color: "white", maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "25px" }}>
        <div style={{ background: "#111", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px" }}>
            <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#f1c40f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "bold", color: "black" }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: "0 0 5px 0" }}>Tienda Oficial: {userName}</h2>
              <span style={{ color: "#2ecc71", fontSize: "14px", fontWeight: "bold" }}>⭐ Vendedor Verificado</span>
            </div>
          </div>

          {/* Textbox/Textarea para la descripción */}
          <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "8px", border: "1px solid #222" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#3498db" }}>Presentación de la Tienda</h4>
            {isEditingDesc ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", height: "80px", background: "#000", color: "white", border: "1px solid #444", borderRadius: "6px", padding: "10px", resize: "none", outline: "none", fontFamily: "sans-serif" }}
                />
                <button onClick={() => setIsEditingDesc(false)} style={{ alignSelf: "flex-end", background: "#2ecc71", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Guardar Biografía</button>
              </div>
            ) : (
              <div>
                <p style={{ color: "#ccc", margin: "0 0 12px 0", lineHeight: "1.5", fontSize: "14px" }}>{description}</p>
                <button onClick={() => setIsEditingDesc(true)} style={{ background: "transparent", border: "1px solid #444", color: "gray", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e=>e.target.style.borderColor="#3498db"} onMouseOut={e=>e.target.style.borderColor="#444"}>Editar Presentación</button>
              </div>
            )}
          </div>
        </div>

        {/* Panel de Estadísticas de Venta */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
          <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333", textAlign: "center" }}>
            <span style={{ color: "gray", fontSize: "12px" }}>Volumen de Venta</span>
            <div style={{ fontSize: "26px", fontWeight: "bold", color: "#2ecc71", marginTop: "5px" }}>$8,400 MXN</div>
          </div>
          <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333", textAlign: "center" }}>
            <span style={{ color: "gray", fontSize: "12px" }}>Calificación General</span>
            <div style={{ fontSize: "26px", fontWeight: "bold", color: "#f1c40f", marginTop: "5px" }}>⭐ 5.0 / 5.0</div>
          </div>
          <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333", textAlign: "center" }}>
            <span style={{ color: "gray", fontSize: "12px" }}>Porcentaje Cancelaciones</span>
            <div style={{ fontSize: "26px", fontWeight: "bold", color: "#e74c3c", marginTop: "5px" }}>0% 🔥</div>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // VISTA DE PERFIL EN MODO COMPRADOR
  // ======================================================
  return (
    <div style={{ color: "white", maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "30px" }}>
      {/* Cabecera del Comprador */}
      <div style={{ background: "#111", padding: "25px", borderRadius: "12px", border: "1px solid #333", display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ width: "65px", height: "65px", borderRadius: "50%", background: "#3498db", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: "bold" }}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 style={{ margin: "0 0 5px 0" }}>{userName}</h2>
          <p style={{ margin: 0, color: "gray", fontSize: "13px" }}>ID de Cuenta: {userId.substring(0, 12)}...</p>
        </div>
      </div>

      {/* 🎴 MOSTRADOR PERSONAL (Para presumir 3 cartas superiores) */}
      <div style={{ background: "#111", padding: "25px", borderRadius: "12px", border: "1px solid #333" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#f1c40f", display: "flex", alignItems: "center", gap: "10px" }}>🏆 Mi Mostrador Personal</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
          {cartasMostrador.map((carta, index) => (
            <div key={index} style={{ background: "#1a1a1a", border: "1px dashed #444", padding: "20px", borderRadius: "8px", textAlign: "center", position: "relative" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>🎴</div>
              <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "4px", color: "#fff" }}>{carta.name}</div>
              <div style={{ fontSize: "11px", color: "#3498db", fontWeight: "bold" }}>{carta.rarity}</div>
              <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "#000", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", color: "gray", border: "1px solid #222" }}>{carta.set}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORIAL DE CLAIMS COMPRADAS */}
      <div style={{ background: "#111", padding: "25px", borderRadius: "12px", border: "1px solid #333" }}>
        <h3 style={{ margin: "0 0 15px 0", color: "white" }}>📜 Historial de Claims Ganados</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {misComprasHistorial.map((pedido) => (
            <div key={pedido.id} style={{ background: "#1a1a1a", padding: "15px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #222" }}>
              <div>
                <div style={{ fontWeight: "bold", color: "#fff" }}>{pedido.items.join(", ")}</div>
                <span style={{ color: "gray", fontSize: "12px" }}>Código Recibo: {pedido.id}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#2ecc71", fontWeight: "bold", display: "block", fontSize: "16px" }}>${pedido.total} MXN</span>
                <span style={{ background: "#222", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", color: "#aaa" }}>{pedido.status}</span>
              </div>
            </div>
          ))}
          {misComprasHistorial.length === 0 && (
            <p style={{ color: "gray", fontSize: "14px", fontStyle: "italic", margin: 0, textAlign: "center", padding: "15px" }}>Aún no has reclamado cartas en esta sesión web pública.</p>
          )}
        </div>
      </div>
    </div>
  );
}