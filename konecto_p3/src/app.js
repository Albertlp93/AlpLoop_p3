/* SERVIDOR EXPRESS + CONFIGURACION APOLLO */

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4'); // Compatible con Express 5
const { json } = require('body-parser');
const cors = require('cors');

// 1. Tus definiciones y resolvers (igual que antes)
const typeDefs = `#graphql
  type Voluntariado {
    id: ID!
    titulo: String!
    tipo: String!
  }
  type Query {
    obtenerVoluntariados: [Voluntariado]
  }
`;

const resolvers = {
  Query: {
    obtenerVoluntariados: () => [{ id: "1", titulo: "Prueba Node", tipo: "Oferta" }],
  },
};

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  // Aplicamos el middleware de GraphQL
  app.use('/graphql', cors(), json(), expressMiddleware(server));

  app.listen(4000, () => {
    console.log(`🚀 Servidor listo en http://localhost:4000/graphql`);
  });
}

startServer();