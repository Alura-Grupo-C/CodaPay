/* eslint-disable no-underscore-dangle */
import AnaliseAntiFraude from '../models/AnaliseAntiFraude.js';

const EM_ANALISE = 'Em análise';
const APROVADA = 'Aprovada';
const REPROVADA = 'Reprovada';

async function consultarCliente(id) {
  try {
    const url = `http://localhost:3001/api/admin/clientes/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      dataType: 'json',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 404) {
      return null;
    }
    const dadosCliente = await response.json();
    const cliente = dadosCliente.Cliente;
    return cliente;
  } catch (error) {
    return null;
  }
}

async function atualizarStatusTransacao(id, novoStatus) {
  const data = {
    status: novoStatus,
  };
  try {
    const url = `http://localhost:3002/api/admin/transactions/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status === 204) {
      return response;
    }
    const messageText = await response.text();
    const message = JSON.parse(messageText);

    return { status: response.status, ...message };
  } catch (error) {
    return { status: 500, message: `falha no servidor: ${error}` };
  }
}

class AnaliseAntiFraudeController {
  static criarAnalise = async (req, res) => {
    try {
      const idCliente = req.body.idCliente;
      const idTransacao = req.body.idTransacao;
      const valorTranferencia = req.body.valorTranferencia;

      const informacoesCliente = await consultarCliente(idCliente);
      if (!informacoesCliente) {
        return res.status(404).json({ message: 'Cliente nao encontrado' });
      }

      const cliente = informacoesCliente[0].dadosPessoais;
      const endereco = informacoesCliente[1].endereco;
      const vencimento = informacoesCliente[2].vencimentoFatura;

      const analiseAntiFraude = new AnaliseAntiFraude({
        idCliente,
        informacoesCliente: cliente,
        enderecoCliente: endereco,
        vencimentoFatura: vencimento,
        idTransacao,
        valorTranferencia,
        statusAnalise: EM_ANALISE,
        dataCriacao: Date(),
        ultimaModificacao: Date(),
      });

      const response = await analiseAntiFraude.save();
      return res.status(201).json({ idAnaliseAntiFraude: response.id });
    } catch (error) {
      if (error._message === 'analiseantifraudes validation failed') {
        return res.status(400).json({ message: `Falha no Validacao dos dados da Antifraude -  ${error.message}` });
      }
      return res.status(500).json({ message: `Falha no Servidor: ${error.message}` });
    }
  };

  static listaAnalises = async (req, res) => {
    try {
      const listagemAnalises = await AnaliseAntiFraude.find({
        statusAnalise: EM_ANALISE,
      }, {
        statusAnalise: 1,
        idCliente: 1,
        idTransacao: 1,
      });

      if (listagemAnalises.length > 0) {
        return res.status(200).json(listagemAnalises);
      } else {
        return res.status(404).send('Nenhuma análise encontrada');
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  };

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
      if (novoStatus !== EM_ANALISE && novoStatus !== APROVADA && novoStatus !== REPROVADA) {
        return res.status(400).send({ message: `O estado da analise '${novoStatus}' não é valido ` });
      }
      if (statusAtual === APROVADA || statusAtual === REPROVADA) {
        return res.status(403).send({ message: `não é possivel alterar o status da analise atual: '${statusAtual}'` });
      }
      const idTransacao = analiseAntiFraude.idTransacao;
      const transacao = await atualizarStatusTransacao(idTransacao, novoStatus);

      if (transacao.status === 204) {
        await AnaliseAntiFraude.findByIdAndUpdate(id, {
          $set: {
            statusAnalise: novoStatus,
            ultimaModificacao: Date(),
          },
        });
      }

      return res.status(transacao.status).json({ message: transacao.message });
    } catch (error) {
      return res.status(500).send({ message: `Erro no servidor - ${error}` });
    }
  };

  static listaAnaliseById = async (req, res) => {
    try {
      const { id } = req.params;

      if (!(id.match(/^[0-9a-fA-F]{24}$/))) {
        return res.status(400).send({ message: 'o id informado nao é valido' });
      }

      const analiseById = await AnaliseAntiFraude.findById(id);

      if (!analiseById) {
        return res.status(404).send({ message: 'analise nao encontrada' });
      }

      return res.status(200).json(analiseById);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}

export default AnaliseAntiFraudeController;
