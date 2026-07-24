"use client";

// ##################################################################
// # SECCIÓN 1: IMPORTACIONES Y COMPONENTES
// ##################################################################
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

import ClaimsView from "@/components/ClaimsView";
import DashboardView from "@/components/DashboardView";
import SellerProfileView from "@/components/SellerProfileView";
import { CalendarView, ProfileView } from "@/components/OtherViews";
import SellerMarketView from "@/components/SellerMarketView";
import AuthView from "@/components/AuthView";
import BecomeSellerView from "@/components/BecomeSellerView";
import LocalStoreView from "@/components/LocalStoreView";
import PublicLocalStoreView from "@/components/PublicLocalStoreView";

// 🔥 Iconos para la Barra de Navegación
const NavIcons = {
  Store: () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3z"/></svg>,
  Star: () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>,
  User: () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>,
  Crown: () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M10.5 1a.5.5 0 0 1 .5.5v2.85l3.228-1.22a.5.5 0 0 1 .65.86l-2.1 3.518c.036.19.052.388.052.592A4.492 4.492 0 0 1 8.5 12.5a4.492 4.492 0 0 1-4.33-3.4H4.15A5.5 5.5 0 0 0 9.5 13.5a5.5 5.5 0 0 0 5.48-5.027l-2.11 3.535a.5.5 0 0 1-.86-.646l3.24-5.416a.5.5 0 0 1 .843-.024l2.128 3.565A6.5 6.5 0 0 1 9.5 14.5a6.5 6.5 0 0 1-6.495-6.105H2.99a.5.5 0 0 1-.41-.78l3.24-5.415a.5.5 0 0 1 .86.645l-2.11 3.536A5.5 5.5 0 0 0 9.5 2.5v-1a.5.5 0 0 1 .5-.5z"/><path d="M8 1.5a.5.5 0 0 1 .5.5v2.242A4.5 4.5 0 0 1 12.5 8.5H13a5.5 5.5 0 0 0-5.5-5.5V1.5a.5.5 0 0 1 .5-.5z"/><path d="M8 1.5a.5.5 0 0 0-.5.5v2.242A4.5 4.5 0 0 0 3.5 8.5H3a5.5 5.5 0 0 1 5.5-5.5V1.5a.5.5 0 0 0-.5-.5z"/></svg>
};

// ##################################################################
// # SECCIÓN 2: CONFIGURACIÓN DEL SOCKET
// ##################################################################
function useSocket() {
  const socketRef = useRef(null);
  if (!socketRef.current) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://tcg-claim-platform.onrender.com";
    socketRef.current = io(BACKEND_URL);
  }
  return socketRef.current;
}

