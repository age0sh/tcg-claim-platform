import { useState, useEffect } from "react";

// 🔥 1. Agregamos 'pedidos = []' a los props recibidos
export default function SellerMarketView({ socket, userId, userName, mercado = {}, pedidos = [] }) {
  // Navegación
  const [activeTab, setActiveTab] = useState("subir");
  const [isCreating, setIsCreating] = useState(false);
  const [timer, setTimer] = useState("10");
  const [drafts, setDrafts] = useState([]);
  
  // 🔥 2. BORRAMOS EL const [pedidos, setPedidos] = useState([]); que estaba aquí

  // Estados del Formulario
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formLang, setFormLang] = useState("ES");
  const [formCondition, setFormCondition] = useState("Excelente (NM)");
  const [formStock, setFormStock] = useState(1);
  const [formRarity, setFormRarity] = useState("Common");
  const [formCategory, setFormCategory] = useState("Pokemon");
  const [formSet, setFormSet] = useState("Ascended Heroes (ASC)");
  const [formImage, setFormImage] = useState(""); 

  const [deliveryModal, setDeliveryModal] = useState({ show: false, pedidoId: null, code: "" });

  useEffect(() => {
    // 🔥 3. BORRAMOS el socket.on("pedidos-actualizados") de aquí, porque page.js ya se encarga de eso.
    // Solo dejamos el escuchador de errores de logística.
    socket.on("error-logistica", (msg) => {
      alert(msg);
    });

    return () => {
      socket.off("error-logistica");
    };
  }, [socket]);

  const misCartasPublicadas = Object.values(mercado).filter(c => c.sellerId === userId);
  
  // 🔥 4. NUEVO: Filtramos los pedidos globales para mostrar solo los de este vendedor
  const misPedidosDeVendedor = pedidos.filter(p => p.sellerId === userId);

  // 🔥 GUARDADO OPTIMISTA Y BASE DE DATOS
  const handleSaveDraft = async () => {
    if (!formName || !formPrice) return alert("Llena el nombre y el precio obligatoriamente.");
    
    // 1. Creamos el objeto con los datos exactamente como los pide la BD
    const draftData = {
      id: Date.now(), // ID temporal para que React pueda listarlo inmediatamente
      name: formName,
      price: Number(formPrice),
      language: formLang,
      condition: formCondition,
      rarity: formRarity,
      category: formCategory,
      collection: formSet, 
      stock: Number(formStock),
      sellerId: userId,
      sellerName: userName,
      status: "inventario",
      imageUrl: formImage,
      selected: false
    };

    // 2. ACTUALIZACIÓN OPTIMISTA (La UI avanza de inmediato)
    setDrafts([...drafts, draftData]);
    setIsCreating(false); // Cierra el formulario
    
    // 3. Limpiamos los campos para la siguiente carta
    setFormName(""); setFormPrice(""); setFormStock(1); setFormCondition("Excelente (NM)");

    // 4. GUARDAMOS EN BASE DE DATOS EN SEGUNDO PLANO
    try {
      const token = localStorage.getItem("tcg_token");
      if (!token) throw new Error("No estás autenticado. Falta el token.");

      const res = await fetch("http://localhost:4000/api/seller/publish-draft", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(draftData)
      });

      if (res.ok) {
        // 🔥 LA MAGIA: Obtenemos la carta real que Mongo acaba de crear
        const savedCard = await res.json();
        
        // Buscamos la carta con el ID temporal en pantalla y le inyectamos el ID real de Mongo
        setDrafts(draftsActuales => draftsActuales.map(draft => 
          draft.id === draftData.id ? { ...draft, _id: savedCard._id, id: savedCard._id } : draft
        ));
      } else {
        console.warn("Nota: La carta se guardó visualmente, pero el backend devolvió un error.");
      }
    } catch (err) {
      console.error("Modo desarrollo: La carta se añadió localmente, pero el backend no está conectado.", err.message);
    }
  };

  // 🔥 ACTUALIZADO: Compara tanto _id (Mongo) como id (Temporal)
  const toggleSelect = (selectedId) => {
    setDrafts(drafts.map(d => (d._id || d.id) === selectedId ? { ...d, selected: !d.selected } : d));
  };

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
    if(window.confirm("¿Terminar subasta actual?")){
      socket.emit("terminar-claim", { sellerId: userId });
      setActiveTab("pedidos");
    }
  };

  const handleChangeStatus = (pedidoId, nuevoEstado) => {
    if (nuevoEstado === "Entregado ✅") {
      setDeliveryModal({ show: true, pedidoId: pedidoId, code: "" });
      return;
    }
    socket.emit("actualizar-estado-pedido", { pedidoId, nuevoEstado, codigoVerificacion: null });
  };

  const handleConfirmDelivery = (e) => {
    e.preventDefault();
    if (!deliveryModal.code) return;
    socket.emit("actualizar-estado-pedido", { pedidoId: deliveryModal.pedidoId, nuevoEstado: "Entregado ✅", codigoVerificacion: deliveryModal.code });
    setDeliveryModal({ show: false, pedidoId: null, code: "" });
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
      
      {/* NAVEGACIÓN PRINCIPAL */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "30px", borderBottom: "1px solid #333", paddingBottom: "10px" }}>
        <button onClick={() => setActiveTab("subir")} style={{ background: activeTab === "subir" ? "#3498db" : "#222", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", flex: "1 1 auto" }}>📥 Subir Cartas ({drafts.length})</button>
        <button onClick={() => setActiveTab("envivo")} style={{ background: activeTab === "envivo" ? "#e74c3c" : "#222", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", flex: "1 1 auto" }}>🔴 Resumen en Vivo ({misCartasPublicadas.length})</button>
        <button onClick={() => setActiveTab("pedidos")} style={{ background: activeTab === "pedidos" ? "#2ecc71" : "#222", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", flex: "1 1 auto" }}>📦 Mis Pedidos ({pedidos.length})</button>
      </div>

      {/* ==================================================================================== */}
      {/* 1. PESTAÑA: SUBIR CARTAS E INVENTARIO */}
      {/* ==================================================================================== */}
      {activeTab === "subir" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {!isCreating ? (
            <button onClick={() => setIsCreating(true)} style={{ background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)", color: "white", border: "none", padding: "14px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", width: "fit-content", boxShadow: "0 4px 15px rgba(46, 204, 113, 0.3)" }}>
              + Registrar Nueva Carta al Inventario
            </button>
          ) : (
            <div style={{ background: "#151515", padding: "25px", borderRadius: "12px", border: "1px solid #333", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "25px" }}>
                
                {/* Lado Izquierdo: IMAGEN */}
                <div style={{ flex: "0 0 150px", display: "flex", flexDirection: "column" }}>
                  <label style={{ color: "#aaa", fontSize: "12px", marginBottom: "8px", fontWeight: "bold" }}>FOTO DE LA CARTA</label>
                  <div style={{ height: "200px", width: "100%", background: "#0a0a0a", border: "2px dashed #444", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "gray", cursor: "pointer", transition: "border 0.2s ease" }}>
                    <span style={{ fontSize: "30px", marginBottom: "10px" }}>📸</span>
                    <span style={{ fontSize: "11px", textAlign: "center", padding: "0 10px" }}>Clic para subir a la Nube</span>
                  </div>
                </div>

                {/* Lado Derecho: DATOS ESTRUCTURADOS (Grid) */}
                <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "15px" }}>
                  <h3 style={{ color: "#3498db", margin: "0 0 5px 0", fontSize: "18px" }}>Detalles del Artículo</h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", gridColumn: "1 / -1" }}>
                      <label style={{ color: "#aaa", fontSize: "11px", fontWeight: "bold" }}>NOMBRE DE LA CARTA</label>
                      <input type="text" placeholder="Ej. Charizard VMAX" value={formName} onChange={e=>setFormName(e.target.value)} style={{ padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "#222", color: "white", outline: "none" }} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ color: "#aaa", fontSize: "11px", fontWeight: "bold" }}>PRECIO (MXN)</label>
                      <input type="number" placeholder="Ej. 500" value={formPrice} onChange={e=>setFormPrice(e.target.value)} style={{ padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "#222", color: "white", outline: "none" }} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ color: "#aaa", fontSize: "11px", fontWeight: "bold" }}>ESTADO / CONDICIÓN</label>
                      <select value={formCondition} onChange={e=>setFormCondition(e.target.value)} style={{ padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "#222", color: "white", outline: "none" }}>
                        <optgroup label="Sin Graduar">
                          <option value="NM">Excelente estado (NM)</option>
                          <option value="LP">Buen estado (LP)</option>
                          <option value="HP">Mal estado (HP/Damaged)</option>
                        </optgroup>
                        <optgroup label="Graduadas (PSA/BGS)">
                          <option value="PSA 10">PSA 10 / BGS 10</option>
                          <option value="PSA 9.5">PSA 9.5 / BGS 9.5</option>
                          <option value="PSA 9">PSA 9 / BGS 9</option>
                          <option value="PSA 8.5">PSA 8.5 / BGS 8.5</option>
                          <option value="PSA 8">PSA 8 / BGS 8</option>
                        </optgroup>
                      </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ color: "#aaa", fontSize: "11px", fontWeight: "bold" }}>CATEGORÍA</label>
                      <select value={formCategory} onChange={e=>setFormCategory(e.target.value)} style={{ padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "#222", color: "white", outline: "none" }}>
                        <option value="Pokemon">Pokemon</option>
                        <option value="Trainer">Trainer</option>
                        <option value="Item">Item</option>
                        <option value="Stadium">Stadium</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ color: "#aaa", fontSize: "11px", fontWeight: "bold" }}>COLECCIÓN / SET</label>
                      <select value={formSet} onChange={e=>setFormSet(e.target.value)} style={{ padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "#222", color: "white", outline: "none" }}>
                        <option value="Ascended Heroes (ASC)">Ascended Heroes (ASC)</option>
                        <option value="Perfect Order (POR)">Perfect Order (POR)</option>
                        <option value="Base Set">Base Set</option>
                        <option value="151 (MEW)">151 (MEW)</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ color: "#aaa", fontSize: "11px", fontWeight: "bold" }}>RAREZA</label>
                      <select value={formRarity} onChange={e=>setFormRarity(e.target.value)} style={{ padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "#222", color: "white", outline: "none" }}>
                        <option value="Common">Common</option>
                        <option value="Uncommon">Uncommon</option>
                        <option value="Holo Rare">Holo Rare</option>
                        <option value="Ultra Rare">Ultra Rare</option>
                        <option value="Secret Rare">Secret Rare</option>
                      </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label style={{ color: "#aaa", fontSize: "11px", fontWeight: "bold" }}>IDIOMA</label>
                        <select value={formLang} onChange={e=>setFormLang(e.target.value)} style={{ padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "#222", color: "white", outline: "none" }}>
                          <option value="ES">ES 🇪🇸</option><option value="EN">EN 🇺🇸</option><option value="JP">JP 🇯🇵</option>
                        </select>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label style={{ color: "#aaa", fontSize: "11px", fontWeight: "bold" }}>STOCK</label>
                        <input type="number" min="1" value={formStock} onChange={e=>setFormStock(e.target.value)} style={{ padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "#222", color: "white", outline: "none" }} />
                      </div>
                    </div>

                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px", borderTop: "1px solid #333", paddingTop: "15px" }}>
                    <button onClick={() => setIsCreating(false)} style={{ padding: "10px 20px", borderRadius: "6px", border: "1px solid #555", background: "transparent", color: "white", cursor: "pointer" }}>Cancelar</button>
                    <button onClick={handleSaveDraft} style={{ padding: "10px 24px", borderRadius: "6px", border: "none", background: "#3498db", color: "white", cursor: "pointer", fontWeight: "bold" }}>💾 Guardar en Inventario</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {drafts.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ color: "white", marginBottom: "15px" }}>Cartas Listas para Subastar</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {drafts.map((draft, index) => (
                  <div key={draft._id || draft.id || index} onClick={() => toggleSelect(draft._id || draft.id)} style={{ display: "flex", alignItems: "center", background: draft.selected ? "#1a252f" : "#111", border: draft.selected ? "1px solid #3498db" : "1px solid #333", padding: "15px", borderRadius: "8px", cursor: "pointer", gap: "15px", transition: "all 0.2s" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "4px", border: "2px solid #3498db", background: draft.selected ? "#3498db" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {draft.selected && <span style={{ color: "white", fontSize: "14px" }}>✔</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>{draft.name}</div>
                      <div style={{ color: "gray", fontSize: "12px", marginTop: "4px" }}>
                        {draft.collection} | Condición: <strong style={{color:"#aaa"}}>{draft.condition}</strong> | Stock: {draft.stock}
                      </div>
                    </div>
                    <div style={{ color: "#2ecc71", fontWeight: "bold", fontSize: "18px" }}>${draft.price}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "linear-gradient(90deg, #111 0%, #1a1a1a 100%)", border: "1px solid #444", padding: "20px", borderRadius: "12px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <span style={{ color: "white" }}>Tiempo de subasta:</span>
                  <select value={timer} onChange={(e) => setTimer(e.target.value)} style={{ padding: "10px", borderRadius: "6px", background: "#222", color: "white", border: "1px solid #555", outline: "none" }}>
                    <option value="0">Sin tiempo (Inmediata)</option>
                    <option value="10">10 Segundos</option>
                    <option value="30">30 Segundos</option>
                  </select>
                </div>
                <button onClick={handlePublish} style={{ background: "#e74c3c", color: "white", border: "none", padding: "12px 30px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)" }}>
                  🚀 Iniciar Subasta de Lote Seleccionado
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================================== */}
      {/* 2. PESTAÑA: RESUMEN EN VIVO */}
      {/* ==================================================================================== */}
      {activeTab === "envivo" && (
        <div>
          {misCartasPublicadas.length === 0 ? (
            <p style={{ color: "gray", textAlign: "center", padding: "40px", background: "#111", borderRadius: "12px", border: "1px dashed #333" }}>No tienes cartas publicadas activas en este momento.</p>
          ) : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", background: "linear-gradient(90deg, #1a1a1a 0%, #2a0808 100%)", padding: "20px 25px", borderRadius: "12px", border: "1px solid #e74c3c", gap: "15px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                    <span style={{ width: "12px", height: "12px", background: "#e74c3c", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 10px #e74c3c" }}></span>
                    <h3 style={{ margin: 0, color: "white", fontSize: "20px", textTransform: "uppercase" }}>Mercado Activo</h3>
                  </div>
                  <p style={{ margin: 0, color: "#aaa", fontSize: "14px" }}>Gestionando claims para <strong style={{color:"white"}}>{misCartasPublicadas.length}</strong> artículos.</p>
                </div>
                <button onClick={handleTerminarClaim} style={{ background: "#e74c3c", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>🛑 Terminar Lote</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
                {misCartasPublicadas.map((carta, index) => (
                  <div key={carta._id || carta.id || index} style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #333", display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                      <div style={{ color: "white", fontSize: "18px", fontWeight: "800", marginBottom: "4px" }}>{carta.name}</div>
                      <div style={{ color: "#7f8c8d", fontSize: "12px", fontWeight: "bold" }}>Condición: {carta.condition || "N/A"}</div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      <span style={{ background: "#2c3e50", color: "#ecf0f1", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>{carta.collection || carta.set}</span>
                      <span style={{ background: "rgba(52, 152, 219, 0.15)", color: "#3498db", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", border: "1px solid rgba(52, 152, 219, 0.3)" }}>{carta.rarity}</span>
                      <span style={{ background: "rgba(46, 204, 113, 0.1)", color: "#2ecc71", padding: "4px 8px", borderRadius: "4px", fontSize: "11px" }}>Stock: {carta.stock}</span>
                    </div>
                    <div style={{ fontSize: "24px", color: "#2ecc71", fontWeight: "900" }}>${carta.price}</div>
                    
                    <div style={{ background: "#080808", border: "1px solid #222", padding: "12px", borderRadius: "8px", flexGrow: 1, minHeight: "100px", maxHeight: "150px", overflowY: "auto" }}>
                      <div style={{ color: "#555", fontSize: "10px", fontWeight: "bold", marginBottom: "8px" }}>🛒 HISTORIAL DE CLAIMS</div>
                      {carta.claims && carta.claims.length > 0 ? (
                        carta.claims.map((c, i) => (
                          <div key={c._id || c.id || i} style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: "6px", marginBottom: "6px" }}>
                            <span style={{ fontSize: "13px", color: "#fff" }}><span style={{ color: "#e74c3c", fontWeight: "bold" }}>{i+1}.</span> {c.user}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ color: "#444", fontSize: "12px", fontStyle: "italic" }}>Esperando peticiones...</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ==================================================================================== */}
      {/* 3. PESTAÑA: MIS PEDIDOS (RESUMEN DE VENTA) */}
      {/* ==================================================================================== */}
      {activeTab === "pedidos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {pedidos.map((pedido, index) => (
            <div key={pedido._id || pedido.id || index} style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
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
                <select value={pedido.status} onChange={(e) => handleChangeStatus(pedido.id || pedido._id, e.target.value)} style={{ padding: "8px", borderRadius: "6px", background: pedido.status === "Entregado ✅" ? "#27ae60" : "#f39c12", color: "white", border: "none", fontWeight: "bold", cursor: "pointer", width: "100%", maxWidth: "150px" }}>
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

      {/* ==================================================================================== */}
      {/* MODAL DE SEGURIDAD PARA ENTREGAS */}
      {/* ==================================================================================== */}
      {deliveryModal.show && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(5px)", padding: "20px" }}>
          <div style={{ background: "#111", padding: "40px 30px", borderRadius: "16px", border: "1px solid #3498db", width: "100%", maxWidth: "380px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>🛡️</div>
            <h3 style={{ color: "#fff", margin: "0 0 10px 0", fontSize: "22px" }}>Validación de Entrega</h3>
            <p style={{ color: "gray", fontSize: "14px", marginBottom: "30px" }}>Ingresa el código secreto de 4 dígitos que tiene el comprador para liberar este pedido.</p>

            <form onSubmit={handleConfirmDelivery} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <input type="text" maxLength="4" placeholder="Ej: 4952" value={deliveryModal.code} onChange={e => setDeliveryModal({ ...deliveryModal, code: e.target.value.replace(/\D/g, '') })} style={{ width: "100%", padding: "15px", borderRadius: "8px", border: "2px dashed #3498db", background: "#1a1a1a", color: "#3498db", outline: "none", fontSize: "32px", textAlign: "center", letterSpacing: "15px", fontWeight: "bold" }} autoFocus />
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