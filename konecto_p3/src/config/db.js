/**
 * src/config/db.js
 * Configuración de la conexión a MongoDB
 */

// Refuerzo de crypto también aquí por si el driver inicializa antes
if (!global.crypto) {
    global.crypto = require('crypto');
}

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("❌ ERROR: MONGO_URI no definida en el archivo .env");
    process.exit(1);
}

// Creamos el cliente
const client = new MongoClient(uri);

let db;

async function conectarDB() {
    try {
        console.log("⏳ Conectando a la base de datos NoSQL...");
        
        await client.connect();
        db = client.db(); // Usa la DB definida en la URL o 'test' por defecto
        
        console.log("================================================");
        console.log("✅ ¡ÉXITO! Conexión establecida");
        console.log(`📦 DB Name: ${db.databaseName}`);
        console.log("================================================");
        
        return db;
    } catch (error) {
        console.error("================================================");
        console.error("❌ ERROR DE CONEXIÓN A MONGODB:");
        console.error(error.message);
        console.log("================================================");
        process.exit(1);
    }
}

function getDB() {
    if (!db) throw new Error("DB no inicializada");
    return db;
}

module.exports = { conectarDB, getDB };