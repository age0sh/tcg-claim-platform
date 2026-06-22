import { useState } from "react";

export function CalendarView() {
  const [hoveredDay, setHoveredDay] = useState(null);
  const scheduledDrops = { 12: { seller: "PokeMaster99", time: "18:00 CST", items: "50+ Cartas Vintage" }, 25: { seller: "CardCollector_GDL", time: "20:30 CST", items: "Apertura en Vivo" } };
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div style={{ color: "white", maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#3498db" }}>📅 Calendario de Drops - Junio 2026</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px" }}>
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (<div key={d} style={{ textAlign: "center", color: "gray", fontWeight: "bold", paddingBottom: "10px" }}>{d}</div>))}
        {days.map(day => {
          const hasDrop = scheduledDrops[day];
          return (
            <div key={day} onMouseEnter={() => hasDrop && setHoveredDay(day)} onMouseLeave={() => setHoveredDay(null)} style={{ position: "relative", height: "100px", background: hasDrop ? "rgba(52, 152, 219, 0.2)" : "#111", border: hasDrop ? "1px solid #3498db" : "1px solid #333", borderRadius: "8px", padding: "10px", cursor: hasDrop ? "pointer" : "default" }}>
              <span style={{ fontWeight: "bold", color: hasDrop ? "#3498db" : "gray" }}>{day}</span>
              {hasDrop && <div style={{ marginTop: "10px", fontSize: "11px", color: "#ccc" }}>🔥 Drop programado</div>}
              {hoveredDay === day && (
                <div style={{ position: "absolute", bottom: "110%", left: "50%", transform: "translateX(-50%)", background: "#222", padding: "10px", borderRadius: "8px", width: "180px", zIndex: 10, border: "1px solid #444" }}>
                  <div style={{ color: "#3498db", fontWeight: "bold", marginBottom: "5px" }}>{hasDrop.seller}</div>
                  <div style={{ fontSize: "12px", color: "white" }}>⏰ {hasDrop.time}</div>
                  <div style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}>📦 {hasDrop.items}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProfileView({ userId }) {
  return (
    <div style={{ textAlign: "center", color: "white", padding: "40px" }}>
      <h2>👤 Mi Perfil de Comprador</h2>
      <p style={{ color: "gray" }}>ID Actual: {userId}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" }}>
        <div style={{ background: "#111", padding: "20px", borderRadius: "12px", width: "200px" }}>
          <h3>📦 Mis Claims</h3>
          <p style={{ fontSize: "24px", color: "#3498db", margin: "10px 0" }}>14</p>
          <span style={{ fontSize: "12px", color: "gray" }}>(Cartas ganadas)</span>
        </div>
      </div>
    </div>
  );
}