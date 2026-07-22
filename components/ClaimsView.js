import { useState } from "react";
import Card from "./Card";

// ======================================================
// GALERÍA DE ICONOS SVG
// ======================================================
const Icons = {
  Bag: () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/></svg>,
  Live: () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>,
  Key: () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>,
  Star: () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>,
  Info: () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
};

// 🔥 AGREGAMOS userName A LAS PROPIEDADES
export default function ClaimsView({ cartas = {}, socket, userId, userName, pedidos = [] }) {
  const [subTab, setSubTab] = useState("drops"); 

  const misCompras = pedidos.filter(p => p.buyerId === userId);

  const sellersGroup = {};
  Object.values(cartas).forEach(carta => {
    const nombreVendedor = carta.sellerName || "Vendedor Desconocido";
    if (!sellersGroup[nombreVendedor]) sellersGroup[nombreVendedor] = [];
    sellersGroup[nombreVendedor].push(carta);
  });
  const groupedSellers = Object.entries(sellersGroup);

  const handleRate = (pedidoId, estrellas) => {
    socket.emit("valorar-pedido", { pedidoId, estrellas });
  };

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", marginTop: "10px", fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      
      {/* Botones de navegación interna */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px", background: "#161616", padding: "6px", borderRadius: "8px", border: "1px solid #222" }}>
        <button onClick={() => setSubTab("drops")} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: subTab === "drops" ? "#3498db" : "transparent", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <span style={{ color: subTab === "drops" ? "#fff" : "#e74c3c" }}><Icons.Live /></span> Drops Activos
        </button>
        <button onClick={() => setSubTab("compras")} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: subTab === "compras" ? "#3498db" : "transparent", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <Icons.Bag /> Mis Compras ({misCompras.length})
        </button>
      </div>

      {/* SUB-TAB 1: DROPS EN VIVO */}
      {subTab === "drops" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {groupedSellers.length === 0 ? (
            <div style={{ color: "gray", textAlign: "center", marginTop: "40px", fontSize: "14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <Icons.Info />
              El mercado está vacío. Esperando a que publiquen lotes...
            </div>
          ) : (
            groupedSellers.map(([sellerName, sellerCards], index) => (
              <div key={sellerName} style={{ background: "#111", padding: "25px", borderRadius: "12px", border: "1px solid #333", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px", borderBottom: "1px solid #222", paddingBottom: "15px" }}>
                  <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: index % 2 === 0 ? "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)" : "linear-gradient(135deg, #3498db 0%, #2980b9 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px", color: "white", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                    {sellerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 style={{ margin: "0 0 3px 0", color: "#fff", fontSize: "18px" }}>{sellerName}</h2>
                    <span style={{ color: "#9ca3af", fontSize: "13px" }}>{sellerCards.length} piezas en subasta</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px", justifyItems: "center" }}>
                  {sellerCards.map((carta, cIndex) => (
                    // 🔥 AQUÍ PASAMOS userName A CARD.JS
                    <Card key={carta._id || carta.id || cIndex} data={carta} socket={socket} userId={userId} userName={userName} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-TAB 2: SECCIÓN HISTORIAL DE COMPRAS */}
      {subTab === "compras" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {misCompras.length === 0 ? (
            <p style={{ color: "gray", textAlign: "center", marginTop: "30px", fontStyle: "italic", fontSize: "14px" }}>No has concretado adquisiciones en esta sesión.</p>
          ) : (
            [...misCompras].reverse().map((compra, index) => (
              <div key={compra._id || compra.id || index} style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333", display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", borderBottom: "1px solid #222", paddingBottom: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "#6b7280", display: "block", marginBottom: "4px" }}>ID COMPRA: {compra._id || compra.id}</span>
                    <strong style={{ color: "white", fontSize: "15px" }}>Cartas: {compra.items.join(", ")}</strong>
                  </div>
                  <div style={{ padding: "6px 12px", borderRadius: "6px", background: compra.status === "Entregado ✅" ? "rgba(46, 204, 113, 0.1)" : "rgba(243, 156, 18, 0.1)", color: compra.status === "Entregado ✅" ? "#2ecc71" : "#fbbf24", fontSize: "12px", fontWeight: "bold", border: compra.status === "Entregado ✅" ? "1px solid rgba(46, 204, 113, 0.3)" : "1px solid rgba(243, 156, 18, 0.3)" }}>
                    {compra.status}
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "15px" }}>
                  {compra.status !== "Entregado ✅" ? (
                    <div style={{ background: "#151515", border: "1px dashed #3498db", padding: "10px 15px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ color: "#3498db" }}><Icons.Key /></div>
                      <div>
                        <span style={{ display: "block", fontSize: "10px", color: "#3498db", fontWeight: "bold", textTransform: "uppercase" }}>Código de Recogida</span>
                        <strong style={{ fontSize: "20px", color: "white", letterSpacing: "4px" }}>{compra.pickupCode}</strong>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "13px", color: "#9ca3af" }}>Valorar entrega:</span>
                      {compra.rating ? (
                        <div style={{ color: "#f1c40f", display: "flex", gap: "4px" }}>
                          {Array(compra.rating).fill(0).map((_, i) => <Icons.Star key={i} />)}
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "5px", color: "#6b7280" }}>
                          {[1, 2, 3, 4, 5].map(stars => (
                            <button key={stars} onClick={() => handleRate(compra._id || compra.id, stars)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#f1c40f"} onMouseLeave={e => e.currentTarget.style.color = "inherit"}>
                              <Icons.Star />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ fontSize: "20px", color: "#2ecc71", fontWeight: "bold" }}>
                    ${compra.total} <span style={{ fontSize: "14px", color: "#9ca3af" }}>MXN</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}