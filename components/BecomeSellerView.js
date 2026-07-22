import { useState } from "react";
// 🔥 Importamos la pasarela que acabamos de crear
import PremiumCheckoutView from "./PremiumCheckoutView";

export default function BecomeSellerView({ onCancel, onSubmit }) {
  const [step, setStep] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false); // 🔥 Nuevo estado
  const [formData, setFormData] = useState({
    tipo: "independiente", 
    ubicacion: "",
    redes: "",
    identificacion: null
  });

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleProcessSubmit = (e) => {
    e.preventDefault();
    if (!formData.ubicacion || !formData.redes) return alert("Por favor, llena los campos obligatorios.");
    
    // 🔥 Si es local, abrimos primero la pantalla de pago antes de procesar el registro
    if (formData.tipo === "local") {
      setShowCheckout(true);
    } else {
      // Si es independiente, se envía normal directo
      onSubmit({ ...formData, tier: "free" });
    }
  };

  // 🔥 Se dispara cuando el pago simulado es exitoso
  const handlePaymentSuccess = (paymentInfo) => {
    onSubmit({
      ...formData,
      tier: "premium",
      payment: paymentInfo
    });
  };

  // 🔥 Si el switch de checkout está activo, pintamos la pasarela de pago en su lugar
  if (showCheckout) {
    return (
      <PremiumCheckoutView 
        onCancel={() => setShowCheckout(false)} 
        onSuccess={handlePaymentSuccess} 
      />
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px", color: "white" }}>
      
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <div style={{ fontSize: "50px", marginBottom: "10px" }}>🚀</div>
        <h1 style={{ margin: "0 0 10px 0", color: "#f1c40f" }}>Conviértete en Vendedor</h1>
        <p style={{ color: "gray", fontSize: "15px", margin: 0 }}>
          Únete a la red de subastas y claims. Protegemos a nuestra comunidad verificando a cada vendedor.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: step >= 1 ? "#3498db" : "#333", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>1</div>
        <div style={{ width: "60px", height: "4px", background: step >= 2 ? "#3498db" : "#333", borderRadius: "2px" }}></div>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: step >= 2 ? "#3498db" : "#333", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>2</div>
      </div>

      <div style={{ background: "#111", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
        
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#fff", textAlign: "center" }}>¿Qué tipo de vendedor eres?</h3>
            
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <div 
                onClick={() => setFormData({ ...formData, tipo: "independiente" })}
                style={{ flex: "1 1 250px", padding: "20px", borderRadius: "12px", border: formData.tipo === "independiente" ? "2px solid #3498db" : "2px solid #222", background: formData.tipo === "independiente" ? "rgba(52, 152, 219, 0.1)" : "#1a1a1a", cursor: "pointer", transition: "all 0.2s" }}
              >
                <div style={{ fontSize: "30px", marginBottom: "10px" }}>👤</div>
                <h4 style={{ margin: "0 0 5px 0", color: formData.tipo === "independiente" ? "#3498db" : "white" }}>Independiente</h4>
                <p style={{ color: "gray", fontSize: "12px", margin: 0 }}>Coleccionista privado que vende cartas sueltas o hace aperturas casuales desde casa.</p>
              </div>

              <div 
                onClick={() => setFormData({ ...formData, tipo: "local" })}
                style={{ flex: "1 1 250px", padding: "20px", borderRadius: "12px", border: formData.tipo === "local" ? "2px solid #f1c40f" : "2px solid #222", background: formData.tipo === "local" ? "rgba(241, 196, 15, 0.1)" : "#1a1a1a", cursor: "pointer", transition: "all 0.2s" }}
              >
                <div style={{ fontSize: "30px", marginBottom: "10px" }}>🏪</div>
                <h4 style={{ margin: "0 0 5px 0", color: formData.tipo === "local" ? "#f1c40f" : "white" }}>Tienda Física (Local)</h4>
                <p style={{ color: "gray", fontSize: "12px", margin: 0 }}>Negocio establecido. Obtén herramientas avanzadas de inventario y un badge de tienda oficial.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={onCancel} style={{ flex: 1, padding: "14px", borderRadius: "8px", border: "1px solid #444", background: "transparent", color: "white", cursor: "pointer", fontWeight: "bold" }}>Cancelar</button>
              <button onClick={handleNext} style={{ flex: 1, padding: "14px", borderRadius: "8px", border: "none", background: "#3498db", color: "white", cursor: "pointer", fontWeight: "bold" }}>Continuar ➔</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleProcessSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#fff", textAlign: "center" }}>Información de Contacto y Seguridad</h3>
            
            <div>
              <label style={{ color: "gray", fontSize: "13px", display: "block", marginBottom: "6px" }}>Ciudad y Estado <span style={{ color: "#e74c3c" }}>*</span></label>
              <input 
                type="text" 
                placeholder="Ej. Zapopan, Jalisco" 
                value={formData.ubicacion} 
                onChange={e => setFormData({ ...formData, ubicacion: e.target.value })}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "white", outline: "none" }} 
              />
            </div>

            <div>
              <label style={{ color: "gray", fontSize: "13px", display: "block", marginBottom: "6px" }}>Red Social o Página de Referencias <span style={{ color: "#e74c3c" }}>*</span></label>
              <input 
                type="text" 
                placeholder="Enlace a Facebook, Instagram, o referencias" 
                value={formData.redes} 
                onChange={e => setFormData({ ...formData, redes: e.target.value })}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "white", outline: "none" }} 
              />
            </div>

            <div>
              <label style={{ color: "gray", fontSize: "13px", display: "block", marginBottom: "6px" }}>Comprobante de Identidad / Foto del Local (Opcional por ahora)</label>
              <div style={{ width: "100%", padding: "20px", border: "2px dashed #444", borderRadius: "8px", background: "#1a1a1a", textAlign: "center", color: "gray", cursor: "pointer" }}>
                <span style={{ fontSize: "24px", display: "block", marginBottom: "5px" }}>📷</span>
                Haz clic para subir imagen
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="button" onClick={handleBack} style={{ flex: 1, padding: "14px", borderRadius: "8px", border: "1px solid #444", background: "transparent", color: "white", cursor: "pointer", fontWeight: "bold" }}>🡠 Atrás</button>
              <button type="submit" style={{ flex: 1, padding: "14px", borderRadius: "8px", border: "none", background: "#2ecc71", color: "white", cursor: "pointer", fontWeight: "bold" }}>
                {formData.tipo === "local" ? "Ir a Pagar ➔" : "Enviar Solicitud ✔️"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}