import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    valor: { type: mongoose.Schema.Types.Decimal128, required: true },
    idCliente: { type: mongoose.Schema.Types.ObjectId, ref: 'clientes' },
    status: { type: String, enum: ['Aprovada', 'Em análise', 'Reprovada'], required: true },
  },
  {
    versionKey: false,
  },
);

const Transaction = mongoose.model('transactions', transactionSchema);

export default Transaction;
