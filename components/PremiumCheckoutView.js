import { useState } from "react";

export default function PremiumCheckoutView({ onCancel, onSuccess }) {
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" o "yearly"
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({ name: "", number: "", expiry: "", cvc: "" });

  const price = billingCycle === "monthly" ? 299 : 2399; // MXN
  const savings = billingCycle === "yearly" ? "¡Ahorras $1,189 MXN al año!" : null;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvc) {
      return alert("Por favor, completa todos los campos de la tarjeta.");
    }

    setLoading(true);

    // Simulación de pasarela de pago (Stripe/PayPal Mock)
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        plan: "premium",
        cycle: billingCycle,
        date: Date.now()
      });
    }, 2500);
  };

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "20px", color: "white" }}>
      
      {/* Encabezado Premium */}
      <div style={{ textAlign: "center", marginBottom: "35px" }}>
        <div style={{ fontSize: "55px", marginBottom: "10px", filter: "drop-shadow(0 0 10px #f1c40f)" }}>👑</div>
        <h1 style={{ margin: "0 0 10px 0", color: "#f1c40f", letterSpacing: "1px" }}>TCG Claim Pro para Locales</h1>
        <p style={{ color: "gray", fontSize: "15px", margin: 0, maxWidth: "550px", margin: "0 auto" }}>
          Lleva tu tienda física al siguiente nivel con herramientas avanzadas de gestión, automatización y máxima exposición.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "25px", alignItems: "stretch" }}>
        
        {/* COLUMNA 1: BENEFICIOS */}
        <div style={{ flex: "1 1 350px", background: "#111", padding: "30px", borderRadius: "12px", border: "1px solid #333", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#fff", borderBottom: "1px solid #222", paddingBottom: "10px" }}>Beneficios Exclusivos</h3>
          
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "20px" }}>📸</span>
            <div>
              <strong style={{ color: "#f1c40f", display: "block", fontSize: "14px" }}>Escáner de Cartas OCR (Cámara)</strong>
              <span style={{ color: "gray", fontSize: "12px" }}>Escanea álbumes enteros con la cámara de tu celular. El sistema detectará el nombre automáticamente.</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "20px" }}>🗄️</span>
            <div>
              <strong style={{ color: "#f1c40f", display: "block", fontSize: "14px" }}>Inventario Persistente en la Nube</strong>
              <span style={{ color: "gray", fontSize: "12px" }}>Tu vitrina digital nunca se borra. Mantén tu stock sincronizado 24/7 en la base de datos de la plataforma.</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "20px" }}>🛡️</span>
            <div>
              <strong style={{ color: "#f1c40f", display: "block", fontSize: "14px" }}>Insignia de Tienda Oficial Verified</strong>
              <span style={{ color: "gray", fontSize: "12px" }}>Badge dorado exclusivo en el marketplace que garantiza a los compradores que eres un negocio establecido.</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "20px" }}>📈</span>
            <div>
              <strong style={{ color: "#f1c40f", display: "block", fontSize: "14px" }}>Estadísticas Avanzadas de Negocio</strong>
              <span style={{ color: "gray", fontSize: "12px" }}>Gráficas detalladas de tus cartas más buscadas, ingresos mensuales y reportes logísticos de entrega.</span>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: SELECCIÓN DE PLAN Y PASARELA DE PAGO */}
        <div style={{ flex: "1 1 400px", background: "#111", padding: "30px", borderRadius: "12px", border: "1px solid #f1c40f", boxShadow: "0 0 20px rgba(241, 196, 15, 0.05)", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Selector de Ciclo de Facturación */}
          <div style={{ display: "flex", background: "#000", padding: "4px", borderRadius: "8px", border: "1px solid #222" }}>
            <button 
              onClick={() => setBillingCycle("monthly")}
              style={{ flex: 1, padding: "10px", border: "none", borderRadius: "6px", background: billingCycle === "monthly" ? "#f1c40f" : "transparent", color: billingCycle === "monthly" ? "black" : "gray", fontWeight: "bold", cursor: "pointer", fontSize: "13px", transition: "all 0.2s" }}
            >
              Mensual
            </button>
            <button 
              onClick={() => setBillingCycle("yearly")}
              style={{ flex: 1, padding: "10px", border: "none", borderRadius: "6px", background: billingCycle === "yearly" ? "#f1c40f" : "transparent", color: billingCycle === "yearly" ? "black" : "gray", fontWeight: "bold", cursor: "pointer", fontSize: "13px", transition: "all 0.2s" }}
            >
              Anual 🏷️
            </button>
          </div>

          {/* Precio Desplegado */}
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: "bold", color: "#2ecc71" }}>
              ${price} <span style={{ fontSize: "16px", color: "gray" }}>MXN / {billingCycle === "monthly" ? "mes" : "año"}</span>
            </div>
            {savings && <span style={{ color: "#2ecc71", fontSize: "12px", fontWeight: "bold", display: "block", marginTop: "5px" }}>{savings}</span>}
          </div>

          {/* Formulario de Pago Encriptado Simulado */}
          <form onSubmit={handlePaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <h4 style={{ margin: "5px 0", color: "#aaa", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>💳 Detalles de Tarjeta</h4>
            
            <input 
              type="text" 
              placeholder="Nombre del Titular"
              required
              value={cardData.name}
              onChange={e => setCardData({ ...cardData, name: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #333", background: "#1a1a1a", color: "white", outline: "none" }}
            />
            
            <input 
              type="text" 
              maxLength="16"
              placeholder="Número de Tarjeta (16 dígitos)"
              required
              value={cardData.number}
              onChange={e => setCardData({ ...cardData, number: e.target.value.replace(/\D/g, '') })}
              style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #333", background: "#1a1a1a", color: "white", outline: "none" }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <input 
                type="text" 
                maxLength="5"
                placeholder="MM/AA"
                required
                value={cardData.expiry}
                onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #333", background: "#1a1a1a", color: "white", outline: "none", textAlign: "center" }}
              />
              <input 
                type="password" 
                maxLength="3"
                placeholder="CVC"
                required
                value={cardData.cvc}
                onChange={e => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, '') })}
                style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #333", background: "#1a1a1a", color: "white", outline: "none", textAlign: "center" }}
              />
            </div>

            {/* Botones de acción con Estado de Carga */}
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button 
                type="button" 
                disabled={loading}
                onClick={onCancel} 
                style={{ flex: 1, padding: "14px", borderRadius: "8px", border: "1px solid #444", background: "transparent", color: "white", cursor: "pointer", fontWeight: "bold" }}
              >
                Cancelar
              </button>
              
              <button 
                type="submit" 
                disabled={loading}
                style={{ flex: 2, padding: "14px", borderRadius: "8px", border: "none", background: loading ? "#444" : "#2ecc71", color: "white", cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {loading ? (
                  <div style={{ width: "20px", height: "20px", border: "3px solid transparent", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
                ) : (
                  `Pagar $${price} MXN`
                )}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Animación CSS para el Spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}