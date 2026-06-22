import Card from "./Card";

export default function ClaimsView({ cartas, socket, userId }) {
  // Agrupamos las cartas dinámicamente por vendedor
  const sellersGroup = {};
  
  Object.values(cartas).forEach(carta => {
    if (!sellersGroup[carta.sellerName]) {
      sellersGroup[carta.sellerName] = [];
    }
    sellersGroup[carta.sellerName].push(carta);
  });

  const groupedSellers = Object.entries(sellersGroup);

  if (groupedSellers.length === 0) {
    return <div style={{ color: "gray", textAlign: "center", marginTop: "50px" }}>El mercado está vacío. Esperando a que los vendedores publiquen claims...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", marginTop: "20px", width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      {groupedSellers.map(([sellerName, sellerCards], index) => (
        <div key={sellerName} style={{ background: "#111", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px", borderBottom: "1px solid #333", paddingBottom: "15px" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: index % 2 === 0 ? "#e74c3c" : "#9b59b6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "20px", color: "white" }}>
              {sellerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: "0 0 5px 0", color: "#fff" }}>{sellerName}</h2>
              <span style={{ color: "gray", fontSize: "14px" }}>{sellerCards.length} cartas activas</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px", justifyItems: "center" }}>
            {sellerCards.map((carta) => (
              <Card key={carta.id} data={carta} socket={socket} userId={userId} />
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}