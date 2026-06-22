let cartas = {
  Pikachu: false,
  Charizard: false,
  Bulbasaur: false,
  Squirtle: false,
  Mewtwo: false,
};

// 👉 GET = obtener estado
export async function GET() {
  return Response.json(cartas);
}

// 👉 POST = hacer claim
export async function POST(req) {
  const body = await req.json();
  const { name } = body;

  if (cartas[name]) {
    return Response.json({
      success: false,
      message: "Ya fue vendida 😢",
    });
  }

  const ganaste = Math.random() > 0.5;

  if (ganaste) {
    cartas[name] = true;

    return Response.json({
      success: true,
      message: "Ganaste la carta 🎉",
    });
  } else {
    return Response.json({
      success: false,
      message: "Alguien fue más rápido 😢",
    });
  }
}