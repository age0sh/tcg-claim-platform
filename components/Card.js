import { useEffect, useState, useRef } from "react";

export default function Card({ data, socket, userId, userName }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const inputRef = useRef(null);

  const claims = data.claims || [];
  const isSoldOut = claims.length >= data.stock;

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = data.unlockTime - Date.now();
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 100);
    return () => clearInterval(interval);
  }, [data.unlockTime]);

  const isLocked = timeLeft > 0;

  useEffect(() => {
    if (isExpanded && inputRef.current && !isLocked && !isSoldOut) inputRef.current.focus();
  }, [isExpanded, isLocked, isSoldOut]);

  const handleSubmit = (e) => {
      e.preventDefault();
      const command = inputValue.trim().toLowerCase();
      if (command === "claim" && !isLocked && !isSoldOut) {
        // 🔥 AHORA SÍ ENVIAMOS EL userName AL SERVIDOR
        socket.emit("claim", { 
          cardId: data._id || data.id, 
          userId, 
          userName, // <-- ¡ESTA ES LA MAGIA QUE FALTABA!
          clientTime: Date.now() 
        });
        setInputValue("");
      }
    };

  return (
    <div style={{ border: isExpanded ? "2px solid #3498db" : "1px solid #333", padding: "15px", borderRadius: "12px", width: "220px", textAlign: "center", background: isExpanded ? "#1a1a1a" : "#111", color: "white", transition: "all 0.3s ease", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: "8px" }}>
      
      {isLocked && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, backdropFilter: "blur(2px)" }}>
          <span style={{ color: "#f1c40f", fontSize: "13px", fontWeight: "bold" }}>Desbloqueo en:</span>
          <span style={{ color: "white", fontSize: "32px", fontWeight: "bold" }}>{(timeLeft / 1000).toFixed(1)}s</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setIsExpanded(true)}>
        <h3 style={{ margin: 0, fontSize: "16px", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{data.name}</h3>
        {isExpanded && <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} style={{ background: "transparent", border: "none", color: "gray", cursor: "pointer" }}>✖</button>}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#aaa", padding: "0 2px", fontWeight: "bold" }}>
        {/* Aseguramos que el precio se vea bien aunque venga solo como número de Mongo */}
        <span style={{ color: "#2ecc71" }}>${data.price} MXN</span>
        <span>{data.language}</span>
      </div>

      {/* 🔥 BADGES/ETIQUETAS DINÁMICAS TCG (Rareza, Tipo y Colección) */}
      <div style={{ display: "flex", gap: "4px", justifyContent: "center", flexWrap: "wrap", fontSize: "10px" }}>
        {data.category && <span style={{ background: "#222", padding: "2px 6px", borderRadius: "4px", color: "#9b59b6", fontWeight: "bold" }}>{data.category}</span>}
        {data.rarity && <span style={{ background: "#222", padding: "2px 6px", borderRadius: "4px", color: "#f1c40f", fontWeight: "bold" }}>{data.rarity}</span>}
        {/* Usamos data.collectionName que es el nuevo nombre en Mongo */}
        {(data.collectionName || data.set) && <span style={{ background: "#000", padding: "1px 5px", borderRadius: "4px", color: "#3498db", border: "1px solid #333", fontWeight: "bold" }}>{data.collectionName || data.set}</span>}
      </div>

      {!isExpanded && (
        <div onClick={() => setIsExpanded(true)} style={{ height: "120px", background: "#1e1e1e", border: "1px solid #222", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "12px", color: "#666" }}>
          {claims.length > 0 ? `${claims.length}/${data.stock} Claims` : "📷 Ver Carta"}
        </div>
      )}

      {isExpanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: "#000", borderRadius: "6px", padding: "8px", minHeight: "70px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", textAlign: "left" }}>
            {claims.length === 0 ? (<span style={{ color: "gray", fontStyle: "italic" }}>Esperando claims...</span>) : (
              claims.map((claim, index) => (
                // Reparación de la llave en el map
                <div key={claim._id || claim.id || index} style={{ display: "flex", justifyContent: "space-between", color: "#2ecc71" }}>
                  <span>{index + 1}. {claim.userId === userId ? "Tú" : claim.user}</span>
                  <span>⏱ {claim.time}</span>
                </div>
              ))
            )}
            {isSoldOut && <div style={{ textAlign: "center", color: "#e74c3c", fontWeight: "bold", marginTop: "4px" }}>⛔ AGOTADO</div>}
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "5px" }}>
            <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Escribe claim..." disabled={isLocked || isSoldOut} style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "none", background: "#333", color: "white", outline: "none", opacity: (isLocked || isSoldOut) ? 0.5 : 1, fontSize: "12px" }} />
          </form>
        </div>
      )}
    </div>
  );
}