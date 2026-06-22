export default function SellerProfileView({ seller, onBack }) {
  return (
    <div style={{ color: "white", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#3498db", cursor: "pointer", marginBottom: "20px", fontSize: "16px" }}>← Volver al inicio</button>
      <div style={{ background: "#111", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", borderBottom: "1px solid #333", paddingBottom: "20px", marginBottom: "20px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#3498db", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", fontWeight: "bold" }}>
            {seller.nombre.charAt(0)}
          </div>
          <div>
            <h2 style={{ margin: "0 0 5px 0", display: "flex", alignItems: "center", gap: "10px" }}>
              {seller.nombre} {seller.verificado && <span style={{ color: "#2ecc71", fontSize: "18px" }}>✔</span>}
            </h2>
            <div style={{ color: "#f1c40f", fontSize: "18px" }}>{"⭐".repeat(Math.floor(seller.rep))} {seller.rep}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          <div style={{ flex: 1, background: "#1a1a1a", padding: "15px", borderRadius: "8px", textAlign: "center" }}><div style={{ color: "gray", fontSize: "12px" }}>Ventas</div><div style={{ fontSize: "24px", fontWeight: "bold" }}>{seller.ventas}</div></div>
          <div style={{ flex: 1, background: "#1a1a1a", padding: "15px", borderRadius: "8px", textAlign: "center" }}><div style={{ color: "gray", fontSize: "12px" }}>Cancelaciones</div><div style={{ fontSize: "24px", fontWeight: "bold", color: seller.cancelaciones === "0%" ? "#2ecc71" : "white" }}>{seller.cancelaciones}</div></div>
          <div style={{ flex: 1, background: "#1a1a1a", padding: "15px", borderRadius: "8px", textAlign: "center" }}><div style={{ color: "gray", fontSize: "12px" }}>Tiempo</div><div style={{ fontSize: "24px", fontWeight: "bold" }}>{seller.tiempo}</div></div>
        </div>
        <div>
          <h3 style={{ color: "#3498db", marginBottom: "10px" }}>Sobre mí</h3>
          <p style={{ color: "#ccc", lineHeight: "1.6" }}>{seller.descripcion}</p>
        </div>
      </div>
    </div>
  );
}