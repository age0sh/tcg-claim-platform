import { useState } from "react";
import Card from "./Card";

export default function ClaimsView({ cartas = {}, socket, userId, pedidos = [] }) {
  const [subTab, setSubTab] = useState("drops"); // drops o compras

  // Filtrar los pedidos que le pertenecen a este comprador específico
  const misCompras = pedidos.filter(p => p.buyerId === userId);

  // Agrupación de cartas activas por vendedor para la subpestaña de drops
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
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", marginTop: "10px" }}>
      
      {/* Botones de navegación interna */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px", background: "#161616", padding: "6px", borderRadius: "8px", border: "1px solid #222" }}>
        <button onClick={() => setSubTab("drops")} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: subTab === "drops" ? "#3498db" : "transparent", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>🔴 Drops Activos</button>
        <button onClick={() => setSubTab("compras")} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: subTab === "compras" ? "#3498db" : "transparent", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>🛍️ Mis Compras ({misCompras.length})</button>
      </div>

      {/* SUB-TAB 1: DROPS EN VIVO */}
      {subTab === "drops" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {groupedSellers.length === 0 ? (
            <div style={{ color: "gray", textAlign: "center", marginTop: "40px", fontSize: "16px" }}>El mercado está vacío. Esperando a que publiquen lotes... 😴</div>
          ) : (
            groupedSellers.map(([sellerName, sellerCards], index) => (
              <div key={sellerName} style={{ background: "#111", padding: "25px", borderRadius: "12px", border: "1px solid #333" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px", borderBottom: "1px solid #222", paddingBottom: "15px" }}>
                  <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: index % 2 === 0 ? "#e74c3c" : "#3498db", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px", color: "white" }}>
                    {sellerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 style={{ margin: "0 0 3px 0", color: "#fff", fontSize: "18px" }}>{sellerName}</h2>
                    <span style={{ color: "gray", fontSize: "13px" }}>{sellerCards.length} piezas en subasta</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px", justifyItems: "center" }}>
                  {sellerCards.map((carta) => (
                    <Card key={carta.id} data={carta} socket={socket} userId={userId} />
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
            <p style={{ color: "gray", textAlign: "center", marginTop: "30px", fontStyle: "italic" }}>No has concretado adquisiciones en esta sesión.</p>
          ) : (
            misCompras.reverse().map(compra => (
              <div key={compra.id} style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333", display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", borderBottom: "1px solid #222", paddingBottom: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "gray", display: "block" }}>ID COMPRA: {compra.id}</span>
                    <strong style={{ color: "white", fontSize: "15px" }}>Cartas: {compra.items.join(", ")}</strong>
                  </div>
                  <div style={{ padding: "6px 12px", borderRadius: "6px", background: compra.status === "Entregado ✅" ? "rgba(46, 204, 113, 0.2)" : "rgba(243, 156, 18, 0.2)", color: compra.status === "Entregado ✅" ? "#2ecc71" : "#f39c12", fontSize: "12px", fontWeight: "bold", border: compra.status === "Entregado ✅" ? "1px solid #2ecc71" : "1px solid #f39c12" }}>
                    {compra.status}
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "15px" }}>
                  {/* Recuadro del token de seguridad */}
                  {compra.status !== "Entregado ✅" ? (
                    <div style={{ background: "#1e272e", border: "1px dashed #3498db", padding: "10px", borderRadius: "8px" }}>
                      <span style={{ display: "block", fontSize: "10px", color: "#3498db", fontWeight: "bold" }}>🔑 CÓDIGO DE RECOGIDA:</span>
                      <strong style={{ fontSize: "20px", color: "white", letterSpacing: "2px" }}>{compra.pickupCode}</strong>
                    </div>
                  ) : (
                    // Sección para calificar si ya fue entregado
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "13px", color: "gray" }}>Valorar entrega:</span>
                      {compra.rating ? (
                        <div style={{ color: "#f1c40f", fontWeight: "bold" }}>{"⭐".repeat(compra.rating)}</div>
                      ) : (
                        <div style={{ display: "flex", gap: "5px" }}>
                          {[1, 2, 3, 4, 5].map(stars => (
                            <button key={stars} onClick={() => handleRate(compra.id, stars)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>⭐</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ fontSize: "20px", color: "#2ecc71", fontWeight: "bold" }}>
                    ${compra.total} MXN
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