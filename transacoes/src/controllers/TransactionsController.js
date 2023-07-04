import Transaction from '../models/Transaction.js';
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const VALIDATE_CARD_API = process.env.NODE_ENV === 'test' ? 'http://localhost:3001/api/admin/validar' : 'http://clientes:3001/api/admin/validar'
const ANTI_FRAUD_API = process.env.NODE_ENV === 'test' ? 'http://localhost:3000/api/admin/antifraude' : 'http://anti-fraude:3000/api/admin/antifraude'

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

    return {status, response};
  }

  static #postAPIJson = async (api, data) => {
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
      numeroCartao: numeroCartao === undefined ? '' : numeroCartao,
      nomeCartao: nomeCartao === undefined ? '' : nomeCartao,
      validadeCartao: validadeCartao === undefined ? '' : validadeCartao,
      cvcCartao: cvcCartao === undefined ? '' : cvcCartao
    };

    let status = 'Em análise';

    try {
      const validateCard = await this.#postAPIJson(VALIDATE_CARD_API, body)

      if (validateCard.status === 404 || validateCard.status === 400) {
        status = 'Reprovada';

        await this.#postTransactionOnDB({
          valor,
          status
        });

        return res.status(400).send({ message: validateCard.response.message });
      }

      if (validateCard.response.rendaMensal * 0.5 >= valor) {
        status = 'Aprovada';
      }

      const transaction = await this.#postTransactionOnDB({
          valor,
          idCliente: validateCard.response.id,
          status
        });

      if (status === 'Em análise') {
        const bodyAntiFraud = {
          idCliente: validateCard.response.id,
          idTransacao: transaction._id,
          valorTransacao: transaction.valor
        };

        await this.#postAPIJson(ANTI_FRAUD_API, bodyAntiFraud);
      };

      return res.status(status === 'Aprovada' ? 201 : 303).set('Location', `transactions/${transaction._id}`).send({ transactionId: transaction._id, status })

    } catch (err) {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(422).send({ message: err.message });
      }
      return res.status(500).send({message: err.message});
    }
  }

  static getTransactionById = async (req, res) => {
    const { id } = req.params
    
    try {
      const transaction =  await Transaction.findById(id)
      return res.status(200).json(transaction)
      
    } catch (error) {
      if (error.message.includes('Cast to ObjectId failed for value')) {
        return res.status(404).send({message:'ID da Transação Inválido. Não foi encontrada nenhuma transação com essa ID.'})
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

      return res.status(204).send({message:`Status da Transação alterado para ${status}.`})
    
    } catch (error) {
      if (error.message.includes('Cast to ObjectId failed for value')) {
        return res.status(404).send({message: 'ID da Transação Inválido. Não foi encontrada nenhuma transação com essa ID.'})
      }
      if (error instanceof Error) {
        return res.status(400).send({message: error.message})
      } 
      return res.status(500).send({message: error.message});
    }
  }
};

export default TransactionController;
