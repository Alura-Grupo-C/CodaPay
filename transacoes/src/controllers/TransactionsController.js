import Transaction from '../models/Transaction.js';
import dotenv from 'dotenv'

dotenv.config()

class TransactionController {
  static createTransaction = async (req, res) => {
    const { valor, nome, numeroCartao, validadeCartao, cvv } = req.body;

    const validateCard = await fetch('')

    const transaction = new Transaction({
      valor
    });
    try {
      await transaction.save();
    } catch (err) {
      console.log(err);
    }
  };
}
