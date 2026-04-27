require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function conectarDB() {
    try {
        await client.connect();
        console.log("✅ Conexión exitosa a MongoDB Atlas");
        db = client.db(); // Toma automáticamente 'KonectoDB' de la URI
        return db;
    } catch (error) {
        console.error("❌ Error conectando a MongoDB:", error);
        process.exit(1);
    }
}

function getDB() {
    return db;
}

module.exports = { conectarDB, getDB };