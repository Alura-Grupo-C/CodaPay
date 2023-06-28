/* eslint-disable no-underscore-dangle */
import AnaliseAntiFraude from '../models/AnaliseAntiFraude.js';

class AnaliseAntiFraudeController {
  static criarAnalise = async (req, res) => {
    try {
      const analiseAntiFraude = new AnaliseAntiFraude({
        ...req.body,
        statusAnalise: 'em analise',
        dataCriacao: Date(),
        ultimaModificacao: Date(),
      });
      const response = await analiseAntiFraude.save();
      return res.status(201).json(response);
    } catch (error) {
      if (error._message === 'analiseantifraudes validation failed') {
        return res.status(400).json({ message: `Falha no Validacao dos dados da Antifraude -  ${error.message}` });
      }
      console.log(error);
      return res.status(500).json({ message: `Falha no Servidor: ${error.message}` });
    }
  };


  static listaAnalises = async (req, res) => {
    try {
      const listagemAnalises = await AnaliseAntiFraude.find({statusAnalise: 'em analise'});

      if (listagemAnalises.length > 0) {
        res.status(200).json(listagemAnalises);
      } else {
        res.status(404).send('Nenhuma análise encontrada');
      };
    } catch (error) {
      res.status(500).json(error);

  static atualizarStatusDaAnalise = async (req, res) => {
    try {
      const { id } = Object(req.params);

      if (!(id.match(/^[0-9a-fA-F]{24}$/))) {
        return res.status(400).send({ message: 'o id informado nao é valido' });
      }

      const analiseAntiFraude = await AnaliseAntiFraude.findById(id);
      if (!analiseAntiFraude) {
        return res.status(404).send({ message: 'analise nao encontrada' });
      }

      const statusAtual = analiseAntiFraude.statusAnalise;
      const novoStatus = req.body.statusAnalise;
      if (novoStatus !== 'em analise' && novoStatus !== 'aprovada' && novoStatus !== 'rejeitada') {
        return res.status(400).send({ message: `O estado da analise '${novoStatus}' não é valido ` });
      }
      if (statusAtual === 'rejeitada' || statusAtual === 'aprovada') {
        return res.status(400).send({ message: `não é possivel alterar o status da analise atual: '${statusAtual}'` });
      }
      if (statusAtual === novoStatus) {
        return res.status(400).send({ message: 'o novo status não pode ser igual ao atual' });
      }

      await AnaliseAntiFraude.findByIdAndUpdate(id, {
        $set: {
          statusAnalise: novoStatus,
          ultimaModificacao: Date(),
        },
      });
      return res.status(200).json({ message: ' status atualizado' });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({ message: `Erro no servidor - ${error}` });
    }
  };
}

export default AnaliseAntiFraudeController;
