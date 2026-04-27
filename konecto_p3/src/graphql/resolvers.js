/*LOGICA - QUERYS - MUTATIONS*/ 

/**
 * src/graphql/resolvers.js
 * Lógica de negocio: Aquí definimos cómo se obtienen y manipulan los datos.
 */

const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const resolvers = {
    Query: {
        obtenerUsuarios: async () => {
            const db = getDB();
            return await db.collection('usuarios').find().toArray();
        },
        loginUsuario: async (_, { email, password }) => {
            const db = getDB();
            const usuario = await db.collection('usuarios').findOne({ email, password });
            if (!usuario) throw new Error("Credenciales inválidas");
            return usuario;
        },
        obtenerVoluntariados: async () => {
            const db = getDB();
            return await db.collection('voluntariados').find().toArray();
        }
    },
    Mutation: {
        registrarUsuario: async (_, args) => {
            const db = getDB();
            const existe = await db.collection('usuarios').findOne({ email: args.email });
            if (existe) throw new Error("El usuario ya existe");
            
            const resultado = await db.collection('usuarios').insertOne(args);
            return { id: resultado.insertedId, ...args };
        },
        crearVoluntariado: async (_, args) => {
            const db = getDB();
            const resultado = await db.collection('voluntariados').insertOne(args);
            return { id: resultado.insertedId, ...args };
        },
        eliminarVoluntariado: async (_, { id }) => {
            const db = getDB();
            // Importante: MongoDB usa ObjectIds, hay que convertir el String
            const resultado = await db.collection('voluntariados').deleteOne({ _id: new ObjectId(id) });
            if (resultado.deletedCount === 1) return "Eliminado correctamente";
            throw new Error("No se pudo eliminar el registro");
        }
    }
};

module.exports = resolvers;