const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Objeto de Usuario
  type Usuario {
    id: ID!            # En GraphQL pediremos 'id'
    nombre: String!
    email: String!
    password: String
  }

  # Objeto de Voluntariado (Ofertas y Demandas)
  type Voluntariado {
    id: ID!            # En GraphQL pediremos 'id'
    titulo: String!
    tipo: String!
    descripcion: String
    jornada: String
    sueldo: Int
    email: String
  }

  type Query {
    # Obtener todos los usuarios
    obtenerUsuarios: [Usuario]

    # Login de usuario
    loginUsuario(email: String!, password: String!): Usuario

    # Obtener todos los voluntariados
    obtenerVoluntariados: [Voluntariado]
  }

  type Mutation {
    # Registro de nuevo usuario
    registrarUsuario(nombre: String!, email: String!, password: String!): Usuario

    # Registro de nuevo voluntariado
    crearVoluntariado(
      titulo: String!, 
      tipo: String!, 
      descripcion: String, 
      jornada: String, 
      sueldo: Int, 
      email: String!
    ): Voluntariado

    # Eliminar un voluntariado por su ID
    eliminarVoluntariado(id: ID!): String
  }
`;

module.exports = typeDefs;