import Account from '../models/Account.js';
import criptografia from '../../middlewares/bcryptMiddleware.js';

class AccountController {
  static findAccounts = (_req, res) => {
    Account.find((err, allAccounts) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).json(allAccounts);
    });
  };

  static findAccountById = (req, res) => {
    const { id } = req.params;
    Account.findById(id, (err, account) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!account) {
        return res.status(404).json();
      }
      return res.status(200).json(account);
    });
  };

  static createAccount = async (req, res) => {
    const { senha } = req.body;
    req.body.senha = await criptografia.protegeSenha(senha);
    const account = new Account({
      ...req.body,
      createdDate: Date(),
    });
    account.save((err, newAccount) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(201).set('Location', `/admin/accounts/${account.id}`).json(newAccount);
    });
  };

  static updateAccount = (req, res) => {
    const { id } = req.params;

    Account.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (err, account) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(204).set('Location', `/admin/accounts/${account.id}`).send();
    });
  };

  static deleteAccount = (req, res) => {
    const { id } = req.params;

    Account.findByIdAndDelete(id, (err) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(204).send({ message: 'Account successfully deleted' });
    });
  };
}

export default AccountController;
