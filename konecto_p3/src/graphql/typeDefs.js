/*DEFINICION DE LOS ESQUEMAS TYPES*/

/**
 * src/graphql/typeDefs.js
 * Definición de los esquemas de datos (SDL - Schema Definition Language).
 */

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Objeto de Usuario adaptado del Producto 2
  type Usuario {
    id: ID!
    nombre: String!
    email: String!
    password: String
  }

  # Objeto de Voluntariado (Ofertas y Demandas)
  type Voluntariado {
    id: ID!
    titulo: String!
    tipo: String!
    descripcion: String
    jornada: String
    sueldo: Int
    email: String
  }

  type Query {
    # Equivale a obtenerUsuarios()
    obtenerUsuarios: [Usuario]

    # Equivale a loguearUsuario(email, password)
    loginUsuario(email: String!, password: String!): Usuario

    # Equivale a obtenerVoluntariados()
    obtenerVoluntariados: [Voluntariado]
  }

  type Mutation {
    # Equivale a guardarUsuario(usuario)
    registrarUsuario(nombre: String!, email: String!, password: String!): Usuario

    # Equivale a guardarVoluntariado(datos)
    crearVoluntariado(
      titulo: String!, 
      tipo: String!, 
      descripcion: String, 
      jornada: String, 
      sueldo: Int, 
      email: String!
    ): Voluntariado

    # Equivale a borrarVoluntariado(id)
    eliminarVoluntariado(id: ID!): String
  }
`;

module.exports = typeDefs;