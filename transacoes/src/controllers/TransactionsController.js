import Transaction from '../models/Transaction.js';
import fetch from 'node-fetch'

const VALIDATE_CARD_API = 'http://clientes:3001/api/admin/validar'
const ANTI_FRAUD_API = 'http://anti-fraude:3000/api/admin/antifraude'

class TransactionController {
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
      const validateCard = await fetch(VALIDATE_CARD_API, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      });

      if (validateCard.status === 404 || validateCard.status === 400) {
        return res.status(400).send({ message: 'Dados inválidos' });
      }

      if (validateCard.rendaMensal >= 0.5 * valor) {
        status = 'Aprovada';
      }

      const transaction = new Transaction({
          valor,
          idCliente: validateCard._id,
          status
        });

      await transaction.save();

      if (status === 'Em análise') {

        const bodyAntiFraud = {
          idCliente: validateCard._id,
          idTransacao: transaction._id
        };

        await fetch(ANTI_FRAUD_API, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyAntiFraud),
        });
      };

      res.status(status === 'Aprovada' ? 201 : 303).set('Location', `localhost:3002/api/admin/transactions/${transaction._id}`).send({ transactionId: transaction._id, status })
    } catch (err) {
      console.log(err);
      res.status(500).send({message: err.message});
    }
  };
};

export default TransactionController;