export default function Home() {
  const socket = useSocket();
  
  // Estados de datos de la plataforma
  const [cartas, setCartas] = useState({});
  const [pedidos, setPedidos] = useState([]);
  const [calendario, setCalendario] = useState({});
  
  // 🔥 Lista de tiendas limpia (sin datos hardcodeados)
  const [sellersList, setSellersList] = useState([]); 
  
  // Estados de interfaz y usuario
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("inicio");
  const [selectedSeller, setSelectedSeller] = useState(null);

  // Estados de vendedor
  const [userRole, setUserRole] = useState("comprador");
  const [sellerStatus, setSellerStatus] = useState("none"); 
  const [userTier, setUserTier] = useState("free"); 
  const [marketMode, setMarketMode] = useState("comprar"); 

  // ##################################################################
  // # SECCIÓN 5: EFECTOS SECUNDARIOS (AUTENTICACIÓN Y SOCKETS)
  // ##################################################################
  useEffect(() => {
    const storedUser = localStorage.getItem("tcg_user");
    const storedToken = localStorage.getItem("tcg_token");
    const storedRole = localStorage.getItem("tcg_role");
    const storedStatus = localStorage.getItem("tcg_status");
    const storedTier = localStorage.getItem("tcg_tier");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      if (storedRole) setUserRole(storedRole);
      if (storedStatus) setSellerStatus(storedStatus);
      if (storedTier) setUserTier(storedTier);
    }
  }, []);

  useEffect(() => {
    socket.on("estado-inicial", (data) => setCartas(data));
    socket.on("actualizar", (data) => setCartas(data));
    socket.on("calendario-actualizado", (data) => setCalendario(data)); 
    socket.on("pedidos-actualizados", (data) => setPedidos(data));

    socket.emit("solicitar-datos");

    return () => { 
      socket.off("estado-inicial"); 
      socket.off("actualizar"); 
      socket.off("calendario-actualizado");
      socket.off("pedidos-actualizados");
    };
  }, [socket]);

  // ##################################################################
  // # SECCIÓN 6: FUNCIONES DE ACCIÓN (LÓGICA DEL NEGOCIO)
  // ##################################################################
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("tcg_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.clear(); // Limpiamos todo el caché
    setUser(null);
    setUserRole("comprador");
    setSellerStatus("none");
    setUserTier("free");
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setSelectedSeller(null);
  };

  const handleBecomeSeller = (formData) => {
    alert("✅ ¡Solicitud aprobada con éxito!");
    setSellerStatus("approved");
    setUserRole("vendedor");
    
    localStorage.setItem("tcg_role", "vendedor");
    localStorage.setItem("tcg_status", "approved");

    if (formData.tier) {
      setUserTier(formData.tier);
      localStorage.setItem("tcg_tier", formData.tier);
    }

    if (formData.tipo === "local") {
      const newLocalStore = {
        id: user._id || user.id,
        nombre: `${user.username.toUpperCase()} TCG Store`,
        rep: "5.0", 
        ventas: 0,
        verificado: true,
        tipo: "local",
        publicMessage: "¡Nuestra nueva tienda digital premium! Bienvenidos.",
        descripcion: formData.ubicacion || "Tienda Oficial"
      };
      setSellersList((prev) => [newLocalStore, ...prev]);
    }

    setCurrentTab("claims");
    setMarketMode(formData.tier === "premium" ? "local" : "vender");
  };

  if (!user) {
    return <AuthView onLogin={handleLoginSuccess} />;
  }

  // ##################################################################
  // # SECCIÓN 8: RENDERIZADO PRINCIPAL (DISEÑO Y CONTENEDOR)
  // ##################################################################
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#0f1015", fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      
      <style>{`
        .nav-container { display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; background: rgba(17, 18, 20, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.05); position: sticky; top: 0; z-index: 50; }
        .desktop-nav { display: flex; align-items: center; gap: 20px; }
        .nav-btn { background: none; border: none; cursor: pointer; font-size: 14px; transition: color 0.2s; }
        .mobile-btn { display: none; background: none; border: none; color: white; font-size: 24px; cursor: pointer; }
        .mobile-menu { display: none; }
        
        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-btn { display: block; }
          .mobile-menu { 
            display: flex; flex-direction: column; background: #111214; 
            position: absolute; top: 100%; left: 0; right: 0; 
            padding: 20px; border-bottom: 1px solid #333; z-index: 1000; gap: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
          }
        }
      `}</style>

      {/* ################################################################## */}
      {/* # SECCIÓN 9: BARRA DE NAVEGACIÓN (NAVBAR)                          */}
      {/* ################################################################## */}
      <nav className="nav-container">
        <div style={{ color: "#fff", fontWeight: "800", fontSize: "22px", letterSpacing: "1px", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          TCG CLAIM
        </div>
        
        <button className="mobile-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* 9.1 MENÚ DE ESCRITORIO */}
        <div className="desktop-nav">
          <button className="nav-btn" onClick={() => { handleTabChange("inicio"); setMenuOpen(false); }} style={{ color: currentTab === "inicio" ? "#4facfe" : "#9ca3af", fontWeight: currentTab === "inicio" ? "bold" : "500" }}>Inicio</button>
          <button className="nav-btn" onClick={() => { handleTabChange("claims"); setMenuOpen(false); }} style={{ color: currentTab === "claims" ? "#4facfe" : "#9ca3af", fontWeight: currentTab === "claims" ? "bold" : "500" }}>Mercado</button>
          <button className="nav-btn" onClick={() => { handleTabChange("calendar"); setMenuOpen(false); }} style={{ color: currentTab === "calendar" ? "#4facfe" : "#9ca3af", fontWeight: currentTab === "calendar" ? "bold" : "500" }}>Calendario</button>
          
          <div style={{ paddingLeft: "15px", borderLeft: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "10px" }}>
            
            {/* Panel Principal */}
            {userRole === "vendedor" && (
              <button onClick={() => { handleTabChange("claims"); setMarketMode(userTier === "premium" ? "local" : "vender"); setMenuOpen(false); }} style={{ background: "rgba(241, 196, 15, 0.1)", color: "#f1c40f", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: "bold", border: "1px solid rgba(241, 196, 15, 0.3)", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px" }}>
                <NavIcons.Store /> Panel {userTier === "premium" ? "Local" : "Vendedor"}
              </button>
            )}

            {/* 🔥 Botón de UPGRADE a Tienda Local */}
            {userRole === "vendedor" && userTier !== "premium" && (
              <button onClick={() => { handleTabChange("becomeSeller"); setMenuOpen(false); }} style={{ background: "transparent", border: "1px solid #2ecc71", color: "#2ecc71", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
                <NavIcons.Crown /> Mejorar a Local
              </button>
            )}

            {/* Estados para usuarios base */}
            {sellerStatus === "pending" && userRole !== "vendedor" && (
              <span style={{ color: "#9ca3af", fontSize: "13px", fontWeight: "bold", padding: "6px 12px" }}>⏳ En revisión</span>
            )}

            {sellerStatus !== "pending" && userRole !== "vendedor" && (
              <button onClick={() => { handleTabChange("becomeSeller"); setMenuOpen(false); }} style={{ background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>
                Vender ➔
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingLeft: "15px", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
            
            {/* 🔥 Avatar clickeable con Icono Dinámico */}
            <div 
              onClick={() => { handleTabChange("profile"); setMenuOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "4px 8px", borderRadius: "8px", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              title="Ir a Mi Perfil"
            >
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "12px" }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: userTier === "premium" ? "#2ecc71" : userRole === "vendedor" ? "#f1c40f" : "#3498db", display: "flex" }}>
                  {userTier === "premium" ? <NavIcons.Store /> : userRole === "vendedor" ? <NavIcons.Star /> : <NavIcons.User />}
                </span>
                <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "600" }}>{user.username}</span>
              </div>
            </div>
            
            <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>Salir</button>
          </div>
        </div>

        {/* 9.2 MENÚ DESPLEGABLE (CELULARES) */}
        {menuOpen && (
          <div className="mobile-menu">
            <div 
              onClick={() => { handleTabChange("profile"); setMenuOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", marginBottom: "10px", cursor: "pointer", transition: "background 0.2s" }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "14px" }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: "white", fontWeight: "bold" }}>{user.username}</span>
              <span style={{ marginLeft: "auto", color: "#9ca3af", fontSize: "12px" }}>Ver Perfil ➔</span>
            </div>

            <button onClick={() => { handleTabChange("inicio"); setMenuOpen(false); }} style={{ background: currentTab === "inicio" ? "rgba(79, 172, 254, 0.15)" : "transparent", color: currentTab === "inicio" ? "#4facfe" : "white", border: "none", padding: "12px", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", textAlign: "left" }}>Inicio</button>
            <button onClick={() => { handleTabChange("claims"); setMenuOpen(false); }} style={{ background: currentTab === "claims" ? "rgba(79, 172, 254, 0.15)" : "transparent", color: currentTab === "claims" ? "#4facfe" : "white", border: "none", padding: "12px", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", textAlign: "left" }}>Mercado en Vivo</button>
            <button onClick={() => { handleTabChange("calendar"); setMenuOpen(false); }} style={{ background: currentTab === "calendar" ? "rgba(79, 172, 254, 0.15)" : "transparent", color: currentTab === "calendar" ? "#4facfe" : "white", border: "none", padding: "12px", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", textAlign: "left" }}>Calendario</button>
            
            <hr style={{ borderColor: "rgba(255,255,255,0.05)", width: "100%", margin: "10px 0" }}/>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {userRole === "vendedor" ? (
                <>
                  <button onClick={() => { handleTabChange("claims"); setMarketMode(userTier === "premium" ? "local" : "vender"); setMenuOpen(false); }} style={{ background: "rgba(241, 196, 15, 0.1)", color: "#f1c40f", padding: "12px", borderRadius: "6px", fontWeight: "bold", border: "1px solid rgba(241, 196, 15, 0.3)" }}>Panel {userTier === "premium" ? "Local" : "Vendedor"}</button>
                  {userTier !== "premium" && (
                    <button onClick={() => { handleTabChange("becomeSeller"); setMenuOpen(false); }} style={{ background: "transparent", border: "1px solid #2ecc71", color: "#2ecc71", padding: "12px", borderRadius: "6px", fontWeight: "bold" }}>Mejorar a Local</button>
                  )}
                </>
              ) : sellerStatus === "pending" ? (
                <div style={{ color: "#9ca3af", fontWeight: "bold", padding: "12px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "6px" }}>⏳ Solicitud en Revisión</div>
              ) : (
                <button onClick={() => { handleTabChange("becomeSeller"); setMenuOpen(false); }} style={{ background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)", color: "white", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "bold" }}>Vender en TCG Claim ➔</button>
              )}
              <button onClick={handleLogout} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "12px", borderRadius: "6px", fontWeight: "bold" }}>Cerrar Sesión</button>
            </div>
          </div>
        )}
      </nav>

      {/* ################################################################## */}
      {/* # SECCIÓN 10: ENRUTAMIENTO Y RENDERIZADO                           */}
      {/* ################################################################## */}
      <main style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", flex: 1, width: "100%" }}>
        
        {currentTab === "inicio" && !selectedSeller && (
          <DashboardView onSelectSeller={setSelectedSeller} sellersList={sellersList} mercado={cartas} pedidos={pedidos} calendario={calendario} />
        )}
        
        {currentTab === "inicio" && selectedSeller && (
          selectedSeller.tipo === "local" 
            ? <PublicLocalStoreView seller={selectedSeller} onBack={() => setSelectedSeller(null)} />
            : <SellerProfileView seller={selectedSeller} onBack={() => setSelectedSeller(null)} />
        )}
        
        {currentTab === "becomeSeller" && (
          <BecomeSellerView onCancel={() => setCurrentTab("inicio")} onSubmit={handleBecomeSeller} />
        )}

        {currentTab === "claims" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            
            {userRole === "vendedor" && (
              <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "30px", flexWrap: "wrap" }}>
                <button 
                  onClick={() => setMarketMode("comprar")}
                  style={{ flex: "1 1 200px", maxWidth: "250px", padding: "14px", borderRadius: "10px", border: marketMode === "comprar" ? "2px solid #4facfe" : "1px solid rgba(255,255,255,0.05)", background: marketMode === "comprar" ? "rgba(79, 172, 254, 0.1)" : "rgba(35, 39, 42, 0.6)", color: marketMode === "comprar" ? "#4facfe" : "#9ca3af", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <span style={{marginRight:"8px"}}>🛍️</span> Comprar Cartas
                </button>
                <button 
                  onClick={() => setMarketMode("vender")}
                  style={{ flex: "1 1 200px", maxWidth: "250px", padding: "14px", borderRadius: "10px", border: marketMode === "vender" ? "2px solid #f1c40f" : "1px solid rgba(255,255,255,0.05)", background: marketMode === "vender" ? "rgba(241, 196, 15, 0.1)" : "rgba(35, 39, 42, 0.6)", color: marketMode === "vender" ? "#f1c40f" : "#9ca3af", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <span style={{marginRight:"8px"}}>🔴</span> Mercado en Vivo
                </button>
                
                {userTier === "premium" && (
                  <button 
                    onClick={() => setMarketMode("local")}
                    style={{ flex: "1 1 200px", maxWidth: "250px", padding: "14px", borderRadius: "10px", border: marketMode === "local" ? "2px solid #2ecc71" : "1px solid rgba(255,255,255,0.05)", background: marketMode === "local" ? "rgba(46, 204, 113, 0.1)" : "rgba(35, 39, 42, 0.6)", color: marketMode === "local" ? "#2ecc71" : "#9ca3af", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    <span style={{marginRight:"8px"}}>👑</span> Mi Local Digital
                  </button>
                )}
              </div>
            )}

            {(userRole === "comprador" || (userRole === "vendedor" && marketMode === "comprar")) && (
              // 🔥 AQUÍ AGREGAMOS EL userName
              <ClaimsView socket={socket} userId={user._id || user.id} userName={user.username} cartas={cartas} pedidos={pedidos} />
            )}
            
            {userRole === "vendedor" && marketMode === "vender" && (
              <SellerMarketView socket={socket} userId={user._id || user.id} userName={user.username} mercado={cartas} pedidos={pedidos} />
            )}

            {userRole === "vendedor" && marketMode === "local" && userTier === "premium" && (
              <LocalStoreView userName={user.username} />
            )}
          </div>
        )}
        
        {currentTab === "calendar" && <CalendarView userId={user._id || user.id} userRole={userRole} userName={user.username} socket={socket} calendario={calendario} />}
        
        {currentTab === "profile" && <ProfileView userId={user._id || user.id} userName={user.username} userRole={userRole} pedidos={pedidos} socket={socket} />}
      </main>

      {/* ################################################################## */}
      {/* # SECCIÓN 11: FOOTER (PIE DE PÁGINA)                               */}
      {/* ################################################################## */}
      <footer style={{ background: "#0a0a0c", padding: "40px 20px", borderTop: "1px solid #222", marginTop: "40px", textAlign: "center" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
          <div style={{ color: "#fff", fontWeight: "800", fontSize: "18px", letterSpacing: "1px", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            TCG CLAIM
          </div>
          <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
            © {new Date().getFullYear()} TCG Claim. Todos los derechos reservados.
          </p>
          <div style={{ display: "flex", gap: "20px", marginTop: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href="#" style={{ color: "#9ca3af", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>Políticas de Devolución</a>
            <a href="#" style={{ color: "#9ca3af", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>Política de Privacidad</a>
            <a href="#" style={{ color: "#9ca3af", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>Términos y Condiciones</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
