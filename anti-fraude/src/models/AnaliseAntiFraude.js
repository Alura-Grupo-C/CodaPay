import mongoose from 'mongoose';

const analiseAntiFraudeSchema = new mongoose.Schema(
  {
    idCliente: {
      type: mongoose.Types.ObjectId,
      ref: 'clientes',
      required: true,
    },
    idTransacao: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    statusAnalise: {
      type: String,
      ref: 'transactions',
      enum: ['aprovada', 'rejeitada'],
      required: true,
    },
    dataCriacao: {
      type: Date,
      required: true,
    },
    ultimaModificacao: {
      type: Date,
      required: true,
    },
  },
);

const AnaliseAntiFraude = mongoose.model('analiseantifraudes', analiseAntiFraudeSchema);

export default AnaliseAntiFraude;
