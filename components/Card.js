import { useEffect, useState, useRef } from "react";

export default function Card({ data, socket, userId }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const inputRef = useRef(null);

  const claims = data.claims || [];
  const isSoldOut = claims.length >= data.stock;

  // Efecto para calcular el temporizador cada 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = data.unlockTime - Date.now();
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 100);
    return () => clearInterval(interval);
  }, [data.unlockTime]);

  const isLocked = timeLeft > 0;

  useEffect(() => {
    if (isExpanded && inputRef.current && !isLocked && !isSoldOut) {
      inputRef.current.focus();
    }
  }, [isExpanded, isLocked, isSoldOut]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const command = inputValue.trim().toLowerCase();

    if (command === "claim" && !isLocked && !isSoldOut) {
      socket.emit("claim", { cardId: data.id, userId, clientTime: Date.now() });
      setInputValue("");
    }
  };

  return (
    <div style={{ border: isExpanded ? "2px solid #3498db" : "1px solid #333", padding: "15px", borderRadius: "12px", width: "220px", textAlign: "center", background: isExpanded ? "#1a1a1a" : "#111", color: "white", transition: "all 0.3s ease", display: "flex", flexDirection: "column", gap: "10px", position: "relative", overflow: "hidden" }}>
      
      {/* ⏳ OVERLAY DEL TEMPORIZADOR */}
      {isLocked && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, backdropFilter: "blur(2px)" }}>
          <span style={{ color: "#f1c40f", fontSize: "14px", fontWeight: "bold" }}>Se desbloquea en:</span>
          <span style={{ color: "white", fontSize: "36px", fontWeight: "bold" }}>{(timeLeft / 1000).toFixed(1)}s</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setIsExpanded(true)}>
        <h3 style={{ margin: 0, fontSize: "18px", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{data.name}</h3>
        {isExpanded && <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} style={{ background: "transparent", border: "none", color: "gray", cursor: "pointer", fontSize: "16px" }}>✖</button>}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#aaa", padding: "0 5px", fontWeight: "bold" }}>
        <span style={{ color: "#2ecc71" }}>{data.price}</span>
        <span>{data.language}</span>
      </div>

      {!isExpanded && (
        <div onClick={() => setIsExpanded(true)} style={{ height: "140px", background: "#222", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "12px", color: "#777" }}>
          {claims.length > 0 ? `${claims.length}/${data.stock} Claims` : "Clic para ver"}
        </div>
      )}

      {isExpanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ background: "#000", borderRadius: "6px", padding: "8px", minHeight: "80px", display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", textAlign: "left" }}>
            {claims.length === 0 ? (
              <span style={{ color: "gray", fontStyle: "italic" }}>Esperando claims...</span>
            ) : (
              claims.map((claim, index) => (
                <div key={claim.id} style={{ display: "flex", justifyContent: "space-between", color: "#2ecc71" }}>
                  <span>{index + 1}. {claim.userId === userId ? "Tú" : claim.user}</span>
                  <span>⏱ {claim.time}</span>
                </div>
              ))
            )}
            {isSoldOut && <div style={{ textAlign: "center", marginTop: "5px", color: "#e74c3c", fontWeight: "bold" }}>⛔ Agotado</div>}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "5px" }}>
            <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={isLocked ? "Esperando..." : "Escribe claim..."} disabled={isLocked || isSoldOut} style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "none", background: "#333", color: "white", outline: "none", opacity: (isLocked || isSoldOut) ? 0.5 : 1 }} />
          </form>
        </div>
      )}
    </div>
  );
}