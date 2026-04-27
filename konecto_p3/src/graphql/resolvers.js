const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const resolvers = {
  Query: {
    // Obtener todos los usuarios
    obtenerUsuarios: async () => {
      try {
        const db = getDB();
        const usuarios = await db.collection('usuarios').find().toArray();
        
        // Mapeamos para que GraphQL reciba 'id' en lugar de '_id'
        return usuarios.map(u => ({
          ...u,
          id: u._id.toString()
        }));
      } catch (error) {
        console.error("Error en obtenerUsuarios:", error);
        throw new Error("No se pudieron obtener los usuarios");
      }
    },

    // Login de usuario (Búsqueda por email y password)
    loginUsuario: async (_, { email, password }) => {
      try {
        const db = getDB();
        const usuario = await db.collection('usuarios').findOne({ email, password });
        
        if (!usuario) return null;

        return {
          ...usuario,
          id: usuario._id.toString()
        };
      } catch (error) {
        console.error("Error en loginUsuario:", error);
        throw new Error("Error en el proceso de login");
      }
    },

    // Obtener todos los voluntariados
    obtenerVoluntariados: async () => {
      try {
        const db = getDB();
        const voluntariados = await db.collection('voluntariados').find().toArray();
        
        return voluntariados.map(v => ({
          ...v,
          id: v._id.toString()
        }));
      } catch (error) {
        console.error("Error en obtenerVoluntariados:", error);
        throw new Error("No se pudieron obtener los voluntariados");
      }
    }
  },

  Mutation: {
    // Registro de nuevo usuario
    registrarUsuario: async (_, args) => {
      try {
        const db = getDB();
        const resultado = await db.collection('usuarios').insertOne(args);
        
        return {
          ...args,
          id: resultado.insertedId.toString()
        };
      } catch (error) {
        console.error("Error en registrarUsuario:", error);
        throw new Error("No se pudo registrar el usuario");
      }
    },

    // Crear un nuevo voluntariado
    crearVoluntariado: async (_, args) => {
      try {
        const db = getDB();
        const resultado = await db.collection('voluntariados').insertOne(args);
        
        return {
          ...args,
          id: resultado.insertedId.toString()
        };
      } catch (error) {
        console.error("Error en crearVoluntariado:", error);
        throw new Error("No se pudo crear el voluntariado");
      }
    },

    // Eliminar un voluntariado (Requiere ObjectId para buscar por ID real de Mongo)
    eliminarVoluntariado: async (_, { id }) => {
      try {
        const db = getDB();
        const resultado = await db.collection('voluntariados').deleteOne({
          _id: new ObjectId(id)
        });

        if (resultado.deletedCount === 1) {
          return `Voluntariado con ID ${id} eliminado correctamente.`;
        } else {
          return "No se encontró el voluntariado para eliminar.";
        }
      } catch (error) {
        console.error("Error en eliminarVoluntariado:", error);
        throw new Error("Error al intentar eliminar");
      }
    }
  }
};

module.exports = resolvers;