/**
 * @file app.js
 * @description Punto de entrada principal de la aplicación KONECTO.
 * Configura el servidor Express, integra Apollo Server (GraphQL) e inicializa la conexión a la base de datos.
 * @author Tu Nombre
 */

// 1. FIX de compatibilidad para el Driver de MongoDB (Criptografía nativa)
const crypto = require('crypto');
if (!global.crypto) {
    /** @constant {Object} - Inyección global del módulo crypto para compatibilidad en entornos Docker */
    global.crypto = crypto;
}

// Carga de variables de entorno
require('dotenv').config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { conectarDB } = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

/**
 * Inicializa y configura el servidor Express y el middleware de Apollo.
 * Gestiona el orden de arranque: primero la base de datos, luego el servidor.
 * * @async
 * @function startServer
 * @returns {Promise<void>} No retorna nada, inicia el proceso de escucha del servidor.
 * @throws {Error} Si la conexión a la DB falla o el servidor de Apollo no puede iniciarse.
 */
async function startServer() {
    /** @constant {express.Application} app - Instancia del servidor Express */
    const app = express();
    
    // Conexión obligatoria a la persistencia NoSQL antes de aceptar peticiones
    try {
        await conectarDB();
    } catch (error) {
        console.error("❌ Fallo crítico: No se pudo conectar a la DB. Abortando...");
        process.exit(1);
    }

    /** * @constant {ApolloServer} server - Instancia del servidor GraphQL
     * @description Se configura con las definiciones de tipo y los resolutores del proyecto.
     */
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        /**
         * Contexto de la aplicación. Puede extenderse para manejar autenticación avanzada.
         * @returns {Object} Contexto compartido para los resolvers.
         */
        context: ({ req }) => {
            // Aquí se pueden extraer tokens de cabeceras para autenticación avanzada
            return { req };
        }
    });

    // Inicio del servidor Apollo
    await server.start();
    
    // Integración de GraphQL con Express
    server.applyMiddleware({ app });

    /** @constant {number|string} PORT - Puerto de escucha definido por entorno o por defecto 4000 */
    const PORT = process.env.PORT || 4000;

    /**
     * Puesta en marcha del servidor HTTP
     */
    app.listen(PORT, () => {
        console.log("================================================");
        console.log("🟢 SERVIDOR KONECTO - PRODUCTO 3");
        console.log(`🚀 Listo en: http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`📡 Entorno: ${process.env.MONGO_URI.includes('mongodb.net') ? 'ATLAS (Cloud)' : 'DOCKER (Local)'}`);
        console.log("================================================");
    });
}

/**
 * Ejecución del arranque y captura de errores globales en la inicialización
 */
startServer().catch(err => {
    console.error("❌ ERROR FATAL DURANTE EL ARRANQUE DEL SERVIDOR:");
    console.error(err);
});