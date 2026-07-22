import { useState } from "react";

// ======================================================
// GALERÍA DE ICONOS SVG (Estilo Bootstrap)
// ======================================================
const Icons = {
  Calendar: () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>,
  Trash: () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>,
  Edit: () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>,
  Store: () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3z"/></svg>,
  Cart: () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>,
  Star: () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>,
  Info: () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>,
  Plus: () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
};

// ======================================================
// 1. VISTA DEL CALENDARIO DE DROPS Y EVENTOS TCG (2026)
// ======================================================
export function CalendarView({ userId, userRole, userName, socket, calendario = {} }) {
  const [currentMonth, setCurrentMonth] = useState(6); // Iniciamos en Julio (Índice 6)
  const year = 2026;

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentMonth, year);
  const firstDay = getFirstDayOfMonth(currentMonth, year);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const [selectedDate, setSelectedDate] = useState(null);
  const [formHour, setFormHour] = useState("12");
  const [formMin, setFormMin] = useState("00");
  const [formAmPm, setFormAmPm] = useState("PM");
  const [formDesc, setFormDesc] = useState("");

  const handlePrevMonth = () => setCurrentMonth(prev => Math.max(0, prev - 1));
  const handleNextMonth = () => setCurrentMonth(prev => Math.min(11, prev + 1));

  const formatKey = (day) => `${year}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const handleDayClick = (day) => {
    setSelectedDate(formatKey(day));
    setFormDesc("");
  };

  const handleScheduleDrop = (e) => {
    e.preventDefault();
    if (!formDesc.trim()) return alert("Por favor, agrega una descripción para el evento.");
    
    const finalTime = `${formHour}:${formMin} ${formAmPm}`;
    socket.emit("agendar-drop", { 
      date: selectedDate, 
      seller: userName, 
      sellerId: userId, 
      time: finalTime, 
      description: formDesc 
    });
    setFormDesc("");
  };

  const handleDeleteDrop = (eventId) => {
    if(window.confirm("¿Estás seguro de cancelar este evento?")) {
      socket.emit("cancelar-drop", { eventId });
    }
  };

  return (
    <div style={{ color: "white", maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", background: "#111", padding: "15px 20px", borderRadius: "12px", border: "1px solid #333" }}>
        <button onClick={handlePrevMonth} disabled={currentMonth === 0} style={{ background: "transparent", border: "1px solid #444", color: currentMonth === 0 ? "#444" : "white", padding: "8px 15px", borderRadius: "6px", cursor: currentMonth === 0 ? "not-allowed" : "pointer" }}>&larr; Anterior</button>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2 style={{ color: "#3498db", margin: "0 0 5px 0", fontSize: "24px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icons.Calendar /> {meses[currentMonth]} {year}
          </h2>
          <p style={{ color: "gray", fontSize: "13px", margin: 0 }}>Organiza eventos de TCG, subastas y torneos</p>
        </div>
        <button onClick={handleNextMonth} disabled={currentMonth === 11} style={{ background: "transparent", border: "1px solid #444", color: currentMonth === 11 ? "#444" : "white", padding: "8px 15px", borderRadius: "6px", cursor: currentMonth === 11 ? "not-allowed" : "pointer" }}>Siguiente &rarr;</button>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(120px, 1fr))", gap: "10px", minWidth: "800px" }}>
          
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => (
            <div key={d} style={{ textAlign: "center", color: "#3498db", fontWeight: "bold", paddingBottom: "10px", fontSize: "14px", borderBottom: "2px solid #222", marginBottom: "10px" }}>{d}</div>
          ))}
          
          {blanks.map(b => <div key={`blank-${b}`} style={{ minHeight: "100px", background: "transparent" }} />)}
          
          {days.map(day => {
            const dateKey = formatKey(day);
            const events = calendario[dateKey] || [];
            
            return (
              <div 
                key={day} 
                onClick={() => handleDayClick(day)}
                style={{ minHeight: "110px", background: "#111", border: "1px solid #333", borderRadius: "8px", padding: "8px", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column" }}
                onMouseEnter={e => e.currentTarget.style.border = "1px solid #3498db"}
                onMouseLeave={e => e.currentTarget.style.border = "1px solid #333"}
              >
                <div style={{ fontWeight: "bold", fontSize: "16px", color: "gray", marginBottom: "8px", textAlign: "right" }}>{day}</div>
                
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "5px", overflowY: "auto", maxHeight: "80px" }}>
                  {events.map((ev, i) => (
                    <div key={i} style={{ fontSize: "10px", background: ev.sellerId === userId ? "rgba(46, 204, 113, 0.15)" : "rgba(52, 152, 219, 0.15)", borderLeft: ev.sellerId === userId ? "3px solid #2ecc71" : "3px solid #3498db", padding: "4px", borderRadius: "0 4px 4px 0", color: "#e2e8f0" }}>
                      <strong>{ev.time}</strong> - {ev.description}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(3px)", padding: "20px" }}>
          <div style={{ background: "#111", padding: "30px", borderRadius: "12px", border: "1px solid #3498db", width: "100%", maxWidth: "450px" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ color: "#fff", margin: "0 0 5px 0", fontSize: "20px" }}>Agenda del Día</h3>
                <p style={{ color: "#3498db", fontSize: "14px", margin: 0, fontWeight: "bold" }}>{selectedDate}</p>
              </div>
              <button onClick={() => setSelectedDate(null)} style={{ background: "transparent", border: "none", color: "gray", fontSize: "24px", cursor: "pointer" }}>&times;</button>
            </div>

            <div style={{ marginBottom: "20px", maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              {(calendario[selectedDate] || []).length === 0 ? (
                <div style={{ color: "gray", fontSize: "13px", fontStyle: "italic", textAlign: "center" }}>No hay eventos programados para este día.</div>
              ) : (
                (calendario[selectedDate] || []).map(ev => (
                  <div key={ev.id} style={{ background: "#1a1a1a", padding: "10px", borderRadius: "8px", border: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#3498db", fontSize: "12px", fontWeight: "bold" }}>{ev.seller} <span style={{ color: "gray", fontWeight: "normal" }}>| {ev.time}</span></div>
                      <div style={{ color: "white", fontSize: "13px", marginTop: "4px" }}>{ev.description}</div>
                    </div>
                    {ev.sellerId === userId && (
                      <button onClick={() => handleDeleteDrop(ev.id)} style={{ background: "rgba(231, 76, 60, 0.1)", border: "none", color: "#e74c3c", padding: "6px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center" }} title="Cancelar Evento">
                        <Icons.Trash />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <hr style={{ borderColor: "#222", marginBottom: "20px" }} />
            
            <form onSubmit={handleScheduleDrop} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: "gray", fontSize: "11px", marginBottom: "5px", display: "block", fontWeight: "bold" }}>HORA</label>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <select value={formHour} onChange={e => setFormHour(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #333", background: "#222", color: "white", outline: "none" }}>
                      {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                    </select>
                    <span style={{ color: "white", alignSelf: "center", fontWeight: "bold" }}>:</span>
                    <select value={formMin} onChange={e => setFormMin(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #333", background: "#222", color: "white", outline: "none" }}>
                      {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={formAmPm} onChange={e => setFormAmPm(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #333", background: "#222", color: "white", outline: "none" }}>
                      <option value="AM">AM</option><option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label style={{ color: "gray", fontSize: "11px", marginBottom: "5px", display: "block", fontWeight: "bold" }}>DESCRIPCIÓN DEL EVENTO O TORNEO</label>
                <input type="text" placeholder="Ej. Torneo formato Estándar / Subasta Vintage" value={formDesc} onChange={e => setFormDesc(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #333", background: "#222", color: "white", outline: "none" }} />
              </div>

              <button type="submit" style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "none", background: "#2ecc71", color: "white", cursor: "pointer", fontWeight: "bold", marginTop: "5px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Icons.Plus /> Publicar Nuevo Evento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ======================================================
// 2. VISTA DE PERFIL UNIFICADA (VENDEDOR + COMPRADOR)
// ======================================================
export function ProfileView({ userId, userName, userRole, pedidos = [], socket }) {
  const isSeller = userRole === "vendedor";

  const [description, setDescription] = useState("Coleccionista y jugador activo de Zapopan, Jalisco. ¡Amante de los cartones brillantes!");
  const [isEditing, setIsEditing] = useState(false);
  const [tempDesc, setTempDesc] = useState(description);

  const handleSaveDescription = () => {
    setDescription(tempDesc);
    setIsEditing(false);
    if (socket) {
      socket.emit("actualizar-descripcion", { userId, descripcion: tempDesc });
    } else {
      console.error("Socket no está conectado en el componente de Perfil");
    }
  };

  const misVentas = pedidos.filter(p => p.sellerId === userId && p.status === "Entregado ✅");
  const misCompras = pedidos.filter(p => p.buyerId === userId && p.status === "Entregado ✅");

  const totalCartasVendidas = misVentas.reduce((acc, p) => acc + p.items.length, 0);
  const ingresos = misVentas.reduce((acc, p) => acc + p.total, 0);
  const valoraciones = misVentas.map(p => p.rating).filter(r => r !== null);
  const promedio = valoraciones.length > 0 ? (valoraciones.reduce((a, b) => a + b, 0) / valoraciones.length).toFixed(1) : "N/A";

  const totalCartasCompradas = misCompras.reduce((acc, p) => acc + p.items.length, 0);
  const gastos = misCompras.reduce((acc, p) => acc + p.total, 0);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", color: "white" }}>
      
      <div style={{ background: "linear-gradient(135deg, #111 0%, #1a1a1a 100%)", padding: "30px", borderRadius: "12px", border: "1px solid #333", marginBottom: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
         <div style={{ display: "flex", alignItems: "flex-start", gap: "25px", flexWrap: "wrap" }}>
           
           <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: isSeller ? "linear-gradient(135deg, #f1c40f 0%, #e67e22 100%)" : "linear-gradient(135deg, #3498db 0%, #9b59b6 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", fontWeight: "bold", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
              {userName.charAt(0).toUpperCase()}
           </div>
           
           <div style={{ flex: 1, minWidth: "250px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "8px" }}>
                <h1 style={{ margin: 0, color: "#fff", fontSize: "28px" }}>{userName}</h1>
                <span style={{ padding: "6px 12px", background: "rgba(0,0,0,0.3)", borderRadius: "6px", color: isSeller ? "#f1c40f" : "#3498db", fontSize: "11px", fontWeight: "bold", border: `1px solid ${isSeller ? 'rgba(241, 196, 15, 0.3)' : 'rgba(52, 152, 219, 0.3)'}`, display: "flex", alignItems: "center", gap: "6px" }}>
                  {isSeller ? <><Icons.Store /> VENDEDOR Y COMPRADOR</> : <><Icons.Cart /> COMPRADOR</>}
                </span>
              </div>
              
              <div style={{ marginTop: "15px" }}>
                <label style={{ color: "#aaa", fontSize: "11px", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  SOBRE MÍ
                  {!isEditing && <button onClick={() => setIsEditing(true)} style={{ background: "none", border: "none", color: "#3498db", cursor: "pointer", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}><Icons.Edit /> Editar</button>}
                </label>
                
                {isEditing ? (
                  <div style={{ marginTop: "5px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <textarea 
                      value={tempDesc} 
                      onChange={(e) => setTempDesc(e.target.value)}
                      rows="3"
                      style={{ width: "100%", background: "#0a0a0a", border: "1px solid #444", borderRadius: "8px", padding: "10px", color: "white", outline: "none", resize: "none", fontFamily: "inherit" }}
                    />
                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                      <button onClick={() => { setIsEditing(false); setTempDesc(description); }} style={{ padding: "6px 12px", borderRadius: "6px", background: "transparent", border: "1px solid #444", color: "white", cursor: "pointer", fontSize: "12px" }}>Cancelar</button>
                      <button onClick={handleSaveDescription} style={{ padding: "6px 12px", borderRadius: "6px", background: "#3498db", border: "none", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>Guardar</button>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "#e2e8f0", margin: "5px 0 0 0", fontSize: "14px", lineHeight: "1.5" }}>{description}</p>
                )}
              </div>
           </div>
         </div>
      </div>

      {isSeller && (
        <>
          <h2 style={{ color: "#f1c40f", margin: "0 0 15px 0", fontSize: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Icons.Store /> Mi Rendimiento como Vendedor
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "40px" }}>
            <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #222", textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "gray", marginBottom: "5px", textTransform: "uppercase", fontWeight: "bold" }}>Ingresos Generados</div>
              <div style={{ fontSize: "28px", color: "#2ecc71", fontWeight: "bold" }}>${ingresos}</div>
            </div>
            <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #222", textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "gray", marginBottom: "5px", textTransform: "uppercase", fontWeight: "bold" }}>Cartas Entregadas</div>
              <div style={{ fontSize: "28px", color: "#f1c40f", fontWeight: "bold" }}>{totalCartasVendidas}</div>
            </div>
            <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #222", textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "gray", marginBottom: "5px", textTransform: "uppercase", fontWeight: "bold" }}>Calificación Local</div>
              <div style={{ fontSize: "28px", color: "#f1c40f", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                {promedio !== "N/A" ? <><Icons.Star /> {promedio}</> : "N/A"}
              </div>
            </div>
          </div>
        </>
      )}

      <h2 style={{ color: "#3498db", margin: "0 0 15px 0", fontSize: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <Icons.Cart /> Mi Actividad como Comprador
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
        <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #222", textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "gray", marginBottom: "5px", textTransform: "uppercase", fontWeight: "bold" }}>Inversión en Cartas</div>
          <div style={{ fontSize: "28px", color: "#e74c3c", fontWeight: "bold" }}>${gastos}</div>
        </div>
        <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #222", textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "gray", marginBottom: "5px", textTransform: "uppercase", fontWeight: "bold" }}>Piezas Recibidas</div>
          <div style={{ fontSize: "28px", color: "#3498db", fontWeight: "bold" }}>{totalCartasCompradas}</div>
        </div>
      </div>

      <div style={{ marginTop: "20px", background: "#111", padding: "15px", borderRadius: "12px", border: "1px solid #333", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
        <span style={{ color: "gray" }}><Icons.Info /></span>
        <p style={{ color: "gray", fontSize: "13px", margin: 0 }}>
          Las métricas solo se actualizan al validar exitosamente el código de entrega de un lote.
        </p>
      </div>

    </div>
  );
}