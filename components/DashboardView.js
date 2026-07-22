import { useState } from "react";

// ======================================================
// GALERÍA DE ICONOS SVG (Estilo Moderno/Bootstrap)
// ======================================================
const Icons = {
  Crown: () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.5 1a.5.5 0 0 1 .5.5v2.85l3.228-1.22a.5.5 0 0 1 .65.86l-2.1 3.518c.036.19.052.388.052.592A4.492 4.492 0 0 1 8.5 12.5a4.492 4.492 0 0 1-4.33-3.4H4.15A5.5 5.5 0 0 0 9.5 13.5a5.5 5.5 0 0 0 5.48-5.027l-2.11 3.535a.5.5 0 0 1-.86-.646l3.24-5.416a.5.5 0 0 1 .843-.024l2.128 3.565A6.5 6.5 0 0 1 9.5 14.5a6.5 6.5 0 0 1-6.495-6.105H2.99a.5.5 0 0 1-.41-.78l3.24-5.415a.5.5 0 0 1 .86.645l-2.11 3.536A5.5 5.5 0 0 0 9.5 2.5v-1a.5.5 0 0 1 .5-.5z"/><path d="M8 1.5a.5.5 0 0 1 .5.5v2.242A4.5 4.5 0 0 1 12.5 8.5H13a5.5 5.5 0 0 0-5.5-5.5V1.5a.5.5 0 0 1 .5-.5z"/><path d="M8 1.5a.5.5 0 0 0-.5.5v2.242A4.5 4.5 0 0 0 3.5 8.5H3a5.5 5.5 0 0 1 5.5-5.5V1.5a.5.5 0 0 0-.5-.5z"/></svg>,
  Clock: () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>,
  Calendar: () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>,
  Lightning: () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5zM6.374 1 4.168 8.5H7.5a.5.5 0 0 1 .478.647L6.78 13.04 11.478 7H8a.5.5 0 0 1-.474-.658L9.306 1H6.374z"/></svg>,
  Trophy: () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935zM3.504 1c.007.517.026 1.006.056 1.469.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 8 10s2.706-.52 3.57-2.864c.413-1.12.74-2.64.87-4.667.03-.463.049-.952.056-1.469H3.504z"/></svg>,
  Star: () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>,
  Check: () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
};

