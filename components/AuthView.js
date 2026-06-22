import { useState } from "react";

export default function AuthView({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true); // Cambia entre Login y Registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas de frontend
    if (!email || !password) return alert("Por favor, llena los campos obligatorios.");
    if (!isLogin && !username) return alert("Por favor, ingresa un nombre de usuario.");

    // 🔥 MOCK: Simulación de respuesta de Base de Datos
    // Más adelante, aquí haremos un fetch() a tu backend real.
    const userData = {
      id: "user_" + Math.random().toString(36).slice(2),
      name: isLogin ? email.split("@")[0] : username, // Si hace login, usamos su correo como nombre temporal
    };

    // Guardamos la sesión en el navegador
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userName", userData.name);
    
    // Le avisamos a page.js que el usuario entró
    onLogin(userData);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      backgroundColor: "#000",
      fontFamily: "sans-serif"
    }}>
      <div style={{ 
        background: "#111", 
        padding: "40px", 
        borderRadius: "12px", 
        border: "1px solid #333", 
        width: "100%", 
        maxWidth: "400px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        textAlign: "center"
      }}>
        
        <h1 style={{ color: "#fff", margin: "0 0 10px 0", letterSpacing: "1px" }}>🔥 TCG CLAIM</h1>
        <p style={{ color: "gray", marginBottom: "30px", fontSize: "14px" }}>
          {isLogin ? "Inicia sesión en tu cuenta" : "Únete a la plataforma"}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          {/* Solo mostramos Nombre de Usuario si está en modo Registro */}
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Nombre de Usuario" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ padding: "12px", borderRadius: "6px", border: "1px solid #333", background: "#222", color: "white", outline: "none", fontSize: "15px" }} 
            />
          )}

          <input 
            type="email" 
            placeholder="Correo Electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "12px", borderRadius: "6px", border: "1px solid #333", background: "#222", color: "white", outline: "none", fontSize: "15px" }} 
          />
          
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "12px", borderRadius: "6px", border: "1px solid #333", background: "#222", color: "white", outline: "none", fontSize: "15px" }} 
          />

          <button 
            type="submit" 
            style={{ background: "#3498db", color: "white", border: "none", padding: "14px", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", marginTop: "10px", transition: "background 0.2s" }}
          >
            {isLogin ? "Entrar al Mercado" : "Crear Cuenta"}
          </button>
        </form>

        <div style={{ marginTop: "25px", borderTop: "1px solid #222", paddingTop: "20px" }}>
          <p style={{ color: "gray", fontSize: "14px", margin: 0 }}>
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: "none", border: "none", color: "#3498db", cursor: "pointer", fontWeight: "bold", marginLeft: "5px" }}
            >
              {isLogin ? "Regístrate aquí" : "Inicia Sesión"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}