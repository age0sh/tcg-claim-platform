import { useState, useEffect } from "react";

export default function DashboardView({ onSelectSeller, mercado = {}, pedidos = [], calendario = {} }) {
  // 📅 Buscar el próximo Drop real en el calendario
  const diasConEventos = Object.keys(calendario).map(Number).sort((a, b) => a - b);
  const proximoDia = diasConEventos.length > 0 ? diasConEventos[0] : null;
  const proximoDrop = proximoDia ? calendario[proximoDia] : null;

  // 🏆 CÁLCULO EN TIEMPO REAL DE TOP VENDEDORES
  const listaVendedores = {};

  // 1. Contar cartas activas en el mercado actual
  Object.values(mercado).forEach(carta => {
    if (!listaVendedores[carta.sellerId]) {
      listaVendedores[carta.sellerId] = { id: carta.sellerId, nombre: carta.sellerName, claimsPublicados: 0, valoraciones: [], sumaEstrellas: 0 };
    }
    listaVendedores[carta.sellerId].claimsPublicados += 1;
  });

  // 2. Contar pedidos e incorporar las calificaciones reales
  pedidos.forEach(pedido => {
    if (!listaVendedores[pedido.sellerId]) {
      listaVendedores[pedido.sellerId] = { id: pedido.sellerId, nombre: pedido.sellerName, claimsPublicados: 0, valoraciones: [], sumaEstrellas: 0 };
    }
    listaVendedores[pedido.sellerId].claimsPublicados += 1; // Cuenta como actividad histórica
    if (pedido.rating) {
      listaVendedores[pedido.sellerId].valoraciones.push(pedido.rating);
      listaVendedores[pedido.sellerId].sumaEstrellas += pedido.rating;
    }
  });

  // Convertir a arreglo y ordenar por volumen de claims publicados de mayor a menor
  const topVendedores = Object.values(listaVendedores).sort((a, b) => b.claimsPublicados - a.claimsPublicados);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
      
      {/* COLUMNA PRINCIPAL */}
      <div style={{ flex: "1 1 60%", minWidth: "300px", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Banner Próximo Drop */}
        <div style={{ background: "linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)", padding: "25px", borderRadius: "12px", border: "1px solid #e74c3c" }}>
           <h2 style={{ margin: "0 0 10px 0", color: "#fff", textShadow: "1px 1px 2px black" }}>⏱ ... Próximo Drop en Agenda</h2>
           {proximoDrop ? (
             <>
               <h3 style={{ color: "#f1c40f", margin: "0 0 5px 0", fontSize: "22px", textShadow: "1px 1px 2px black" }}>{proximoDrop.items}</h3>
               <p style={{ color: "#fff", margin: "0 0 15px 0", textShadow: "1px 1px 2px black" }}>Tienda: <b>{proximoDrop.seller}</b></p>
               <div style={{ background: "rgba(0,0,0,0.6)", padding: "8px 16px", borderRadius: "8px", display: "inline-block", color: "white", fontWeight: "bold", border: "1px solid rgba(255,255,255,0.2)" }}>
                 📅 Día {proximoDia} a las {proximoDrop.time}
               </div>
             </>
           ) : (
             <p style={{ color: "#eee", fontStyle: "italic", textShadow: "1px 1px 2px black" }}>No hay transmisiones programadas en el calendario.</p>
           )}
        </div>

        {/* Feed de Actividad */}
        <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
          <h2 style={{ margin: "0 0 15px 0", color: "#3498db" }}>⚡ Actividad Reciente</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pedidos.length > 0 ? pedidos.slice(-3).reverse().map(pedido => (
              <div key={pedido.id} style={{ padding: "12px", background: "#1a1a1a", borderLeft: "4px solid #2ecc71", borderRadius: "4px" }}>
                <span style={{ color: "white", fontSize: "14px" }}>🎉 <b>{pedido.buyerName}</b> cerró lote de: </span>
                <span style={{ color: "#f1c40f", fontWeight: "bold" }}>{pedido.items.join(", ")}</span>
              </div>
            )) : (
              <p style={{ color: "gray", fontSize: "14px", margin: 0, fontStyle: "italic" }}>Esperando claims definitivos en esta sesión...</p>
            )}
          </div>
        </div>

      </div>

      {/* COLUMNA LATERAL (Estadísticas reales y Top Vendedores Dinámico) */}
      <div style={{ flex: "1 1 30%", minWidth: "280px", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Contador Real */}
        <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333", display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          <div>
            <div style={{ fontSize: "24px", color: "#3498db", fontWeight: "bold" }}>{Object.keys(mercado).length}</div>
            <div style={{ color: "gray", fontSize: "11px" }}>Cartas Vivas</div>
          </div>
          <div>
            <div style={{ fontSize: "24px", color: "#2ecc71", fontWeight: "bold" }}>{pedidos.length}</div>
            <div style={{ color: "gray", fontSize: "11px" }}>Lotes Cerrados</div>
          </div>
        </div>

        {/* Top Vendedores Dinámico */}
        <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
          <h2 style={{ margin: "0 0 15px 0", color: "#f1c40f" }}>🏆 Líderes de Claims</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {topVendedores.map((seller, index) => {
              const totalVal = seller.valoraciones.length;
              const promedio = totalVal > 0 ? (seller.sumaEstrellas / totalVal).toFixed(1) : "N/A";
              
              return (
                <div key={seller.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#1a1a1a", borderRadius: "8px", border: "1px solid #222" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: "bold", color: index === 0 ? "#f1c40f" : "gray" }}>#{index + 1}</span>
                    <div>
                      <div style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>{seller.nombre}</div>
                      <div style={{ color: "gray", fontSize: "11px" }}>{seller.claimsPublicados} piezas subidas</div>
                    </div>
                  </div>
                  <div style={{ color: "#f1c40f", fontSize: "13px", fontWeight: "bold", textAlign: "right" }}>
                    ⭐ {promedio}
                    <div style={{ fontSize: "9px", color: "gray" }}>({totalVal} rev)</div>
                  </div>
                </div>
              );
            })}
            {topVendedores.length === 0 && (
              <p style={{ color: "gray", fontSize: "13px", textAlign: "center", fontStyle: "italic" }}>Sin vendedores activos aún.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}