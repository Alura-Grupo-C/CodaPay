import Cliente from '../models/Cliente.js';
import cryptoHandler from '../../middlewares/cryptoHandler.js';
import validate from '../validacao/validacaoCliente.js';


class ClienteController {
  static createCliente = async (req, res) => {
    const { dadosPessoais, endereco, dadosCartao } = req.body;

    const {
      numeroCartao, nomeCartao, validadeCartao, cvcCartao, diaVencimentoFatura,
    } = dadosCartao;

    const numero = await cryptoHandler.criptografaDados(numeroCartao);
    const nome = await cryptoHandler.criptografaDados(nomeCartao);
    const cvc = await cryptoHandler.criptografaDados(cvcCartao);
    const vencimentoFatura = await cryptoHandler.criptografaDados(diaVencimentoFatura);

    const cliente = new Cliente({
      dadosPessoais,
      endereco,
      dadosCartao: {
        numeroCartao: numero,
        nomeCartao: nome,
        validadeCartao,
        cvcCartao: cvc,
        diaVencimentoFatura: vencimentoFatura,
      },
      createdDate: Date(),
    });

    cliente.save((err, newCliente) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(201).set('Location', `/admin/accounts/${cliente.id}`).json(newCliente);
    });
  };

  static findClientes = async (req, res) => {
    try {
      const pesquisa = await Cliente.find();
      return res.status(200).json({ Clientes: pesquisa });
    } catch (erro) {
      return res.status(500).json({ message: erro });
    }
  };

  static findClienteById = async (req, res) => {
    const { id } = req.params;
    try {
      const cliente = await Cliente.findById(id);
      if (cliente) {
        const dadosPessoais = { dadosPessoais: cliente.dadosPessoais };
        const endereco = { endereco: cliente.endereco };
        const vencimentoFatura = { vencimentoFatura: cliente.dadosCartao.diaVencimentoFatura };
        return res.status(200).json({ Cliente: [dadosPessoais, endereco, vencimentoFatura] });
      } else {
        return res.status(404).send({ message: 'Cliente não encontrado' });
      }
    } catch (erro) {
      return res.status(500).send({ message: erro.message });
    }
  };

  static validarDadosCliente = async (req, res) => {
    const {
      numeroCartao, nomeCartao, validadeCartao, cvcCartao,
    } = req.body;

    const numero = await cryptoHandler.criptografaDados(numeroCartao);
    const nome = await cryptoHandler.criptografaDados(nomeCartao);
    const cvc = await cryptoHandler.criptografaDados(cvcCartao);

    try {
      const cliente = await Cliente.findOne({ 'dadosCartao.numeroCartao': numero });
      if (!cliente) return res.status(404).send('Dados do cartão inválidos');
      const { dadosCartao } = cliente;

      if (dadosCartao.nomeCartao === nome
        && dadosCartao.validadeCartao === validadeCartao
        && dadosCartao.cvcCartao === cvc) {
        const renda = cliente.dadosPessoais.rendaMensal;

        let validateDate;
        if (validate.data(validadeCartao)) {
          validateDate = "Cartão com data vigente"
        } else {
          validateDate = "Cartão com data vencida"
        }
        return res.status(200).json({ message: 'Dados válidos', id: cliente._id, rendaMensal: renda, validateDate });
      } else {
        return res.status(400).send({ message: 'Dados do cartão inválidos' });
      }

      return res.status(404).send('Dados do cartão não encontrado');
    } catch (erro) {
      if (erro.message === "Cannot read properties of undefined (reading '_id')") {
        return res.status(404).send('Dados do cartão não encontrado');
      }
      return res.status(500).send({ message: erro.message });
    }
  };
}

export default ClienteController;
