/**
 * @file resolvers.js
 * @description Resolutores de GraphQL con validaciones robustas, seguridad (Bcrypt)
 * y gestión de persistencia en MongoDB.
 */

const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { ApolloError, UserInputError } = require('apollo-server-express');
const bcrypt = require('bcryptjs');

const resolvers = {
  Query: {
    /**
     * Obtiene todos los usuarios de la colección.
     */
    obtenerUsuarios: async () => {
      try {
        const db = getDB();
        const usuarios = await db.collection('usuarios').find().toArray();
        return usuarios.map(u => ({ ...u, id: u._id.toString() }));
      } catch (error) {
        throw new ApolloError("Error al recuperar la lista de usuarios");
      }
    },

    /**
     * Autenticación avanzada: Valida email y compara password con el hash de la DB.
     */
    loginUsuario: async (_, { email, password }) => {
      try {
        const db = getDB();
        if (!email || !password) throw new UserInputError("Email y contraseña son obligatorios");

        const usuario = await db.collection('usuarios').findOne({ email });
        if (!usuario) throw new UserInputError("El usuario no existe");

        const passwordCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecto) throw new UserInputError("Credenciales incorrectas");

        return { ...usuario, id: usuario._id.toString() };
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        throw new ApolloError("Error en el proceso de login");
      }
    },

    /**
     * Obtiene todos los voluntariados registrados.
     */
    obtenerVoluntariados: async () => {
      try {
        const db = getDB();
        const lista = await db.collection('voluntariados').find().toArray();
        return lista.map(v => ({ ...v, id: v._id.toString() }));
      } catch (error) {
        throw new ApolloError("Error al recuperar los voluntariados");
      }
    }
  },

  Mutation: {
    /**
     * Registro seguro: Valida email, duplicados y aplica hashing con Bcrypt.
     */
    registrarUsuario: async (_, args) => {
      try {
        const db = getDB();
        const { nombre, email, password } = args;

        if (!nombre || !email || !password) throw new UserInputError("Faltan datos obligatorios");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) throw new UserInputError("Formato de email no válido");

        const existe = await db.collection('usuarios').findOne({ email });
        if (existe) throw new UserInputError("Este email ya está registrado");

        const salt = await bcrypt.genSalt(10);
        const hashedDoc = {
          ...args,
          password: await bcrypt.hash(password, salt)
        };

        const resultado = await db.collection('usuarios').insertOne(hashedDoc);
        return { ...args, id: resultado.insertedId.toString() };
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        throw new ApolloError("Error al registrar el usuario");
      }
    },

    /**
     * Creación de voluntariado con Validación Robusta de opciones.
     */
    crearVoluntariado: async (_, args) => {
      try {
        const db = getDB();
        const { tipo } = args;

        // VALIDACIÓN DE OPCIONES: Solo permite OFERTA o DEMANDA
        const opcionesValidas = ["OFERTA", "DEMANDA"];
        if (!opcionesValidas.includes(tipo.toUpperCase())) {
          throw new UserInputError("Tipo no válido. Debe ser 'OFERTA' o 'DEMANDA'");
        }

        // Normalizamos el valor a mayúsculas antes de guardar
        args.tipo = tipo.toUpperCase();

        const resultado = await db.collection('voluntariados').insertOne(args);
        return { ...args, id: resultado.insertedId.toString() };
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        throw new ApolloError("Error al crear el registro de voluntariado");
      }
    },

    /**
     * Elimina un registro individual validando el ID de MongoDB.
     */
    eliminarVoluntariado: async (_, { id }) => {
      try {
        if (!ObjectId.isValid(id)) throw new UserInputError("Formato de ID no válido");

        const db = getDB();
        const res = await db.collection('voluntariados').deleteOne({ _id: new ObjectId(id) });

        if (res.deletedCount === 0) throw new UserInputError("Registro no encontrado");
        return `Registro ${id} eliminado con éxito.`;
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        throw new ApolloError("Error al eliminar el registro");
      }
    },

    /**
     * Vacía la colección de voluntariados.
     */
    eliminarTodosVoluntariados: async () => {
      try {
        const db = getDB();
        const res = await db.collection('voluntariados').deleteMany({});
        return `Se han eliminado ${res.deletedCount} registros de voluntariados.`;
      } catch (error) {
        throw new ApolloError("Error al vaciar la colección de voluntariados");
      }
    },

    /**
     * Vacía la colección de usuarios (Logins).
     */
    eliminarTodosUsuarios: async () => {
      try {
        const db = getDB();
        const res = await db.collection('usuarios').deleteMany({});
        return `Se han eliminado ${res.deletedCount} usuarios correctamente.`;
      } catch (error) {
        throw new ApolloError("Error al vaciar la colección de usuarios");
      }
    }
  }
};

module.exports = resolvers;