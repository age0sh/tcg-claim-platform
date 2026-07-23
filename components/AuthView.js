import { useState } from "react";
import { Country, State } from "country-state-city";

export default function AuthView({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [realName, setRealName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryIsoCode, setCountryIsoCode] = useState("");
  const [stateName, setStateName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const isPasswordValid = (pwd) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/.test(pwd);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) return setError("Por favor, llena los campos obligatorios.");
    if (!captchaVerified) return setError("Por favor, verifica que no eres un robot.");

    let finalCityString = "N/A";

    if (!isLogin) {
      if (!username || !realName || !lastName || !countryIsoCode || !stateName) {
        return setError("Por favor, completa todos tus datos de perfil.");
      }
      if (!isPasswordValid(password)) {
        return setError("La contraseña debe cumplir con los requisitos de seguridad.");
      }
      
      const countryFullName = Country.getCountryByCode(countryIsoCode)?.name || "";
      finalCityString = `${stateName}, ${countryFullName}`;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      
      const bodyData = isLogin 
        ? { identifier: email.toLowerCase().trim(), password }
        : { 
            username: username,
            nombres: realName, 
            apellidos: lastName, 
            ciudad: finalCityString, 
            correo: email.toLowerCase().trim(), 
            password: password,
            rol: "comprador"
          };

      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || "Ocurrió un error en la solicitud");

      if (!isLogin) {
        alert("¡Cuenta creada con éxito! Por favor inicia sesión.");
        setIsLogin(true);
        setPassword(""); 
        setCaptchaVerified(false);
        setLoading(false);
        return;
      }

      if (isLogin && data.token) {
        localStorage.setItem("tcg_token", data.token);
        onLogin(data.usuario);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        <h1 style={titleStyle}>TCG CLAIM</h1>
        <p style={subtitleStyle}>
          {isLogin ? "Bienvenido de vuelta al mercado" : "Únete a la plataforma de cartas"}
        </p>

        {error && (
          <div style={errorBoxStyle}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          
          {!isLogin && (
            <>
              <div style={{ textAlign: "left" }}>
                <label style={labelStyle}>Apodo Público o Local</label>
                <input type="text" placeholder="Ej. Pokemart GDL" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <label style={labelStyle}>Nombre(s)</label>
                  <input type="text" placeholder="Juan Carlos" value={realName} onChange={(e) => setRealName(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <label style={labelStyle}>Apellidos</label>
                  <input type="text" placeholder="Pérez López" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <label style={labelStyle}>País</label>
                  <select 
                    value={countryIsoCode} 
                    onChange={(e) => { setCountryIsoCode(e.target.value); setStateName(""); }} 
                    style={selectStyle}
                  >
                    <option value="" disabled>Selecciona...</option>
                    {Country.getAllCountries().map(pais => (
                      <option key={pais.isoCode} value={pais.isoCode} style={{ color: "black" }}>{pais.name}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ flex: 1, textAlign: "left" }}>
                  <label style={labelStyle}>Estado / Región</label>
                  <select 
                    value={stateName} 
                    onChange={(e) => setStateName(e.target.value)} 
                    disabled={!countryIsoCode} 
                    style={{...selectStyle, opacity: countryIsoCode ? 1 : 0.5}}
                  >
                    <option value="" disabled>Selecciona...</option>
                    {countryIsoCode && State.getStatesOfCountry(countryIsoCode).map(estado => (
                      <option key={estado.isoCode} value={estado.name} style={{ color: "black" }}>{estado.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div style={{ textAlign: "left" }}>
            <label style={labelStyle}>Correo Electrónico</label>
            <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          
          <div style={{ textAlign: "left" }}>
            <label style={labelStyle}>Contraseña</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: "40px" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          <div style={captchaBoxStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input type="checkbox" checked={captchaVerified} onChange={(e) => setCaptchaVerified(e.target.checked)} style={{ width: "22px", height: "22px", cursor: "pointer" }} />
              <span style={{ color: "#222", fontSize: "14px", fontWeight: "500" }}>No soy un robot</span>
            </div>
            <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" style={{ width: "28px", opacity: 0.8 }} />
          </div>

          <button type="submit" disabled={loading || !captchaVerified} style={buttonStyle(loading || !captchaVerified)}>
            {loading ? "Procesando..." : (isLogin ? "Entrar al Mercado" : "Crear Cuenta")}
          </button>
        </form>

        <div style={footerStyle}>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); setCaptchaVerified(false); }} style={linkButtonStyle}>
              {isLogin ? "Regístrate aquí" : "Inicia Sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS ---
const containerStyle = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at top, #2c2f33 0%, #111214 100%)", padding: "20px" };
const cardStyle = { background: "rgba(35, 39, 42, 0.8)", backdropFilter: "blur(12px)", padding: "40px 35px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)", width: "100%", maxWidth: "450px", boxShadow: "0 24px 48px rgba(0,0,0,0.7)", textAlign: "center" };
const titleStyle = { margin: "0 0 8px 0", letterSpacing: "2px", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "28px", fontWeight: "800" };
const subtitleStyle = { color: "#9ca3af", marginBottom: "25px", fontSize: "15px", fontWeight: "500" };
const errorBoxStyle = { background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "10px", borderRadius: "6px", marginBottom: "20px", fontSize: "14px", border: "1px solid rgba(239, 68, 68, 0.2)" };
const formStyle = { display: "flex", flexDirection: "column", gap: "14px" };
const inputStyle = { padding: "12px 14px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(0, 0, 0, 0.25)", color: "#f3f4f6", outline: "none", fontSize: "14px", boxSizing: "border-box", width: "100%" };
const selectStyle = { ...inputStyle, cursor: "pointer" };
const labelStyle = { fontSize: "12px", color: "#9ca3af", marginLeft: "4px", marginBottom: "4px", display: "block" };
const eyeButtonStyle = { position: "absolute", right: "12px", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" };
const captchaBoxStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa", border: "1px solid #d3d3d3", borderRadius: "4px", padding: "8px 14px", marginTop: "5px" };
const buttonStyle = (disabled) => ({ background: disabled ? "#4b5563" : "linear-gradient(135deg, #6b7280 0%, #374151 100%)", color: "white", border: "none", padding: "14px", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: disabled ? "not-allowed" : "pointer", marginTop: "8px" });
const footerStyle = { marginTop: "25px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" };
const linkButtonStyle = { background: "none", border: "none", color: "#e5e7eb", cursor: "pointer", fontWeight: "600", marginLeft: "8px", fontSize: "14px", textDecoration: "underline" };