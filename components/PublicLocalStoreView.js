import { useState } from "react";

export default function PublicLocalStoreView({ seller, onBack }) {
  const [albumSeleccionado, setAlbumSeleccionado] = useState(null);

  // Simulamos los datos públicos que el local configuró en su panel
  const mensajePublico = seller.publicMessage || "¡Bienvenidos a nuestra tienda digital! Explorando nuestro catálogo premium.";
  
  // Simulamos las carpetas que el local decidió poner en exhibición
  const carpetasExhibidas = seller.publicAlbums || [
    { id: "ALB_1", name: "🔥 Carpeta Charizard & Vintage", totalCartas: 12 },
    { id: "ALB_2", name: "✨ Hits de Scarlet & Violet", totalCartas: 45 }
  ];

  // Simulamos el contenido de una carpeta para el 3x3
  const cartasMock = [
    { cardName: "Charizard VMAX", set: "DAA", price: 2100 },
    { cardName: "Pikachu V", set: "VIV", price: 400 },
    null, // Slot vacío
    { cardName: "Mewtwo V", set: "PGO", price: 350 },
    null,
    { cardName: "Rayquaza VMAX", set: "EVS", price: 5200 },
    null, null, null
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", color: "white", animation: "fadeIn 0.3s ease-in-out" }}>
      
      <button onClick={onBack} style={{ background: "transparent", border: "1px solid #444", color: "white", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", marginBottom: "20px", fontWeight: "bold" }}>
        🡠 Volver al Inicio
      </button>

      {/* HEADER DE LA TIENDA */}
      <div style={{ background: "linear-gradient(135deg, #111 0%, #1a1a1a 100%)", padding: "40px", borderRadius: "12px", border: "1px solid #9b59b6", marginBottom: "30px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ fontSize: "50px", marginBottom: "15px" }}>🏪</div>
        <h1 style={{ margin: "0 0 10px 0", color: "white", fontSize: "32px" }}>{seller.nombre}</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
          <span style={{ background: "rgba(155, 89, 182, 0.2)", color: "#9b59b6", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", border: "1px solid #9b59b6" }}>Tienda Oficial Verificada</span>
          <span style={{ color: "#f1c40f", fontSize: "14px", fontWeight: "bold", background: "#000", padding: "4px 10px", borderRadius: "6px", border: "1px solid #333" }}>⭐ {seller.rep}</span>
        </div>
        <p style={{ color: "#ccc", fontSize: "16px", maxWidth: "600px", margin: "0 auto", fontStyle: "italic", lineHeight: "1.5" }}>
          "{mensajePublico}"
        </p>
      </div>

      {/* VISTA DE CARPETAS / ÁLBUM DIGITAL */}
      <h2 style={{ color: "#3498db", margin: "0 0 20px 0", borderBottom: "1px solid #222", paddingBottom: "10px" }}>
        {albumSeleccionado ? `🎴 Explorando: ${albumSeleccionado.name}` : "🗄️ Carpetas en Exhibición"}
      </h2>

      {!albumSeleccionado ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {carpetasExhibidas.map(album => (
            <div 
              key={album.id} 
              onClick={() => setAlbumSeleccionado(album)}
              style={{ background: "#111", padding: "25px", borderRadius: "12px", border: "1px solid #333", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#3498db"; e.currentTarget.style.transform = "translateY(-5px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>🎴</div>
              <h3 style={{ margin: "0 0 5px 0", color: "white", fontSize: "16px" }}>{album.name}</h3>
              <span style={{ color: "gray", fontSize: "13px" }}>{album.totalCartas} cartas disponibles</span>
            </div>
          ))}
          {carpetasExhibidas.length === 0 && (
            <p style={{ color: "gray" }}>Esta tienda no tiene álbumes en exhibición por el momento.</p>
          )}
        </div>
      ) : (
        <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
          <button onClick={() => setAlbumSeleccionado(null)} style={{ background: "transparent", border: "1px solid #444", color: "white", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", marginBottom: "20px", fontSize: "12px" }}>
            🡠 Volver a las Carpetas
          </button>
          
          {/* CUADRÍCULA 3x3 PÚBLICA */}
          <div style={{ background: "#0a0a0a", padding: "20px", borderRadius: "8px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", border: "1px solid #222" }}>
            {cartasMock.map((carta, i) => (
              <div key={i} style={{ aspectRatio: "2.5/3.5", background: carta ? "#1a1a1a" : "#0f0f0f", border: carta ? "1px solid #444" : "1px dashed #333", borderRadius: "6px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "10px", textAlign: "center", position: "relative" }}>
                {carta ? (
                  <>
                    <strong style={{ color: "#3498db", fontSize: "14px", marginBottom: "4px" }}>{carta.cardName}</strong>
                    <span style={{ color: "gray", fontSize: "11px", marginBottom: "auto" }}>{carta.set}</span>
                    <span style={{ color: "#2ecc71", fontWeight: "bold", fontSize: "14px" }}>${carta.price}</span>
                    <button style={{ position: "absolute", bottom: "10px", background: "#3498db", border: "none", color: "white", width: "80%", padding: "6px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", opacity: 0.9 }}>
                      🛒 Comprar
                    </button>
                  </>
                ) : (
                  <span style={{ color: "#333", fontSize: "12px" }}>Slot Vacío</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}