import { useState, useEffect } from "react";

// ======================================================
// 1. VISTA DEL CALENDARIO DE DROPS (RESPONSIVO)
// ======================================================
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

      {/* Contenedor Responsivo: Centrado y deslizable en móvil */}
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
                  minHeight: "80px", 
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

      {/* Modal de Reserva */}
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

// ======================================================
// 2. VISTA DE PERFIL DINÁMICA (UNIFICADA)
// ======================================================
export function ProfileView({ userId, userName, userRole, pedidos = [] }) {
  const isSeller = userRole === "vendedor";

  // 1. Filtramos los pedidos donde participaste (como vendedor o comprador)
  const misOperaciones = pedidos.filter(p => isSeller ? p.sellerId === userId : p.buyerId === userId);
  
  // 2. Filtramos SOLO los que ya se entregaron (validación física exitosa con el PIN)
  const operacionesCompletadas = misOperaciones.filter(p => p.status === "Entregado ✅");

  // 3. Cálculos matemáticos dinámicos
  const totalCartas = operacionesCompletadas.reduce((acc, p) => acc + p.items.length, 0);
  const volumenDinero = operacionesCompletadas.reduce((acc, p) => acc + p.total, 0);

  // 4. Calificaciones (Solo calcula si la cuenta es de vendedor)
  const valoraciones = operacionesCompletadas.map(p => p.rating).filter(r => r !== null);
  const promedio = valoraciones.length > 0 ? (valoraciones.reduce((a, b) => a + b, 0) / valoraciones.length).toFixed(1) : "N/A";

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", color: "white" }}>
      
      {/* HEADER DEL PERFIL */}
      <div style={{ background: "#111", padding: "30px", borderRadius: "12px", border: "1px solid #333", display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
         <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: isSeller ? "#e74c3c" : "#3498db", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "bold" }}>
            {userName.charAt(0).toUpperCase()}
         </div>
         <div>
            <h1 style={{ margin: "0 0 5px 0", color: "#fff" }}>{userName}</h1>
            <span style={{ padding: "4px 10px", background: "#222", borderRadius: "6px", color: isSeller ? "#f1c40f" : "#3498db", fontSize: "12px", fontWeight: "bold", border: "1px solid #333" }}>
              {isSeller ? "⭐ Cuenta de Vendedor" : "🛒 Cuenta de Comprador"}
            </span>
         </div>
      </div>

      <h2 style={{ color: "#3498db", margin: "30px 0 15px 0" }}>📊 {isSeller ? "Rendimiento de Ventas" : "Historial de Adquisiciones"}</h2>

      {/* CUADRÍCULA DE ESTADÍSTICAS REALES */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
        
        {/* Métrica 1: Dinero */}
        <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #222", textAlign: "center" }}>
          <div style={{ fontSize: "13px", color: "gray", marginBottom: "5px" }}>{isSeller ? "Ingresos Totales" : "Gastos Totales"}</div>
          <div style={{ fontSize: "28px", color: "#2ecc71", fontWeight: "bold" }}>
            ${volumenDinero} <span style={{fontSize: "14px"}}>MXN</span>
          </div>
        </div>

        {/* Métrica 2: Cartas Físicas */}
        <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #222", textAlign: "center" }}>
          <div style={{ fontSize: "13px", color: "gray", marginBottom: "5px" }}>Cartas {isSeller ? "Entregadas" : "Recibidas"}</div>
          <div style={{ fontSize: "28px", color: "#3498db", fontWeight: "bold" }}>{totalCartas}</div>
        </div>

        {/* Métricas exclusivas para Vendedores */}
        {isSeller && (
          <>
            <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #222", textAlign: "center" }}>
              <div style={{ fontSize: "13px", color: "gray", marginBottom: "5px" }}>Calificación Global</div>
              <div style={{ fontSize: "28px", color: "#f1c40f", fontWeight: "bold" }}>
                {promedio !== "N/A" ? `⭐ ${promedio}` : "N/A"}
              </div>
              <div style={{ fontSize: "11px", color: "gray", marginTop: "5px" }}>
                ({valoraciones.length} {valoraciones.length === 1 ? "reseña" : "reseñas"})
              </div>
            </div>

            <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #222", textAlign: "center" }}>
              <div style={{ fontSize: "13px", color: "gray", marginBottom: "5px" }}>Cancelaciones</div>
              <div style={{ fontSize: "28px", color: "#e74c3c", fontWeight: "bold" }}>0%</div>
              <div style={{ fontSize: "11px", color: "gray", marginTop: "5px" }}>Sin incidencias</div>
            </div>
          </>
        )}
      </div>
      
      {/* Disclaimer de actualización */}
      <div style={{ marginTop: "20px", background: "#111", padding: "15px", borderRadius: "12px", border: "1px solid #333" }}>
        <p style={{ color: "gray", fontSize: "13px", margin: 0, textAlign: "center" }}>
          ℹ️ Las métricas solo se actualizan al validar exitosamente el código de entrega de un lote.
        </p>
      </div>

    </div>
  );
}