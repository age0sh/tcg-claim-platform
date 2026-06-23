import { useState, useEffect } from "react";

export default function SellerMarketView({ socket, userId, mercado = {} }) {
  const [activeTab, setActiveTab] = useState("borradores");
  const [isCreating, setIsCreating] = useState(false);
  const [timer, setTimer] = useState("10");
  const [drafts, setDrafts] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Estados avanzados del Formulario TCG
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formLang, setFormLang] = useState("ES 🇪🇸");
  const [formStock, setFormStock] = useState(1);
  
  // 🔥 Valores iniciales actualizados
  const [formRarity, setFormRarity] = useState("C");
  const [formCategory, setFormCategory] = useState("Pokemon");
  const [formSet, setFormSet] = useState("SVI");

  useEffect(() => {
    socket.on("pedidos-actualizados", (data) => {
      setPedidos(data.filter(p => p.sellerId === userId));
    });
    return () => socket.off("pedidos-actualizados");
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
    
    // Resetear formulario
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
      sellerName: "Mi Tienda TCG" 
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

  const handleChangeStatus = (pedidoId, nuevoEstado) => {
    socket.emit("actualizar-estado-pedido", { pedidoId, nuevoEstado });
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      
      {/* Sub-Menú */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "1px solid #333", paddingBottom: "10px" }}>
        <button onClick={() => setActiveTab("borradores")} style={{ background: activeTab === "borradores" ? "#3498db" : "#222", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>📝 Borradores ({drafts.length})</button>
        <button onClick={() => setActiveTab("envivo")} style={{ background: activeTab === "envivo" ? "#e74c3c" : "#222", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>🔴 En Vivo ({misCartasPublicadas.length})</button>
        <button onClick={() => setActiveTab("pedidos")} style={{ background: activeTab === "pedidos" ? "#2ecc71" : "#222", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>📦 Mis Pedidos ({pedidos.length})</button>
      </div>

      {activeTab === "borradores" && (
        <>
          {isCreating ? (
            <div style={{ background: "#111", padding: "30px", borderRadius: "12px", border: "1px solid #333", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" }}>
              
              <div style={{ display: "flex", flexDirection: "column", justifyCenter: "center" }}>
                <label style={{ color: "white", fontSize: "14px", marginBottom: "8px", fontWeight: "bold" }}>Imagen TCG</label>
                <div style={{ height: "220px", background: "#222", border: "2px dashed #444", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "gray", cursor: "pointer" }}>
                  <span style={{ fontSize: "28px" }}>📷</span>
                  <span style={{ fontSize: "12px", marginTop: "5px" }}>Cargar Carta</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <h3 style={{ color: "#3498db", margin: "0 0 10px 0" }}>Detalles del Anuncio</h3>
                
                <input type="text" placeholder="Nombre de la carta (Ej. Lugia V)" value={formName} onChange={e=>setFormName(e.target.value)} style={{ padding: "12px", borderRadius: "6px", border: "none", background: "#222", color: "white", outline: "none" }} />
                
                <div style={{ display: "flex", gap: "10px" }}>
                  <input type="number" placeholder="Precio (MXN)" value={formPrice} onChange={e=>setFormPrice(e.target.value)} style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "none", background: "#222", color: "white", outline: "none" }} />
                  <select value={formLang} onChange={e=>setFormLang(e.target.value)} style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "none", background: "#222", color: "white", outline: "none" }}>
                    <option value="ES 🇪🇸">Español 🇪🇸</option>
                    <option value="EN 🇺🇸">Inglés 🇺🇸</option>
                    <option value="JP 🇯🇵">Japonés 🇯🇵</option>
                  </select>
                </div>

                {/* 🔥 LOS COMBOBOXES ACTUALIZADOS */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  
                  {/* Rareza */}
                  <div>
                    <label style={{ color: "gray", fontSize: "11px", display: "block", marginBottom: "4px" }}>Rareza</label>
                    <select value={formRarity} onChange={e=>setFormRarity(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white", outline: "none", fontSize: "12px" }}>
                      <option value="C">C - Common</option>
                      <option value="U">U - Uncommon</option>
                      <option value="R">R - Rare</option>
                      <option value="H">H - Holo Rare</option>
                      <option value="RH">RH - Reverse Holo</option>
                      <option value="RR">RR - Double Rare</option>
                      <option value="AR">AR - Art Rare (Japón)</option>
                      <option value="IR">IR - Illustration Rare</option>
                      <option value="SR">SR - Super Rare / Ultra Rare FA</option>
                      <option value="SAR">SAR - Special Art Rare (Japón)</option>
                      <option value="SIR">SIR - Special Illustration Rare</option>
                      <option value="UR">UR - Ultra Rare / Gold Rare</option>
                      <option value="HR">HR - Hyper Rare</option>
                      <option value="SSR">SSR - Shiny Super Rare</option>
                      <option value="ACE">ACE - ACE SPEC</option>
                      <option value="PROMO">PROMO - Promo</option>
                    </select>
                  </div>

                  {/* Categoría */}
                  <div>
                    <label style={{ color: "gray", fontSize: "11px", display: "block", marginBottom: "4px" }}>Categoría</label>
                    <select value={formCategory} onChange={e=>setFormCategory(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white", outline: "none", fontSize: "12px" }}>
                      <option value="Pokemon">Pokemon</option>
                      <option value="Trainer">Trainer</option>
                      <option value="Item">Item</option>
                      <option value="Stadium">Stadium</option>
                    </select>
                  </div>

{/* Colección */}
                  <div>
                    <label style={{ color: "gray", fontSize: "11px", display: "block", marginBottom: "4px" }}>Colección</label>
                    <select value={formSet} onChange={e=>setFormSet(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white", outline: "none", fontSize: "12px" }}>
                      
                      {/* Grupo Escarlata y Púrpura */}
                      <optgroup label="Escarlata y Púrpura" style={{ color: "#e74c3c" }}>
                        <option value="SVI">SVI - Scarlet & Violet</option>
                        <option value="PAL">PAL - Paldea Evolved</option>
                        <option value="OBF">OBF - Obsidian Flames</option>
                        <option value="MEW">MEW - 151</option>
                        <option value="PAR">PAR - Paradox Rift</option>
                        <option value="PAF">PAF - Paldean Fates</option>
                        <option value="TEF">TEF - Temporal Forces</option>
                        <option value="TWM">TWM - Twilight Masquerade</option>
                        <option value="SFA">SFA - Shrouded Fable</option>
                        <option value="SCR">SCR - Stellar Crown</option>
                        <option value="SSP">SSP - Surging Sparks</option>
                        <option value="PRE">PRE - Prismatic Evolutions</option>
                        <option value="JTG">JTG - Journey Together</option>
                        <option value="DRI">DRI - Destined Rivals</option>
                        <option value="BLK">BLK - Black Bolt</option>
                        <option value="WHT">WHT - White Flare</option>
                        <option value="SVP">SVP - Scarlet & Violet Promos</option>
                      </optgroup>

                      {/* Grupo Mega Evolution */}
                      <optgroup label="Mega Evolution" style={{ color: "#3498db" }}>
                        <option value="MEG">MEG - Mega Evolution</option>
                        <option value="PFL">PFL - Phantasmal Flames</option>
                        <option value="ASC">ASC - Ascended Heroes</option>
                        <option value="POR">POR - Perfect Order</option>
                        <option value="CHR">CHR - Chaos Rising</option>
                        <option value="MEP">MEP - Mega Evolution Promos</option>
                      </optgroup>

                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ color: "white", fontSize: "13px" }}>Copias en Inventario (Stock)</label>
                  <input type="number" min="1" value={formStock} onChange={e=>setFormStock(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white", marginTop: "5px", outline: "none" }} />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button onClick={() => setIsCreating(false)} style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "transparent", color: "white", cursor: "pointer" }}>Cancelar</button>
                  <button onClick={handleSaveDraft} style={{ flex: 2, padding: "12px", borderRadius: "6px", border: "none", background: "#3498db", color: "white", cursor: "pointer", fontWeight: "bold" }}>Guardar Borrador</button>
                </div>
              </div>

            </div>
          ) : (
            <div>
              <button onClick={() => setIsCreating(true)} style={{ background: "#2ecc71", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginBottom: "20px" }}>+ Crear Anuncio</button>
              <div style={{ display: "grid", gap: "15px", marginBottom: "30px" }}>
                {drafts.map(draft => (
                  <div key={draft.id} onClick={() => toggleSelect(draft.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: draft.selected ? "#1a252f" : "#111", border: draft.selected ? "1px solid #3498db" : "1px solid #333", padding: "15px", borderRadius: "8px", cursor: "pointer" }}>
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
                <div style={{ background: "#111", border: "1px solid #333", padding: "20px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <select value={timer} onChange={(e) => setTimer(e.target.value)} style={{ padding: "8px", borderRadius: "6px", background: "#222", color: "white", border: "1px solid #444", outline: "none" }}>
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

      {/* EN VIVO */}
      {activeTab === "envivo" && (
        <div>
          {misCartasPublicadas.length === 0 ? (
            <p style={{ color: "gray", textAlign: "center" }}>No tienes cartas publicadas activas.</p>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", background: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #e74c3c" }}>
                <div>
                  <h3 style={{ margin: "0 0 5px 0", color: "white" }}>Subasta de Lote Activo</h3>
                  <p style={{ margin: 0, color: "gray", fontSize: "14px" }}>Recibiendo peticiones para {misCartasPublicadas.length} cartas.</p>
                </div>
                <button onClick={handleTerminarClaim} style={{ background: "#e74c3c", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>🛑 Terminar Lote</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
                {misCartasPublicadas.map(carta => (
                  <div key={carta.id} style={{ background: "#111", padding: "15px", borderRadius: "8px", border: "1px solid #333" }}>
                    <div style={{ color: "white", fontWeight: "bold" }}>{carta.name} <span style={{ color: "gray", fontSize: "12px" }}>({carta.set})</span></div>
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

      {/* MIS PEDIDOS */}
      {activeTab === "pedidos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {pedidos.map(pedido => (
            <div key={pedido.id} style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "15px", marginBottom: "15px" }}>
                <div>
                  <h3 style={{ color: "#3498db", margin: "0 0 4px 0" }}>Ganador: {pedido.buyerName}</h3>
                  <span style={{ color: "gray", fontSize: "11px" }}>Recibo: {pedido.id}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "22px", color: "#2ecc71", fontWeight: "bold" }}>${pedido.total} MXN</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ color: "#ccc", fontSize: "13px" }}><strong>Cartas ganadas:</strong> {pedido.items.join(", ")}</div>
                <select value={pedido.status} onChange={(e) => handleChangeStatus(pedido.id, e.target.value)} style={{ padding: "8px", borderRadius: "6px", background: pedido.status === "Entregado ✅" ? "#27ae60" : "#f39c12", color: "white", border: "none", fontWeight: "bold", cursor: "pointer" }}>
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

    </div>
  );
}