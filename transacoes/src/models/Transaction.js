import mongoose from 'mongoose';
import { ClienteSchema } from '../../../clientes/src/models/Cliente.js';
import { DB_CLIENTE_URL } from '../../../clientes/src/config/dbConnect.js';

const dbClientes = mongoose.createConnection(DB_CLIENTE_URL)
const Cliente = dbClientes.model('clientes', ClienteSchema);

const transactionSchema = new mongoose.Schema(
  {
    valor: { type: mongoose.Schema.Types.Decimal128, required: true },
    idCliente: { type: mongoose.Schema.Types.ObjectId, ref: Cliente},
    status: { type: String, enum: ['Aprovada', 'Em análise', 'Reprovada'], required: true },
  },
  {
    versionKey:false,
  }
);

const Transaction = mongoose.model('transactions', transactionSchema);

export default Transaction;
