/**
 * @file db.js
 * @description Gestión de la conexión a MongoDB. Configurado para entornos Docker y Atlas.
 */

// Fix de compatibilidad para entornos Linux/Docker
if (!global.crypto) {
    global.crypto = require('crypto');
}

require('dotenv').config();
const { MongoClient } = require('mongodb');

/** @constant {string} uri - URI de conexión (Local o Cloud Atlas) */
const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("❌ ERROR: MONGO_URI no definida en .env");
    process.exit(1);
}

const client = new MongoClient(uri);
let db = null;

/**
 * Establece la conexión con MongoDB.
 * @async
 * @returns {Promise<Db>} Instancia de la base de datos.
 */
async function conectarDB() {
    try {
        await client.connect();
        db = client.db(); 
        console.log(`✅ Conexión exitosa a DB: ${db.databaseName}`);
        return db;
    } catch (error) {
        console.error("❌ Error de conexión a MongoDB:", error.message);
        process.exit(1);
    }
}

/**
 * Retorna la instancia activa de la base de datos.
 * @returns {Db}
 */
function getDB() {
    if (!db) throw new Error("Base de datos no inicializada.");
    return db;
}

module.exports = { conectarDB, getDB };