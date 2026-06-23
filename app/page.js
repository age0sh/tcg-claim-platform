"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Importación de componentes
import ClaimsView from "@/components/ClaimsView";
import DashboardView from "@/components/DashboardView";
import SellerProfileView from "@/components/SellerProfileView";
import { CalendarView, ProfileView } from "@/components/OtherViews";
import SellerMarketView from "@/components/SellerMarketView";
// 🔥 Nuevo componente de autenticación
import AuthView from "@/components/AuthView";

// 🔥 Hook para socket listo para Producción
function useSocket() {
  const socketRef = useRef(null);
  if (!socketRef.current) {
    // Si existe la variable de la nube la usa, si no, usa localhost
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
    socketRef.current = io(BACKEND_URL);
  }
  return socketRef.current;
}

const mockSellers = [
  { id: 1, nombre: "PokeMaster99", rep: "5.0", ventas: 342, verificado: true, cancelaciones: "0%", tiempo: "2 años", descripcion: "Coleccionista de Kanto. Envíos en toploader." },
  { id: 2, nombre: "CardCollector_GDL", rep: "4.9", ventas: 215, verificado: true, cancelaciones: "1.2%", tiempo: "1 año", descripcion: "Cazador de ofertas y aperturas en vivo." },
  { id: 3, nombre: "TcgVault", rep: "4.8", ventas: 189, verificado: false, cancelaciones: "0%", tiempo: "6 meses", descripcion: "Cartas sueltas de las expansiones más recientes." }
];

export default function Home() {
  const socket = useSocket();
  const [cartas, setCartas] = useState({});
  
  // 🔥 Nuevo estado para el Objeto Usuario (antes era solo userId)
  const [user, setUser] = useState(null);
  
  const [currentTab, setCurrentTab] = useState("inicio");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [userRole, setUserRole] = useState("comprador");
  const [calendario, setCalendario] = useState({});

  // Verificar si ya hay una sesión guardada al cargar la página
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    socket.on("calendario-actualizado", (data) => setCalendario(data));
    
    if (storedId && storedName) {
      setUser({ id: storedId, name: storedName });
    }
  }, []);

  // Escuchar a los Sockets
  useEffect(() => {
    socket.on("estado-inicial", (data) => setCartas(data));
    socket.on("actualizar", (data) => setCartas(data));
    return () => { socket.off("estado-inicial"); socket.off("actualizar"); };
  }, [socket]);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setUser(null);
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setSelectedSeller(null);
  };

  // 🛡️ BARRERA DE SEGURIDAD: Si no hay usuario, mostrar Login
  if (!user) {
    return <AuthView onLogin={setUser} />;
  }

  // 🖥️ PLATAFORMA PRINCIPAL (Usuario Logueado)
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", fontFamily: "sans-serif" }}>
      
      {/* Barra de Navegación Principal */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", background: "#111", borderBottom: "1px solid #333" }}>
        <div style={{ color: "#fff", fontWeight: "bold", fontSize: "20px", letterSpacing: "1px" }}>🔥 TCG CLAIM</div>
        
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <button onClick={() => handleTabChange("inicio")} style={{ background: "none", border: "none", cursor: "pointer", color: currentTab === "inicio" ? "#3498db" : "gray", fontWeight: currentTab === "inicio" ? "bold" : "normal" }}>Inicio</button>
          <button onClick={() => handleTabChange("claims")} style={{ background: "none", border: "none", cursor: "pointer", color: currentTab === "claims" ? "#3498db" : "gray", fontWeight: currentTab === "claims" ? "bold" : "normal" }}>Mercado</button>
          <button onClick={() => handleTabChange("calendar")} style={{ background: "none", border: "none", cursor: "pointer", color: currentTab === "calendar" ? "#3498db" : "gray", fontWeight: currentTab === "calendar" ? "bold" : "normal" }}>Calendario</button>
          <button onClick={() => handleTabChange("profile")} style={{ background: "none", border: "none", cursor: "pointer", color: currentTab === "profile" ? "#3498db" : "gray", fontWeight: currentTab === "profile" ? "bold" : "normal" }}>Mi Perfil</button>

          {/* Selector de Modo */}
          <div style={{ marginLeft: "15px", paddingLeft: "15px", borderLeft: "1px solid #333" }}>
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
              style={{ padding: "8px", borderRadius: "6px", background: "#222", color: "#f1c40f", border: "1px solid #444", fontWeight: "bold", cursor: "pointer", outline: "none" }}
            >
              <option value="comprador">🛒 Modo Comprador</option>
              <option value="vendedor">⭐ Modo Vendedor</option>
            </select>
          </div>

          {/* 🔥 Menú del Usuario Actual y Cerrar Sesión */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "15px", paddingLeft: "15px", borderLeft: "1px solid #333" }}>
            <span style={{ color: "white", fontSize: "14px" }}>Hola, <b>{user.name}</b></span>
            <button 
              onClick={handleLogout}
              style={{ background: "transparent", border: "1px solid #e74c3c", color: "#e74c3c", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
            >
              Salir
            </button>
          </div>

        </div>
      </nav>

      {/* Contenido Dinámico */}
      <main style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {currentTab === "inicio" && !selectedSeller && <DashboardView onSelectSeller={setSelectedSeller} mockSellers={mockSellers} />}
        {currentTab === "inicio" && selectedSeller && <SellerProfileView seller={selectedSeller} onBack={() => setSelectedSeller(null)} />}
        
        {/* Pasamos user.id en lugar de userId */}
        {currentTab === "claims" && userRole === "comprador" && <ClaimsView cartas={cartas} socket={socket} userId={user.id} />}
        {currentTab === "claims" && userRole === "vendedor" && <SellerMarketView socket={socket} userId={user.id} mercado={cartas} />}
        
        {currentTab === "calendar" && <CalendarView userId={user.id} userRole={userRole} userName={user.name} socket={socket} calendario={calendario} />}
        {currentTab === "profile" && <ProfileView userId={user.id} userName={user.name} userRole={userRole} socket={socket} />}
      </main>

    </div>
  );
}