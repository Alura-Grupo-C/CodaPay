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
}

export default AnaliseAntiFraudeController;
