import { useState, useEffect } from "react";

export default function SellerMarketView({ socket, userId, mercado = {} }) {
  const [activeTab, setActiveTab] = useState("borradores"); // "borradores" | "envivo" | "pedidos"
  const [isCreating, setIsCreating] = useState(false);
  const [timer, setTimer] = useState("10");
  const [drafts, setDrafts] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Estados del formulario
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formLang, setFormLang] = useState("ES 🇪🇸");
  const [formStock, setFormStock] = useState(1);

  // Escuchar actualizaciones de pedidos desde el servidor
  useEffect(() => {
    socket.on("pedidos-actualizados", (data) => {
      // Filtramos para ver solo los pedidos donde yo soy el vendedor
      setPedidos(data.filter(p => p.sellerId === userId));
    });
    return () => socket.off("pedidos-actualizados");
  }, [socket, userId]);

  // Filtrar mis cartas actualmente publicadas en el mercado
  const misCartasPublicadas = Object.values(mercado).filter(c => c.sellerId === userId);

  const handleSaveDraft = () => {
    if (!formName || !formPrice) return alert("Llena el nombre y precio");
    setDrafts([...drafts, { id: Date.now(), name: formName, price: "$" + formPrice, lang: formLang, stock: formStock, selected: false }]);
    setIsCreating(false);
    setFormName(""); setFormPrice(""); setFormStock(1);
  };

  const toggleSelect = (id) => setDrafts(drafts.map(d => d.id === id ? { ...d, selected: !d.selected } : d));

  const handlePublish = () => {
    const selectedDrafts = drafts.filter(d => d.selected);
    if (selectedDrafts.length === 0) return alert("Selecciona al menos un borrador.");
    
    socket.emit("publicar-lote", { cartas: selectedDrafts, temporizador: parseInt(timer), sellerId: userId, sellerName: "Mi Tienda TCG" });
    setDrafts(drafts.filter(d => !d.selected));
    setActiveTab("envivo"); // Saltamos a la vista en vivo para ver el Hype
  };

  const handleTerminarClaim = () => {
    if(window.confirm("¿Estás seguro de terminar el evento? Esto cerrará las cartas activas y generará los pedidos de compra.")){
      socket.emit("terminar-claim", { sellerId: userId });
      setActiveTab("pedidos"); // Saltamos a la vista de pedidos para gestionar
    }
  };

  const handleChangeStatus = (pedidoId, nuevoEstado) => {
    socket.emit("actualizar-estado-pedido", { pedidoId, nuevoEstado });
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      
      {/* 🧭 Sub-Menú del Vendedor */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "1px solid #333", paddingBottom: "10px" }}>
        <button onClick={() => setActiveTab("borradores")} style={{ background: activeTab === "borradores" ? "#3498db" : "#222", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>📝 Borradores ({drafts.length})</button>
        <button onClick={() => setActiveTab("envivo")} style={{ background: activeTab === "envivo" ? "#e74c3c" : "#222", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>🔴 Mercado en Vivo ({misCartasPublicadas.length})</button>
        <button onClick={() => setActiveTab("pedidos")} style={{ background: activeTab === "pedidos" ? "#2ecc71" : "#222", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>📦 Mis Pedidos ({pedidos.length})</button>
      </div>

      {/* ==========================================
          VISTA: BORRADORES 
          ========================================== */}
      {activeTab === "borradores" && (
        <>
          {isCreating ? (
            <div style={{ background: "#111", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
              <h2 style={{ color: "#3498db", marginTop: 0 }}>Crear Borrador</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input type="text" placeholder="Nombre de la carta" value={formName} onChange={e=>setFormName(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white" }} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <input type="number" placeholder="Precio (MXN)" value={formPrice} onChange={e=>setFormPrice(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white" }} />
                  <select value={formLang} onChange={e=>setFormLang(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white" }}>
                    <option value="ES 🇪🇸">Español 🇪🇸</option>
                    <option value="EN 🇺🇸">Inglés 🇺🇸</option>
                    <option value="JP 🇯🇵">Japonés 🇯🇵</option>
                  </select>
                </div>
                <input type="number" min="1" value={formStock} onChange={e=>setFormStock(e.target.value)} placeholder="Stock disponible" style={{ padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white" }} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setIsCreating(false)} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #444", background: "transparent", color: "white", cursor: "pointer" }}>Cancelar</button>
                  <button onClick={handleSaveDraft} style={{ flex: 2, padding: "10px", borderRadius: "6px", border: "none", background: "#3498db", color: "white", cursor: "pointer" }}>Guardar Borrador</button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <button onClick={() => setIsCreating(true)} style={{ background: "#2ecc71", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginBottom: "20px" }}>+ Crear Carta</button>
              <div style={{ display: "grid", gap: "15px", marginBottom: "30px" }}>
                {drafts.map(draft => (
                  <div key={draft.id} onClick={() => toggleSelect(draft.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: draft.selected ? "#1a252f" : "#111", border: draft.selected ? "1px solid #3498db" : "1px solid #333", padding: "15px", borderRadius: "8px", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "4px", border: "2px solid #3498db", background: draft.selected ? "#3498db" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{draft.selected && <span style={{ color: "white", fontSize: "14px" }}>✔</span>}</div>
                      <div>
                        <div style={{ color: "white", fontWeight: "bold" }}>{draft.name}</div>
                        <div style={{ color: "gray", fontSize: "12px" }}>Idioma: {draft.lang} | Stock: {draft.stock}</div>
                      </div>
                    </div>
                    <div style={{ color: "#2ecc71", fontWeight: "bold" }}>{draft.price}</div>
                  </div>
                ))}
              </div>
              {drafts.length > 0 && (
                <div style={{ background: "#111", border: "1px solid #333", padding: "20px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <select value={timer} onChange={(e) => setTimer(e.target.value)} style={{ padding: "8px", borderRadius: "6px", background: "#222", color: "white", border: "1px solid #444" }}>
                    <option value="0">Publicación Inmediata</option>
                    <option value="10">Temporizador 10s</option>
                  </select>
                  <button onClick={handlePublish} style={{ background: "#e74c3c", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>🚀 Publicar al Mercado</button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ==========================================
          VISTA: EN VIVO (MERCADO) 
          ========================================== */}
      {activeTab === "envivo" && (
        <div>
          {misCartasPublicadas.length === 0 ? (
            <p style={{ color: "gray", textAlign: "center" }}>No tienes cartas publicadas en este momento.</p>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #e74c3c" }}>
                <div>
                  <h3 style={{ margin: "0 0 5px 0", color: "white" }}>Transmisión en Curso</h3>
                  <p style={{ margin: 0, color: "gray", fontSize: "14px" }}>Tienes {misCartasPublicadas.length} cartas activas recibiendo claims.</p>
                </div>
                <button onClick={handleTerminarClaim} style={{ background: "#e74c3c", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}>
                  🛑 Terminar Lote
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
                {misCartasPublicadas.map(carta => (
                  <div key={carta.id} style={{ background: "#111", padding: "15px", borderRadius: "8px", border: "1px solid #333" }}>
                    <div style={{ color: "white", fontWeight: "bold", marginBottom: "10px" }}>{carta.name}</div>
                    <div style={{ fontSize: "12px", color: "gray", marginBottom: "10px" }}>Claims: {carta.claims.length}/{carta.stock}</div>
                    <div style={{ background: "#000", padding: "5px", borderRadius: "4px", minHeight: "50px", fontSize: "12px" }}>
                      {carta.claims.map((c, i) => (
                        <div key={i} style={{ color: "#2ecc71" }}>{i+1}. {c.user}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ==========================================
          VISTA: MIS PEDIDOS (OMS) 
          ========================================== */}
      {activeTab === "pedidos" && (
        <div>
          <h2 style={{ color: "white", marginTop: 0 }}>Gestión de Pedidos</h2>
          <p style={{ color: "gray", marginBottom: "20px" }}>Recibos generados automáticamente al terminar claims.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {pedidos.map(pedido => (
              <div key={pedido.id} style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "15px", marginBottom: "15px" }}>
                  <div>
                    <h3 style={{ color: "#3498db", margin: "0 0 5px 0" }}>Comprador: {pedido.buyerName}</h3>
                    <span style={{ color: "gray", fontSize: "12px" }}>ID Pedido: {pedido.id}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "24px", color: "#2ecc71", fontWeight: "bold" }}>${pedido.total} MXN</div>
                    <div style={{ color: "gray", fontSize: "12px" }}>{pedido.items.length} artículos</div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ color: "#ccc", fontSize: "14px" }}>
                    <strong>Artículos ganados: </strong>
                    {pedido.items.join(", ")}
                  </div>

                  <select 
                    value={pedido.status} 
                    onChange={(e) => handleChangeStatus(pedido.id, e.target.value)}
                    style={{ padding: "8px", borderRadius: "6px", background: pedido.status === "Entregado ✅" ? "#27ae60" : "#f39c12", color: "white", border: "none", fontWeight: "bold", cursor: "pointer", outline: "none" }}
                  >
                    <option value="Pendiente 📦">Pendiente 📦</option>
                    <option value="En Local 🏪">En Local 🏪</option>
                    <option value="Enviado 🚚">Enviado 🚚</option>
                    <option value="Entregado ✅">Entregado ✅</option>
                  </select>
                </div>
              </div>
            ))}
            
            {pedidos.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "gray", border: "1px dashed #333", borderRadius: "12px" }}>
                Aún no tienes pedidos generados. ¡Termina un lote de claims para ver las ventas aquí!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}