const express = require('express');
const router = express.Router();
const Card = require('../models/Card'); // Asegúrate de que la ruta a tu modelo sea correcta

router.post('/publish-draft', async (req, res) => {
    try {
        // 1. Extraemos los datos tal como los envía el Frontend
        const { 
            name, price, language, condition, rarity, 
            category, collection, stock, sellerId, imageUrl, status 
        } = req.body;

        // 2. Validación de seguridad: Si no hay sellerId, detenemos todo.
        if (!sellerId) {
            return res.status(400).json({ 
                mensaje: "Falta el ID del vendedor. Revisa que el frontend esté enviando el userId." 
            });
        }

        // 3. MAPEO PERFECTO: Traducimos lo del frontend a lo que exige Mongoose
        const nuevaCarta = new Card({
            name: name,
            price: price,
            language: language,
            condition: condition,
            rarity: rarity,
            category: category,
            collectionName: collection, // 👈 SOLUCIÓN 1: Mapeamos 'collection' a 'collectionName'
            sellerId: sellerId,         // 👈 SOLUCIÓN 2: Asignamos el dueño
            stock: stock || 1,
            imageUrl: imageUrl || "",
            status: "inventario"        // 👈 SOLUCIÓN 3: Forzamos 'inventario' (mata cualquier 'draft' oculto)
        });

        // 4. Guardamos en la base de datos
        await nuevaCarta.save();
        console.log("✅ Carta guardada exitosamente en BD:", nuevaCarta.name);

        res.status(201).json(nuevaCarta);

    } catch (error) {
        console.error("❌ Error al guardar borrador:", error.message);
        res.status(500).json({ mensaje: "Error interno del servidor", detalle: error.message });
    }
});

module.exports = router;