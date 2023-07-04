import mongoose from 'mongoose';

const analiseAntiFraudeSchema = new mongoose.Schema(
  {
    statusAnalise: {
      type: String,
      enum: ['Aprovada', 'Em análise', 'Reprovada'],
      required: true,
    },
    idCliente: {
      type: String,
      required: true,
    },
    informacoesCliente: {
      type: Object,
      required: true,
    },
    enderecoCliente: {
      type: Object,
      required: true,
    },
    vencimentoFatura: {
      type: String,
      required: true,
    },
    idTransacao: {
      type: String,
      required: true,
    },
    valorTranferencia: {
      type: mongoose.Types.Decimal128,
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
