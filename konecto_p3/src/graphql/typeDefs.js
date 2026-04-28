/**
 * @file typeDefs.js
 * @description Definición del esquema de GraphQL (SDL).
 * Incluye operaciones de gestión masiva y tipos de datos del Producto 2.
 */

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  """
  Representa a un usuario en el sistema Konecto.
  """
  type Usuario {
    id: ID!
    nombre: String!
    email: String!
  }

  """
  Representa una oferta o demanda de voluntariado.
  """
  type Voluntariado {
    id: ID!
    titulo: String!
    "Categoría: OFERTA o DEMANDA"
    tipo: String!
    descripcion: String
    jornada: String
    sueldo: Int
    email: String
  }

  type Query {
    "Obtener todos los usuarios registrados"
    obtenerUsuarios: [Usuario]

    "Validar credenciales de acceso"
    loginUsuario(email: String!, password: String!): Usuario

    "Listado completo de voluntariados"
    obtenerVoluntariados: [Voluntariado]
  }

  type Mutation {
    "Registro de nuevo usuario con cifrado Bcrypt"
    registrarUsuario(
      nombre: String!, 
      email: String!, 
      password: String!
    ): Usuario

    "Creación de una nueva publicación de voluntariado"
    crearVoluntariado(
      titulo: String!, 
      tipo: String!, 
      descripcion: String, 
      jornada: String, 
      sueldo: Int, 
      email: String!
    ): Voluntariado

    "Eliminación individual por ID"
    eliminarVoluntariado(id: ID!): String

    "ELIMINACIÓN MASIVA: Vacía la colección de voluntariados"
    eliminarTodosVoluntariados: String

    "ELIMINACIÓN MASIVA: Vacía la colección de usuarios"
    eliminarTodosUsuarios: String
  }
`;

module.exports = typeDefs;