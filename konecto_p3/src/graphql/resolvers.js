/**
 * @file resolvers.js
 * @description Resolutores con lógica de persistencia, seguridad y limpieza masiva.
 */

const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { ApolloError, UserInputError } = require('apollo-server-express');
const bcrypt = require('bcryptjs');

const resolvers = {
  Query: {
    obtenerUsuarios: async () => {
      try {
        const db = getDB();
        const usuarios = await db.collection('usuarios').find().toArray();
        return usuarios.map(u => ({ ...u, id: u._id.toString() }));
      } catch (error) {
        throw new ApolloError("Error al recuperar usuarios");
      }
    },

    loginUsuario: async (_, { email, password }) => {
      try {
        const db = getDB();
        if (!email || !password) throw new UserInputError("Campos obligatorios faltantes");

        const usuario = await db.collection('usuarios').findOne({ email });
        if (!usuario) throw new UserInputError("El usuario no existe");

        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) throw new UserInputError("Contraseña incorrecta");

        return { ...usuario, id: usuario._id.toString() };
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        throw new ApolloError("Error en la autenticación");
      }
    },

    obtenerVoluntariados: async () => {
      try {
        const db = getDB();
        const lista = await db.collection('voluntariados').find().toArray();
        return lista.map(v => ({ ...v, id: v._id.toString() }));
      } catch (error) {
        throw new ApolloError("Error al obtener voluntariados");
      }
    }
  },

  Mutation: {
    registrarUsuario: async (_, args) => {
      try {
        const db = getDB();
        const existe = await db.collection('usuarios').findOne({ email: args.email });
        if (existe) throw new UserInputError("El email ya está registrado en Konecto");

        const salt = await bcrypt.genSalt(10);
        args.password = await bcrypt.hash(args.password, salt);

        const resultado = await db.collection('usuarios').insertOne(args);
        return { ...args, id: resultado.insertedId.toString() };
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        throw new ApolloError("No se pudo completar el registro");
      }
    },

    crearVoluntariado: async (_, args) => {
      try {
        const db = getDB();
        const resultado = await db.collection('voluntariados').insertOne(args);
        return { ...args, id: resultado.insertedId.toString() };
      } catch (error) {
        throw new ApolloError("Error al crear voluntariado");
      }
    },

    eliminarVoluntariado: async (_, { id }) => {
      try {
        if (!ObjectId.isValid(id)) throw new UserInputError("ID inválido");
        const db = getDB();
        const res = await db.collection('voluntariados').deleteOne({ _id: new ObjectId(id) });
        if (res.deletedCount === 0) throw new UserInputError("No se encontró el registro");
        return `Registro ${id} eliminado.`;
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        throw new ApolloError("Error al eliminar");
      }
    },

    // --- NUEVAS FUNCIONES DE LIMPIEZA ---

    eliminarTodosVoluntariados: async () => {
      try {
        const db = getDB();
        const res = await db.collection('voluntariados').deleteMany({});
        return `Éxito: Se han borrado ${res.deletedCount} registros de voluntariado.`;
      } catch (error) {
        throw new ApolloError("Error al vaciar voluntariados");
      }
    },

    eliminarTodosUsuarios: async () => {
      try {
        const db = getDB();
        const res = await db.collection('usuarios').deleteMany({});
        return `Éxito: Se han borrado ${res.deletedCount} usuarios del sistema.`;
      } catch (error) {
        throw new ApolloError("Error al vaciar usuarios");
      }
    }
  }
};

module.exports = resolvers;