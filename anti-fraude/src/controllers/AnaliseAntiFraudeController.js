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
    }
  };
}

export default AnaliseAntiFraudeController;
