import { useState } from "react";

export default function LocalStoreView({ userName }) {
  // 🎛️ Pestañas Principales
  const [localTab, setLocalTab] = useState("inventario"); 
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // 1. BASE DE DATOS LOCAL (Dinámica)
  // ==========================================
  
  const [slots, setSlots] = useState([
    { id: "SLOT_1", name: "Vitrina Principal", type: "vitrina" },
    { id: "SLOT_2", name: "Carpeta SVI Premium", type: "album" },
    { id: "SLOT_3", name: "Caja de Reserva", type: "caja" }
  ]);

  const [inventario, setInventario] = useState([
    { id: "INV_1", cardName: "Charizard ex", set: "OBF", price: 1200, status: "por_vender", slotId: "SLOT_1", buyerName: null, date: "2026-07-13" },
    { id: "INV_2", cardName: "Iono SIR", set: "PAL", price: 1800, status: "en_venta", slotId: "CLAIM", buyerName: "ZunoTCG", date: "2026-07-13" },
    { id: "INV_3", cardName: "Giratina V Alt", set: "LOR", price: 4500, status: "vendida", slotId: "ENTREGADO", buyerName: "AlexisPro", date: "2026-07-12" }
  ]);

  // ==========================================
  // 2. ESTADOS DE FORMULARIOS Y VISTAS
  // ==========================================
  
  const [invFilter, setInvFilter] = useState("por_vender"); 
  const [albumViewActive, setAlbumViewActive] = useState(null); 
  const [newSlotName, setNewSlotName] = useState("");
  const [newSlotType, setNewSlotType] = useState("caja");
  
  const [newCard, setNewCard] = useState({ cardName: "", set: "", price: "", slotId: "pendiente" });
  // 🔥 ESTADOS CORREGIDOS (Aquí estaba el error)
  const [editId, setEditId] = useState(null); 
  const [isScanning, setIsScanning] = useState(false); 

  // Estados para la Exhibición Pública
  const [publicMessage, setPublicMessage] = useState("¡Bienvenidos a nuestra tienda digital! Subastas todos los viernes.");
  const [exhibitedSlots, setExhibitedSlots] = useState(["SLOT_2"]); 

  // ==========================================
  // 3. FUNCIONES DE CONTROL LOGÍSTICO
  // ==========================================

  const handleCreateSlot = (e) => {
    e.preventDefault();
    if (!newSlotName.trim()) return;
    setSlots([...slots, { id: "SLOT_" + Date.now(), name: newSlotName, type: newSlotType }]);
    setNewSlotName("");
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCard.cardName || !newCard.price) return alert("Nombre y precio son obligatorios.");
    
    if (editId) {
      setInventario(inventario.map(c => c.id === editId ? { ...c, ...newCard } : c));
      setEditId(null);
      alert("✏️ Carta actualizada en el sistema.");
    } else {
      setInventario([{ 
        id: "INV_" + Date.now(), 
        ...newCard, 
        status: "por_vender", 
        buyerName: null, 
        date: new Date().toISOString().split('T')[0] 
      }, ...inventario]);
    }
    setNewCard({ cardName: "", set: "", price: "", slotId: "pendiente" });
  };

  const handleEditCard = (carta) => {
    setNewCard({ cardName: carta.cardName, set: carta.set, price: carta.price, slotId: carta.slotId });
    setEditId(carta.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleDeleteCard = (id) => {
    if(window.confirm("¿Estás seguro de eliminar esta carta de tu inventario físico?")) {
      setInventario(inventario.filter(c => c.id !== id));
    }
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setNewCard({ ...newCard, cardName: "Mewtwo VSTAR", set: "PGO", price: "450" });
      setIsScanning(false);
    }, 1500);
  };

  const pushToLiveMarket = (id) => {
    setInventario(inventario.map(c => 
      c.id === id ? { ...c, status: "en_venta", slotId: "CLAIM" } : c
    ));
    alert("¡Carta enviada al Mercado en Vivo!");
  };

  const confirmDelivery = (id) => {
    const pin = prompt("Ingresa el PIN de 4 dígitos proporcionado por el comprador para confirmar la entrega:");
    if (pin) {
      setInventario(inventario.map(c => 
        c.id === id ? { ...c, status: "vendida", slotId: "ENTREGADO" } : c
      ));
      alert("✅ Entrega verificada. La carta pasó a Vendidas.");
    }
  };

  const toggleExhibition = (slotId) => {
    if (exhibitedSlots.includes(slotId)) {
      setExhibitedSlots(exhibitedSlots.filter(id => id !== slotId));
    } else {
      setExhibitedSlots([...exhibitedSlots, slotId]);
    }
  };

  // ==========================================
  // 4. CÁLCULOS DINÁMICOS
  // ==========================================
  
  const cartasPorVender = inventario.filter(c => c.status === "por_vender");
  const cartasEnVenta = inventario.filter(c => c.status === "en_venta");
  const cartasVendidas = inventario.filter(c => c.status === "vendida");
  
  const valorInventarioActual = cartasPorVender.reduce((acc, c) => acc + Number(c.price), 0);
  const ingresosGenerados = cartasVendidas.reduce((acc, c) => acc + Number(c.price), 0);

  const resultadosBusqueda = searchTerm ? inventario.filter(item => {
    const term = searchTerm.toLowerCase();
    return item.cardName.toLowerCase().includes(term) || 
           (item.buyerName && item.buyerName.toLowerCase().includes(term)) || 
           item.date.includes(term);
  }) : [];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", color: "white", animation: "fadeIn 0.3s ease-in-out" }}>
      
      {/* CABECERA PRO */}
      <div style={{ background: "linear-gradient(135deg, #111 0%, #1c1c1a 100%)", padding: "25px", borderRadius: "12px", border: "1px solid #2ecc71", marginBottom: "25px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: "0 0 5px 0", color: "#2ecc71", display: "flex", alignItems: "center", gap: "10px" }}>🏪 Sistema de Gestión Local</h2>
          <p style={{ margin: 0, color: "gray", fontSize: "13px" }}>Control maestro de inventario físico, ventas y ubicaciones</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "12px", color: "gray" }}>Valor del Stock Físico</div>
          <div style={{ fontSize: "24px", color: "#2ecc71", fontWeight: "bold" }}>${valorInventarioActual} MXN</div>
        </div>
      </div>

      {/* MENÚ DE PESTAÑAS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px", borderBottom: "1px solid #222", paddingBottom: "12px", overflowX: "auto" }}>
        <button onClick={() => setLocalTab("inventario")} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: localTab === "inventario" ? "#3498db" : "#111", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>🗄️ Control de Inventario</button>
        <button onClick={() => { setLocalTab("almacenamiento"); setAlbumViewActive(null); }} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: localTab === "almacenamiento" ? "#2ecc71" : "#111", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>📦 Almacenamiento Local</button>
        <button onClick={() => setLocalTab("exhibicion")} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: localTab === "exhibicion" ? "#9b59b6" : "#111", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>🌐 Página Pública</button>
        <button onClick={() => setLocalTab("metricas")} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: localTab === "metricas" ? "#f1c40f" : "#111", color: "black", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>📊 Rendimiento Real</button>
      </div>

      {/* 🔍 BUSCADOR MAESTRO GLOBAL */}
      <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333", marginBottom: "25px" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#2ecc71", fontSize: "14px" }}>🔍 Buscador Omnicanal</h4>
        <input 
          type="text" 
          placeholder="Busca por carta, comprador o fecha..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #444", background: "#000", color: "white", outline: "none", fontSize: "14px" }}
        />
        {searchTerm && (
          <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {resultadosBusqueda.map(item => {
              const slot = slots.find(s => s.id === item.slotId);
              return (
                <div key={item.id} style={{ padding: "12px", background: "#1a1a1a", borderRadius: "6px", display: "flex", justifyContent: "space-between", borderLeft: "4px solid #3498db" }}>
                  <div>
                    <strong style={{ color: "white" }}>{item.cardName}</strong>
                    {item.buyerName && <span style={{ color: "gray", fontSize: "12px", display: "block" }}>Comprador: {item.buyerName}</span>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "12px", color: "#2ecc71" }}>📍 {item.slotId === "CLAIM" ? "🔴 En Mercado Live" : item.slotId === "ENTREGADO" ? "🤝 Ya entregada" : (slot ? slot.name : "Falta por guardar")}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==============================================================
          PESTAÑA 1: INVENTARIO, BORRADORES Y LIVE MARKET
          ============================================================== */}
      {localTab === "inventario" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333", display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px", background: "#000", border: "1px dashed #e74c3c", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", minHeight: "150px" }}>
              {isScanning ? (
                <div style={{ color: "#e74c3c", textAlign: "center", animation: "pulse 1s infinite" }}>📷 Escaneando carta...</div>
              ) : (
                <>
                  <div style={{ fontSize: "30px", marginBottom: "10px" }}>📷</div>
                  <button type="button" onClick={simulateScan} style={{ background: "#e74c3c", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>Usar Escáner OCR</button>
                  <span style={{ color: "gray", fontSize: "11px", marginTop: "8px", textAlign: "center" }}>Autocompleta los datos</span>
                </>
              )}
            </div>

            <form onSubmit={handleAddCard} style={{ flex: "2 1 400px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#fff" }}>
                  {editId ? "✏️ Editando Carta" : "Añadir al Stock Local"}
                </h4>
              </div>
              <input type="text" placeholder="Nombre Carta" value={newCard.cardName} onChange={e=>setNewCard({...newCard, cardName: e.target.value})} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #444", background: "#1a1a1a", color: "white" }} />
              <input type="text" placeholder="Expansión (Ej. PAL)" value={newCard.set} onChange={e=>setNewCard({...newCard, set: e.target.value})} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #444", background: "#1a1a1a", color: "white" }} />
              <input type="number" placeholder="Precio MXN" value={newCard.price} onChange={e=>setNewCard({...newCard, price: e.target.value})} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #444", background: "#1a1a1a", color: "white" }} />
              <select value={newCard.slotId} onChange={e=>setNewCard({...newCard, slotId: e.target.value})} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #444", background: "#1a1a1a", color: "white", outline: "none" }}>
                <option value="pendiente">⏳ Falta por guardar (Borrador)</option>
                {slots.map(s => <option key={s.id} value={s.id}>📍 Físico: {s.name}</option>)}
              </select>
              <button type="submit" style={{ gridColumn: "span 2", padding: "12px", background: editId ? "#f1c40f" : "#3498db", color: editId ? "black" : "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                {editId ? "Guardar Cambios ✏️" : "Guardar Carta en Stock ✔️"}
              </button>
              {editId && (
                <button type="button" onClick={() => {setEditId(null); setNewCard({ cardName: "", set: "", price: "", slotId: "pendiente" });}} style={{ gridColumn: "span 2", padding: "8px", background: "transparent", color: "gray", border: "1px solid #444", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                  Cancelar Edición
                </button>
              )}
            </form>
          </div>

          <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px", overflowX: "auto" }}>
              <button onClick={() => setInvFilter("por_vender")} style={{ padding: "10px", background: invFilter === "por_vender" ? "#3498db" : "transparent", border: invFilter === "por_vender" ? "none" : "1px solid #444", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}>📦 Por Vender / Stock ({cartasPorVender.length})</button>
              <button onClick={() => setInvFilter("en_venta")} style={{ padding: "10px", background: invFilter === "en_venta" ? "#e74c3c" : "transparent", border: invFilter === "en_venta" ? "none" : "1px solid #444", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}>🔴 En Venta / Claim ({cartasEnVenta.length})</button>
              <button onClick={() => setInvFilter("vendida")} style={{ padding: "10px", background: invFilter === "vendida" ? "#2ecc71" : "transparent", border: invFilter === "vendida" ? "none" : "1px solid #444", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}>🤝 Vendidas ({cartasVendidas.length})</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {(invFilter === "por_vender" ? cartasPorVender : invFilter === "en_venta" ? cartasEnVenta : cartasVendidas).map(carta => {
                const ubicacion = slots.find(s => s.id === carta.slotId);
                return (
                  <div key={carta.id} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", background: "#1a1a1a", padding: "15px", borderRadius: "8px", border: "1px solid #222", gap: "10px" }}>
                    <div>
                      <strong style={{ color: "white", fontSize: "16px" }}>{carta.cardName}</strong> <span style={{ color: "gray", fontSize: "12px" }}>({carta.set})</span>
                      {carta.buyerName && <div style={{ color: "#3498db", fontSize: "12px", marginTop: "4px", fontWeight: "bold" }}>👤 Ganada por: {carta.buyerName}</div>}
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", textAlign: "right" }}>
                      <div>
                        <div style={{ fontWeight: "bold", color: "#f1c40f" }}>${carta.price}</div>
                        <div style={{ fontSize: "11px", color: "white", background: carta.slotId === "CLAIM" ? "#e74c3c" : "#222", padding: "2px 6px", borderRadius: "4px", border: "1px solid #333", marginTop: "4px" }}>
                          {carta.slotId === "CLAIM" ? "🔴 En Mercado Live" : carta.slotId === "ENTREGADO" ? "✅ Entregado" : (ubicacion ? ubicacion.name : "Falta por guardar")}
                        </div>
                      </div>
                      
                      {/* Botones de Acción según el Ciclo */}
                      {invFilter === "por_vender" && (
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button onClick={() => handleEditCard(carta)} style={{ background: "transparent", border: "1px solid #3498db", color: "#3498db", padding: "8px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>✏️</button>
                          <button onClick={() => handleDeleteCard(carta.id)} style={{ background: "transparent", border: "1px solid #e74c3c", color: "#e74c3c", padding: "8px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>🗑️</button>
                          <button onClick={() => pushToLiveMarket(carta.id)} style={{ background: "#e74c3c", border: "none", color: "white", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", marginLeft: "5px" }}>Subir a Live ➔</button>
                        </div>
                      )}
                      {invFilter === "en_venta" && (
                        <button onClick={() => confirmDelivery(carta.id)} style={{ background: "#2ecc71", border: "none", color: "white", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>Verificar PIN ✔️</button>
                      )}
                    </div>
                  </div>
                );
              })}
              {(invFilter === "por_vender" ? cartasPorVender : invFilter === "en_venta" ? cartasEnVenta : cartasVendidas).length === 0 && (
                <div style={{ color: "gray", fontSize: "13px", textAlign: "center", padding: "20px" }}>No hay cartas en esta sección.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          PESTAÑA 2: ALMACENAMIENTO FÍSICO Y ÁLBUM DIGITAL
          ============================================================== */}
      {localTab === "almacenamiento" && !albumViewActive && (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <form onSubmit={handleCreateSlot} style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333", display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "flex-end" }}>
            <div style={{ flex: "2 1 250px" }}>
              <label style={{ color: "gray", fontSize: "12px", display: "block", marginBottom: "6px" }}>Nombre del Contenedor Físico</label>
              <input type="text" placeholder="Ej. Carpeta Base Set / Vitrina 2" value={newSlotName} onChange={e=>setNewSlotName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #444", background: "#000", color: "white", outline: "none" }} />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label style={{ color: "gray", fontSize: "12px", display: "block", marginBottom: "6px" }}>Tipo de Mueble</label>
              <select value={newSlotType} onChange={e=>setNewSlotType(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #444", background: "#000", color: "white", outline: "none" }}>
                <option value="caja">📦 Caja de Cartas</option>
                <option value="album">🎴 Álbum / Carpeta</option>
                <option value="vitrina">💎 Vitrina Mostrador</option>
              </select>
            </div>
            <button type="submit" style={{ flex: "1 1 150px", padding: "11px", background: "#2ecc71", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>+ Crear Slot</button>
          </form>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "15px" }}>
            {slots.map(slot => {
              const cartasEnSlot = inventario.filter(c => c.slotId === slot.id);
              return (
                <div key={slot.id} style={{ background: "#111", padding: "20px", borderRadius: "10px", border: "1px solid #333", cursor: slot.type === "album" ? "pointer" : "default", transition: "all 0.2s" }} onClick={() => slot.type === "album" && setAlbumViewActive(slot)}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "28px", display: "block", marginBottom: "10px" }}>{slot.type === "caja" ? "📦" : slot.type === "album" ? "🎴" : "💎"}</span>
                    {slot.type === "album" && <span style={{ fontSize: "11px", color: "#3498db", border: "1px solid #3498db", padding: "2px 6px", borderRadius: "4px", height: "fit-content" }}>Ver Álbum ➔</span>}
                  </div>
                  <h4 style={{ margin: "0 0 5px 0", color: "white" }}>{slot.name}</h4>
                  <span style={{ color: "gray", fontSize: "12px" }}>Físicamente contiene: <b style={{ color: "#2ecc71" }}>{cartasEnSlot.length} piezas</b></span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VISTA INTERNA: ÁLBUM DIGITAL 3x3 */}
      {localTab === "almacenamiento" && albumViewActive && (
        <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
          <button onClick={() => setAlbumViewActive(null)} style={{ background: "transparent", border: "1px solid #444", color: "white", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", marginBottom: "15px", fontSize: "12px" }}>🡠 Volver a Almacenamiento</button>
          <h3 style={{ color: "#f1c40f", margin: "0 0 20px 0" }}>🎴 Explorando: {albumViewActive.name}</h3>
          
          <div style={{ background: "#0a0a0a", padding: "20px", borderRadius: "8px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", border: "1px solid #222" }}>
            {Array.from({ length: 9 }).map((_, i) => {
              const cartasAlbum = inventario.filter(c => c.slotId === albumViewActive.id);
              const carta = cartasAlbum[i];
              return (
                <div key={i} style={{ aspectRatio: "2.5/3.5", background: carta ? "#1a1a1a" : "#0f0f0f", border: carta ? "1px solid #444" : "1px dashed #333", borderRadius: "6px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "10px", textAlign: "center" }}>
                  {carta ? (
                    <>
                      <strong style={{ color: "#3498db", fontSize: "14px" }}>{carta.cardName}</strong>
                      <span style={{ color: "gray", fontSize: "11px", marginTop: "5px" }}>{carta.set}</span>
                      <span style={{ color: "#2ecc71", fontWeight: "bold", fontSize: "12px", marginTop: "auto" }}>${carta.price}</span>
                    </>
                  ) : (
                    <span style={{ color: "#333", fontSize: "12px" }}>Slot Vacío</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==============================================================
          PESTAÑA 3: CONFIGURACIÓN DE EXHIBICIÓN PÚBLICA
          ============================================================== */}
      {localTab === "exhibicion" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #9b59b6" }}>
            <h3 style={{ color: "#9b59b6", margin: "0 0 15px 0" }}>🌐 Gestionar Dashboard Público</h3>
            <p style={{ color: "gray", fontSize: "13px", marginBottom: "20px" }}>Esto es lo que verán los usuarios cuando den clic a tu tienda en el inicio.</p>
            
            <label style={{ color: "white", fontSize: "13px", display: "block", marginBottom: "6px", fontWeight: "bold" }}>Mensaje / Anuncio de la Tienda</label>
            <textarea 
              value={publicMessage}
              onChange={e => setPublicMessage(e.target.value)}
              style={{ width: "100%", height: "80px", padding: "10px", borderRadius: "8px", border: "1px solid #444", background: "#000", color: "white", outline: "none", resize: "none", marginBottom: "20px" }}
            />

            <label style={{ color: "white", fontSize: "13px", display: "block", marginBottom: "10px", fontWeight: "bold" }}>Álbumes Exhibidos Públicamente</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
              {slots.filter(s => s.type === "album").map(album => (
                <div key={album.id} onClick={() => toggleExhibition(album.id)} style={{ padding: "15px", borderRadius: "8px", border: exhibitedSlots.includes(album.id) ? "2px solid #9b59b6" : "1px solid #333", background: exhibitedSlots.includes(album.id) ? "rgba(155, 89, 182, 0.1)" : "#1a1a1a", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "4px", border: "1px solid #9b59b6", background: exhibitedSlots.includes(album.id) ? "#9b59b6" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "white" }}>{exhibitedSlots.includes(album.id) ? "✓" : ""}</div>
                  <span style={{ color: "white", fontSize: "13px", fontWeight: "bold" }}>{album.name}</span>
                </div>
              ))}
              {slots.filter(s => s.type === "album").length === 0 && (
                <span style={{ color: "gray", fontSize: "12px" }}>No has creado contenedores tipo "Álbum".</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          PESTAÑA 4: MÉTRICAS REALES
          ============================================================== */}
      {localTab === "metricas" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
            <span style={{ color: "gray", fontSize: "12px" }}>🏷️ Valor Actual del Stock (Por Vender)</span>
            <div style={{ fontSize: "32px", color: "#3498db", fontWeight: "bold", marginTop: "5px" }}>${valorInventarioActual}</div>
            <p style={{ color: "gray", fontSize: "11px", margin: "5px 0 0 0" }}>Dinero potencial de {cartasPorVender.length} cartas disponibles.</p>
          </div>
          <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
            <span style={{ color: "gray", fontSize: "12px" }}>🤝 Ingresos Brutos (Entregadas)</span>
            <div style={{ fontSize: "32px", color: "#2ecc71", fontWeight: "bold", marginTop: "5px" }}>${ingresosGenerados}</div>
            <p style={{ color: "gray", fontSize: "11px", margin: "5px 0 0 0" }}>Proveniente de {cartasVendidas.length} entregas verificadas.</p>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
    </div>
  );
}