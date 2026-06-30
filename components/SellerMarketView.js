import { useState, useEffect } from "react";

export default function SellerMarketView({ socket, userId, userName, mercado = {} }) {
  const [activeTab, setActiveTab] = useState("borradores");
  const [isCreating, setIsCreating] = useState(false);
  const [timer, setTimer] = useState("10");
  const [drafts, setDrafts] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Estados del Formulario TCG
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formLang, setFormLang] = useState("ES 🇪🇸");
  const [formStock, setFormStock] = useState(1);
  const [formRarity, setFormRarity] = useState("C");
  const [formCategory, setFormCategory] = useState("Pokemon");
  const [formSet, setFormSet] = useState("SVI"); 

  // 🔥 NUEVO: Estado para nuestro Modal de Validación de Seguridad
  const [deliveryModal, setDeliveryModal] = useState({ show: false, pedidoId: null, code: "" });

  useEffect(() => {
      socket.on("pedidos-actualizados", (data) => {
        setPedidos(data.filter(p => p.sellerId === userId));
      });

      // Escuchar error si el PIN es incorrecto
      socket.on("error-logistica", (msg) => {
        alert(msg); 
        // 🔥 LA MAGIA: Clonamos el arreglo para forzar a React a redibujar la pantalla
        // Esto hace que el select regrese a su estado verdadero (ej. "Pendiente")
        setPedidos(pedidosActuales => [...pedidosActuales]);
      });

      return () => {
        socket.off("pedidos-actualizados");
        socket.off("error-logistica");
      };
    }, [socket, userId]);

  const misCartasPublicadas = Object.values(mercado).filter(c => c.sellerId === userId);

  const handleSaveDraft = () => {
    if (!formName || !formPrice) return alert("Llena el nombre y precio");
    
    const newDraft = {
      id: Date.now(),
      name: formName,
      price: "$" + formPrice + " MXN",
      lang: formLang,
      stock: formStock,
      rarity: formRarity,
      category: formCategory,
      set: formSet,
      selected: false
    };

    setDrafts([...drafts, newDraft]);
    setIsCreating(false);
    
    setFormName(""); setFormPrice(""); setFormStock(1);
    setFormRarity("C"); setFormCategory("Pokemon"); setFormSet("SVI");
  };

  const toggleSelect = (id) => setDrafts(drafts.map(d => d.id === id ? { ...d, selected: !d.selected } : d));

  const handlePublish = () => {
    const selectedDrafts = drafts.filter(d => d.selected);
    if (selectedDrafts.length === 0) return alert("Selecciona al menos un borrador.");
    
    socket.emit("publicar-lote", { 
      cartas: selectedDrafts, 
      temporizador: parseInt(timer), 
      sellerId: userId,
      sellerName: userName 
    });

    setDrafts(drafts.filter(d => !d.selected));
    setActiveTab("envivo");
  };

  const handleTerminarClaim = () => {
    if(window.confirm("¿Estás seguro de terminar el lote?")){
      socket.emit("terminar-claim", { sellerId: userId });
      setActiveTab("pedidos");
    }
  };

  // 🔥 ACTUALIZADA: En lugar del feo prompt(), abrimos nuestro Modal de React
  const handleChangeStatus = (pedidoId, nuevoEstado) => {
    if (nuevoEstado === "Entregado ✅") {
      setDeliveryModal({ show: true, pedidoId: pedidoId, code: "" });
      return; // Detenemos la ejecución aquí, el modal hará el envío
    }

    // Si es otro estado (En Local, Pendiente), se actualiza sin pedir código
    socket.emit("actualizar-estado-pedido", { 
      pedidoId, 
      nuevoEstado, 
      codigoVerificacion: null 
    });
  };

  // 🔥 NUEVA FUNCIÓN: Se ejecuta al presionar "Validar" en nuestro Modal
  const handleConfirmDelivery = (e) => {
    e.preventDefault();
    if (!deliveryModal.code) return;

    socket.emit("actualizar-estado-pedido", { 
      pedidoId: deliveryModal.pedidoId, 
      nuevoEstado: "Entregado ✅", 
      codigoVerificacion: deliveryModal.code 
    });
    
    // Cerramos el modal
    setDeliveryModal({ show: false, pedidoId: null, code: "" });
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "30px", borderBottom: "1px solid #333", paddingBottom: "10px" }}>
        <button onClick={() => setActiveTab("borradores")} style={{ background: activeTab === "borradores" ? "#3498db" : "#222", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", flex: "1 1 auto" }}>📝 Borradores ({drafts.length})</button>
        <button onClick={() => setActiveTab("envivo")} style={{ background: activeTab === "envivo" ? "#e74c3c" : "#222", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", flex: "1 1 auto" }}>🔴 En Vivo ({misCartasPublicadas.length})</button>
        <button onClick={() => setActiveTab("pedidos")} style={{ background: activeTab === "pedidos" ? "#2ecc71" : "#222", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", flex: "1 1 auto" }}>📦 Mis Pedidos ({pedidos.length})</button>
      </div>

      {/* TABS DE BORRADORES Y EN VIVO... */}
      {activeTab === "borradores" && (
        <>
          {isCreating ? (
            <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333", display: "flex", flexDirection: "column", gap: "25px" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <label style={{ color: "white", fontSize: "14px", marginBottom: "8px", fontWeight: "bold" }}>Imagen TCG</label>
                <div style={{ height: "220px", background: "#222", border: "2px dashed #444", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "gray", cursor: "pointer" }}>
                  <span style={{ fontSize: "28px" }}>📷</span>
                  <span style={{ fontSize: "12px", marginTop: "5px" }}>Cargar Carta</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <h3 style={{ color: "#3498db", margin: "0 0 10px 0" }}>Detalles del Anuncio</h3>
                <input type="text" placeholder="Nombre de la carta (Ej. Lugia V)" value={formName} onChange={e=>setFormName(e.target.value)} style={{ padding: "12px", borderRadius: "6px", border: "none", background: "#222", color: "white", outline: "none" }} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <input type="number" placeholder="Precio (MXN)" value={formPrice} onChange={e=>setFormPrice(e.target.value)} style={{ flex: "1 1 150px", padding: "12px", borderRadius: "6px", border: "none", background: "#222", color: "white", outline: "none" }} />
                  <select value={formLang} onChange={e=>setFormLang(e.target.value)} style={{ flex: "1 1 150px", padding: "12px", borderRadius: "6px", border: "none", background: "#222", color: "white", outline: "none" }}>
                    <option value="ES 🇪🇸">Español 🇪🇸</option>
                    <option value="EN 🇺🇸">Inglés 🇺🇸</option>
                    <option value="JP 🇯🇵">Japonés 🇯🇵</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ flex: "1 1 150px" }}>
                    <label style={{ color: "gray", fontSize: "11px", display: "block", marginBottom: "4px" }}>Rareza</label>
                    <select value={formRarity} onChange={e=>setFormRarity(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white", outline: "none", fontSize: "12px" }}>
                      <option value="C">C - Common</option>
                      <option value="U">U - Uncommon</option>
                      <option value="R">R - Rare</option>
                      <option value="H">H - Holo Rare</option>
                      <option value="SIR">SIR - Special Illustration Rare</option>
                      <option value="UR">UR - Ultra Rare / Gold Rare</option>
                    </select>
                  </div>
                  <div style={{ flex: "1 1 150px" }}>
                    <label style={{ color: "gray", fontSize: "11px", display: "block", marginBottom: "4px" }}>Categoría</label>
                    <select value={formCategory} onChange={e=>setFormCategory(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white", outline: "none", fontSize: "12px" }}>
                      <option value="Pokemon">Pokemon</option>
                      <option value="Trainer">Trainer</option>
                      <option value="Item">Item</option>
                    </select>
                  </div>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ color: "gray", fontSize: "11px", display: "block", marginBottom: "4px" }}>Colección</label>
                    <select value={formSet} onChange={e=>setFormSet(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white", outline: "none", fontSize: "12px" }}>
                      <optgroup label="Escarlata y Púrpura" style={{ color: "#e74c3c" }}>
                        <option value="SVI">SVI - Scarlet & Violet</option>
                        <option value="MEW">MEW - 151</option>
                        <option value="PAF">PAF - Paldean Fates</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ color: "white", fontSize: "13px" }}>Copias en Inventario (Stock)</label>
                  <input type="number" min="1" value={formStock} onChange={e=>setFormStock(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white", marginTop: "5px", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "15px" }}>
                  <button onClick={() => setIsCreating(false)} style={{ flex: "1 1 100px", padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "transparent", color: "white", cursor: "pointer" }}>Cancelar</button>
                  <button onClick={handleSaveDraft} style={{ flex: "2 1 200px", padding: "12px", borderRadius: "6px", border: "none", background: "#3498db", color: "white", cursor: "pointer", fontWeight: "bold" }}>Guardar Borrador</button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <button onClick={() => setIsCreating(true)} style={{ background: "#2ecc71", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginBottom: "20px" }}>+ Crear Anuncio</button>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
                {drafts.map(draft => (
                  <div key={draft.id} onClick={() => toggleSelect(draft.id)} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", background: draft.selected ? "#1a252f" : "#111", border: draft.selected ? "1px solid #3498db" : "1px solid #333", padding: "15px", borderRadius: "8px", cursor: "pointer", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "4px", border: "2px solid #3498db", background: draft.selected ? "#3498db" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{draft.selected && <span style={{ color: "white", fontSize: "14px" }}>✔</span>}</div>
                      <div>
                        <div style={{ color: "white", fontWeight: "bold" }}>{draft.name} <span style={{ color: "#3498db", fontSize: "12px" }}>[{draft.set}]</span></div>
                        <div style={{ color: "gray", fontSize: "12px" }}>{draft.category} | {draft.rarity} | Idioma: {draft.lang} | Stock: {draft.stock}</div>
                      </div>
                    </div>
                    <div style={{ color: "#2ecc71", fontWeight: "bold" }}>{draft.price}</div>
                  </div>
                ))}
              </div>
              {drafts.length > 0 && (
                <div style={{ background: "#111", border: "1px solid #333", padding: "20px", borderRadius: "12px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "15px" }}>
                  <select value={timer} onChange={(e) => setTimer(e.target.value)} style={{ flex: "1 1 auto", padding: "10px", borderRadius: "6px", background: "#222", color: "white", border: "1px solid #444", outline: "none" }}>
                    <option value="0">Publicación Inmediata</option>
                    <option value="10">Temporizador 10s</option>
                  </select>
                  <button onClick={handlePublish} style={{ flex: "1 1 auto", background: "#e74c3c", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>🚀 Publicar al Mercado</button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === "envivo" && (
        <div>
          {misCartasPublicadas.length === 0 ? (
            <p style={{ color: "gray", textAlign: "center" }}>No tienes cartas publicadas activas.</p>
          ) : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #e74c3c", gap: "15px" }}>
                <div>
                  <h3 style={{ margin: "0 0 5px 0", color: "white" }}>Subasta de Lote Activo</h3>
                  <p style={{ margin: 0, color: "gray", fontSize: "14px" }}>Recibiendo peticiones para {misCartasPublicadas.length} cartas.</p>
                </div>
                <button onClick={handleTerminarClaim} style={{ flex: "1 1 auto", maxWidth: "200px", background: "#e74c3c", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>🛑 Terminar Lote</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "15px" }}>
                {misCartasPublicadas.map(carta => (
                  <div key={carta.id} style={{ background: "#111", padding: "15px", borderRadius: "8px", border: "1px solid #333" }}>
                    <div style={{ color: "white", fontWeight: "bold" }}>{carta.name}</div>
                    <div style={{ fontSize: "12px", color: "#2ecc71", margin: "5px 0 10px 0" }}>{carta.price}</div>
                    <div style={{ background: "#000", padding: "8px", borderRadius: "4px", minHeight: "50px", fontSize: "12px" }}>
                      {carta.claims.map((c, i) => (<div key={i} style={{ color: "#2ecc71" }}>{i+1}. {c.user}</div>))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "pedidos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {pedidos.map(pedido => (
            <div key={pedido.id} style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "15px", marginBottom: "15px", gap: "10px" }}>
                <div>
                  <h3 style={{ color: "#3498db", margin: "0 0 4px 0" }}>Ganador: {pedido.buyerName}</h3>
                  <span style={{ color: "gray", fontSize: "11px" }}>Recibo: {pedido.id}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "22px", color: "#2ecc71", fontWeight: "bold" }}>${pedido.total} MXN</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "15px" }}>
                <div style={{ color: "#ccc", fontSize: "13px", flex: "1 1 100%" }}><strong>Cartas ganadas:</strong> {pedido.items.join(", ")}</div>
                <select value={pedido.status} onChange={(e) => handleChangeStatus(pedido.id, e.target.value)} style={{ padding: "8px", borderRadius: "6px", background: pedido.status === "Entregado ✅" ? "#27ae60" : "#f39c12", color: "white", border: "none", fontWeight: "bold", cursor: "pointer", width: "100%", maxWidth: "150px" }}>
                  <option value="Pendiente 📦">Pendiente 📦</option>
                  <option value="En Local 🏪">En Local 🏪</option>
                  <option value="Enviado 🚚">Enviado 🚚</option>
                  <option value="Entregado ✅">Entregado ✅</option>
                </select>
              </div>
            </div>
          ))}
          {pedidos.length === 0 && <p style={{ color: "gray", textAlign: "center" }}>No has procesado ventas definitivas aún.</p>}
        </div>
      )}

      {/* 🔥 MODAL ELEGANTE DE SEGURIDAD (Reemplaza a prompt) */}
      {deliveryModal.show && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(5px)", padding: "20px" }}>
          <div style={{ background: "#111", padding: "40px 30px", borderRadius: "16px", border: "1px solid #3498db", width: "100%", maxWidth: "380px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>🛡️</div>
            <h3 style={{ color: "#fff", margin: "0 0 10px 0", fontSize: "22px" }}>Validación de Entrega</h3>
            <p style={{ color: "gray", fontSize: "14px", marginBottom: "30px" }}>Ingresa el código secreto de 4 dígitos que tiene el comprador para liberar este pedido.</p>

            <form onSubmit={handleConfirmDelivery} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <input 
                type="text" 
                maxLength="4" 
                placeholder="Ej: 4952" 
                value={deliveryModal.code} 
                onChange={e => setDeliveryModal({ ...deliveryModal, code: e.target.value.replace(/\D/g, '') })} 
                style={{ width: "100%", padding: "15px", borderRadius: "8px", border: "2px dashed #3498db", background: "#1a1a1a", color: "#3498db", outline: "none", fontSize: "32px", textAlign: "center", letterSpacing: "15px", fontWeight: "bold" }} 
                autoFocus
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setDeliveryModal({ show: false, pedidoId: null, code: "" })} style={{ flex: 1, padding: "14px", borderRadius: "8px", border: "1px solid #444", background: "transparent", color: "white", cursor: "pointer", fontWeight: "bold" }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: "14px", borderRadius: "8px", border: "none", background: "#2ecc71", color: "white", cursor: "pointer", fontWeight: "bold" }}>Validar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}