export default function DashboardView({ onSelectSeller, sellersList = [], mercado = {}, pedidos = [], calendario = {} }) {
  
  const localesPremium = sellersList.filter(seller => seller.tipo === "local" && seller.verificado === true);

  const fechasConEventos = Object.keys(calendario).filter(date => calendario[date] && calendario[date].length > 0).sort();
  const proximaFecha = fechasConEventos.length > 0 ? fechasConEventos[0] : null;
  const proximoDrop = proximaFecha ? calendario[proximaFecha][0] : null;

  // 3. 🏆 LÍDERES DE CLAIMS (Ahora agrupa por Nombre)
  const listaVendedores = {};
  
  const procesarVenta = (sellerId, sellerName, rating = null) => {
    // Si la base de datos vieja no tiene nombre, usamos un genérico en vez de explotar
    const nombreReal = sellerName || "Vendedor";
    
    if (!listaVendedores[sellerId]) {
      listaVendedores[sellerId] = { 
        id: sellerId, 
        nombre: nombreReal, 
        claimsPublicados: 0, 
        valoraciones: [], 
        sumaEstrellas: 0 
      };
    }
    
    // Si ya existe pero el nombre era viejo/malo, lo actualizamos al real
    if (listaVendedores[sellerId].nombre === "Vendedor" && sellerName) {
      listaVendedores[sellerId].nombre = sellerName;
    }

    listaVendedores[sellerId].claimsPublicados += 1;
    if (rating) {
      listaVendedores[sellerId].valoraciones.push(rating);
      listaVendedores[sellerId].sumaEstrellas += rating;
    }
  };

  Object.values(mercado).forEach(carta => procesarVenta(carta.sellerId, carta.sellerName));
  pedidos.forEach(pedido => procesarVenta(pedido.sellerId, pedido.sellerName, pedido.rating));
  
  const topVendedores = Object.values(listaVendedores).sort((a, b) => b.claimsPublicados - a.claimsPublicados);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px", animation: "fadeIn 0.4s ease-in-out", fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      
      <div style={panelStyle}>
        <h2 style={{ ...titleStyle, color: "#c084fc" }}><Icons.Crown /> Locales Verificados</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "18px", marginTop: "15px" }}>
          {localesPremium.length > 0 ? (
            localesPremium.map(local => (
              <div 
                key={local.id}
                onClick={() => onSelectSeller(local)}
                style={cardPremiumStyle}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "#c084fc"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(192, 132, 252, 0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(192, 132, 252, 0.3)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={badgePremiumStyle}>Tienda Física</span>
                  <span style={{ color: "#fbbf24", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}><Icons.Star /> {local.rep}</span>
                </div>
                <h3 style={{ margin: "0 0 6px 0", color: "#f8fafc", fontSize: "18px", fontWeight: "700", letterSpacing: "0.5px" }}>{local.nombre}</h3>
                <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 14px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Ubicación Verificada
                </p>
                <div style={{ color: "#6b7280", fontSize: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px", transition: "color 0.2s" }}>
                  Explorar catálogo y carpetas ➔
                </div>
              </div>
            ))
          ) : (
            <div style={emptyStateStyle}>Aún no hay tiendas físicas verificadas en la plataforma.</div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "25px" }}>
        
        <div style={{ flex: "1 1 55%", minWidth: "300px", display: "flex", flexDirection: "column", gap: "25px" }}>
          
          <div style={{ ...panelStyle, background: "linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)", borderColor: "rgba(59, 130, 246, 0.3)" }}>
             <h2 style={{ ...titleStyle, color: "#60a5fa" }}><Icons.Clock /> Próximo Evento</h2>
             {proximoDrop ? (
               <div style={{ marginTop: "15px" }}>
                 <h3 style={{ color: "#f8fafc", margin: "0 0 6px 0", fontSize: "22px", fontWeight: "800" }}>{proximoDrop.description}</h3>
                 <p style={{ color: "#9ca3af", margin: "0 0 18px 0", fontSize: "14px" }}>Organiza: <span style={{ color: "#e2e8f0", fontWeight: "600" }}>{proximoDrop.seller}</span></p>
                 <div style={{ background: "rgba(59, 130, 246, 0.1)", padding: "8px 14px", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "8px", color: "#60a5fa", fontWeight: "600", fontSize: "13px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                   <Icons.Calendar /> {proximaFecha} • {proximoDrop.time}
                 </div>
               </div>
             ) : (
               <p style={{ color: "#6b7280", fontSize: "14px", margin: "15px 0 0 0", fontStyle: "italic" }}>No hay eventos agendados en el calendario.</p>
             )}
          </div>

          <div style={panelStyle}>
            <h3 style={{ ...titleStyle, color: "#4ade80" }}><Icons.Lightning /> Ventas Recientes</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
              {pedidos.length > 0 ? pedidos.slice(-4).reverse().map(pedido => (
                <div key={pedido.id} style={feedItemStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#4ade80" }}><Icons.Check /></span>
                    {/* 🔥 AQUÍ TAMBIÉN CORREGIMOS EL NOMBRE DEL COMPRADOR */}
                    <span style={{ color: "#e2e8f0" }}><span style={{ fontWeight: "600", color: "#fff" }}>{pedido.buyerName || "Un coleccionista"}</span> adquirió: <span style={{ color: "#fbbf24", fontWeight: "600" }}>{pedido.items.join(", ")}</span></span>
                  </div>
                  <span style={{ color: "#4ade80", fontSize: "12px", fontWeight: "700", background: "rgba(74, 222, 128, 0.1)", padding: "4px 8px", borderRadius: "4px" }}>
                    ${pedido.total}
                  </span>
                </div>
              )) : (
                <p style={{ color: "#6b7280", fontSize: "13px", margin: 0, fontStyle: "italic" }}>Esperando cierres de lote en vivo...</p>
              )}
            </div>
          </div>
        </div>

        <div style={{ flex: "1 1 35%", minWidth: "280px", display: "flex", flexDirection: "column", gap: "25px" }}>
          
          <div style={{ ...panelStyle, display: "flex", justifyContent: "space-around", textAlign: "center", padding: "25px 20px" }}>
            <div>
              <div style={{ fontSize: "32px", color: "#60a5fa", fontWeight: "800", textShadow: "0 2px 10px rgba(96, 165, 250, 0.3)" }}>{Object.keys(mercado).length}</div>
              <div style={{ color: "#9ca3af", fontSize: "11px", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Claims Activas</div>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: "25px" }}>
              <div style={{ fontSize: "32px", color: "#4ade80", fontWeight: "800", textShadow: "0 2px 10px rgba(74, 222, 128, 0.3)" }}>{pedidos.length}</div>
              <div style={{ color: "#9ca3af", fontSize: "11px", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Lotes Entregados</div>
            </div>
          </div>

          <div style={{ ...panelStyle, flex: 1 }}>
            <h3 style={{ ...titleStyle, color: "#fbbf24" }}><Icons.Trophy /> Top Vendedores</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
              {topVendedores.slice(0, 5).map((seller, index) => {
                const totalVal = seller.valoraciones.length;
                const promedio = totalVal > 0 ? (seller.sumaEstrellas / totalVal).toFixed(1) : "5.0";
                
                const medalColor = index === 0 ? "#fbbf24" : index === 1 ? "#cbd5e1" : index === 2 ? "#d97706" : "#6b7280";

                return (
                  // 🔥 AQUÍ ESTÁ EL ONCLICK PARA VER EL PERFIL
                  <div 
                    key={seller.id || index} 
                    onClick={() => onSelectSeller({
                      id: seller.id,
                      nombre: seller.nombre,
                      rep: promedio,
                      ventas: seller.claimsPublicados,
                      tipo: "independiente", 
                      descripcion: "Vendedor verificado por la comunidad de TCG Claim."
                    })}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(0, 0, 0, 0.2)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.03)", transition: "background 0.2s", cursor: "pointer" }} 
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} 
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.2)"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontWeight: "800", color: medalColor, fontSize: "16px" }}>#{index + 1}</span>
                      <div>
                        <div style={{ color: "#f8fafc", fontWeight: "600", fontSize: "14px" }}>{seller.nombre}</div>
                        <div style={{ color: "#9ca3af", fontSize: "12px" }}>{seller.claimsPublicados} ventas globales</div>
                      </div>
                    </div>
                    <div style={{ color: "#fbbf24", fontWeight: "700", fontSize: "13px", background: "rgba(251, 191, 36, 0.1)", padding: "4px 8px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Icons.Star /> {promedio}
                    </div>
                  </div>
                );
              })}
              {topVendedores.length === 0 && (
                <p style={{ color: "#6b7280", fontSize: "13px", textAlign: "center", fontStyle: "italic", marginTop: "10px" }}>No hay actividad registrada en esta sesión.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ================= ESTILOS REUTILIZABLES =================

const panelStyle = {
  background: "rgba(35, 39, 42, 0.6)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
};

const titleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  letterSpacing: "0.5px"
};

const cardPremiumStyle = {
  background: "linear-gradient(145deg, rgba(30, 30, 36, 0.9) 0%, rgba(15, 15, 18, 0.9) 100%)",
  border: "1px solid rgba(192, 132, 252, 0.3)",
  padding: "20px",
  borderRadius: "14px",
  cursor: "pointer",
  transition: "all 0.25s ease",
  display: "flex",
  flexDirection: "column"
};

const badgePremiumStyle = {
  fontSize: "11px",
  color: "#e879f9",
  background: "rgba(232, 121, 249, 0.1)",
  padding: "4px 10px",
  borderRadius: "6px",
  fontWeight: "700",
  border: "1px solid rgba(232, 121, 249, 0.2)",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const emptyStateStyle = {
  background: "rgba(0,0,0,0.2)",
  padding: "25px",
  borderRadius: "12px",
  border: "1px dashed rgba(255,255,255,0.1)",
  color: "#6b7280",
  fontSize: "14px",
  textAlign: "center",
  gridColumn: "1 / -1"
};

const feedItemStyle = {
  padding: "14px 16px",
  background: "rgba(0,0,0,0.2)",
  borderLeft: "4px solid #4ade80",
  borderRadius: "8px",
  fontSize: "13.5px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "background 0.2s",
};