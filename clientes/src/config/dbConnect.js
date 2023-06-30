import mongoose from 'mongoose';

export const DB_CLIENTE_URL = `mongodb://admin:secret@${process.env.MONGO_HOST || '127.0.0.1'}:27017/clientes?authSource=admin`

mongoose.connect(DB_CLIENTE_URL);

const db = mongoose.connection;

export default db;
