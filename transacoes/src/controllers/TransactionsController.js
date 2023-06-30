import Transaction from '../models/Transaction.js';
import fetch from 'node-fetch'

const VALIDATE_CARD_API = 'http://clientes:3001/api/admin/validar'
const ANTI_FRAUD_API = 'http://anti-fraude:3000/api/admin/antifraude'

class TransactionController {
  // private method
  static #postAPI = async (api, data) => {
    let response = await fetch(api, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    const status = response.status;

    response = await response.json()

    return {status, response};
  }

  static #postTransactionOnDB = async (data) => {
    const transaction = new Transaction({
      ...data
    });
    await transaction.save();

    return transaction;
  }

  static createTransaction = async (req, res) => {
    const { valor, nomeCartao, numeroCartao, validadeCartao, cvcCartao } = req.body;

    const body = {
      numeroCartao,
      nomeCartao,
      validadeCartao,
      cvcCartao
    };

    let status = 'Em análise';

    try {
      const validateCard = await this.#postAPI(VALIDATE_CARD_API, body)

      if (validateCard.status === 404 || validateCard.status === 400) {
        status = 'Reprovada';

        await this.#postTransactionOnDB({
          valor,
          status
        });

        return res.status(400).send({ message: validateCard.message });
      }

      if (validateCard.rendaMensal >= 0.5 * valor) {
        status = 'Aprovada';
      }

      const transaction = await this.#postTransactionOnDB({
          valor,
          idCliente: validateCard.id,
          status
        });

      if (status === 'Em análise') {
        const bodyAntiFraud = {
          idCliente: validateCard._id,
          idTransacao: transaction._id
        };

        await this.#postAPI(ANTI_FRAUD_API, bodyAntiFraud);
      };

      return res.status(status === 'Aprovada' ? 201 : 303).set('Location', `transactions/${transaction._id}`).send({ transactionId: transaction._id, status })

    } catch (err) {
      console.log(err);
      res.status(500).send({message: err.message});
    }
  }

  static getTransactionById = async (req, res) => {
    const { id } = req.params
    
    try {
      const transaction =  await Transaction.findById(id)
      return res.status(200).send(transaction)
      
    } catch (error) {
      if (error.message.includes('Cast to ObjectId failed for value')) {
        return res.status(404).send('ID da Transação Inválido. Não foi encontrada nenhuma transação com essa ID.')
      }
    }
  }

  static updateTransactionStatusById = async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    const statusOptions = ['Aprovada','Reprovada']

    try {
      const transaction =  await Transaction.findById(id)
      
      if (transaction.status !== 'Em análise') {
        throw new Error(`Não é possível alterar o status de uma Transação ${transaction.status}`)
      }

      if (!statusOptions.includes(status)) {
        throw new Error('Status Inválido. O status da Transação só pode ser alterado para Aprovado ou Reprovado')
      }  

      transaction.status = status
      await transaction.save()

      res.status(200).send(`Status da Transação alterado para ${status}.`)
    
    } catch (error) {
      if (error.message.includes('Cast to ObjectId failed for value')) {
        return res.status(404).send('ID da Transação Inválido. Não foi encontrada nenhuma transação com essa ID.')
      }
      if (error instanceof Error) {
        return res.status(400).send(error.message)
      } 
      res.status(500).send(error.message);
    }
  }
};

export default TransactionController;
