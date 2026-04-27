// 1. FIX de compatibilidad para MongoDB Driver (¡Muy importante!)
const crypto = require('crypto');
if (!global.crypto) {
    global.crypto = crypto;
}

require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { conectarDB } = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

async function startServer() {
    const app = express();
    
    // Conectamos a la base de datos antes de arrancar Apollo
    await conectarDB();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => {
            // Aquí podrías pasar el DB context si tus resolvers lo necesitan
        }
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log("================================================");
        console.log(`🚀 Servidor KONECTO listo en puerto ${PORT}`);
        console.log(`🔗 GraphQL: http://localhost:${PORT}${server.graphqlPath}`);
        console.log("================================================");
    });
}

startServer().catch(err => {
    console.error("❌ Error al arrancar el servidor:", err);
});