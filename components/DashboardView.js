export default function DashboardView({ onSelectSeller, mockSellers }) {
  const noticias = [
    { id: 1, titulo: "🔥 ¡Nueva expansión disponible para claims!", fecha: "22 de Junio, 2026" },
    { id: 2, titulo: "Mantenimiento programado de servidores", fecha: "20 de Junio, 2026" }
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginTop: "20px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
          <h2 style={{ margin: "0 0 15px 0", color: "#3498db" }}>📰 Noticias Relevantes</h2>
          {noticias.map(noticia => (
            <div key={noticia.id} style={{ padding: "10px", background: "#1a1a1a", borderRadius: "8px", marginBottom: "10px" }}>
              <h4 style={{ margin: "0 0 5px 0", color: "white" }}>{noticia.titulo}</h4>
              <span style={{ color: "gray", fontSize: "12px" }}>{noticia.fecha}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333", height: "fit-content" }}>
        <h2 style={{ margin: "0 0 15px 0", color: "#f1c40f" }}>🏆 Top Vendedores</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {mockSellers.map((seller, index) => (
            <div key={seller.id} onClick={() => onSelectSeller(seller)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#1a1a1a", borderRadius: "8px", cursor: "pointer", transition: "background 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: index === 0 ? "#f1c40f" : "gray" }}>#{index + 1}</span>
                <span style={{ color: "white", display: "flex", alignItems: "center", gap: "5px" }}>
                  {seller.nombre} {seller.verificado && <span style={{ color: "#2ecc71", fontSize: "12px" }}>✔</span>}
                </span>
              </div>
              <div style={{ color: "#f1c40f", fontSize: "14px" }}>⭐ {seller.rep}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}