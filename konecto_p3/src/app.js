// src/app.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

async function startServer() {
    const app = express();
    
    // Configuración de Apollo v3
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers 
    });

    await server.start();

    // Aplica el middleware a Express
    server.applyMiddleware({ app });

    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor KONECTO listo`);
        console.log(`📡 URL: http://localhost:${PORT}/graphql`);
    });
}

startServer();