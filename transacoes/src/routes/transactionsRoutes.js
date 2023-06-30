import express from 'express';
import TransactionController from '../controllers/TransactionsController.js';

const router = express.Router();

router
  .get('/api/admin/transactions/:id', TransactionController.getTransactionById)
  .post('/api/admin/transactions', TransactionController.createTransaction)
  .put('/api/admin/transactions/:id', TransactionController.updateTransactionStatusById);

export default router;
