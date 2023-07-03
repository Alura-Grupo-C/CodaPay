import express from 'express';
import TransactionController from '../controllers/TransactionsController.js';

const router = express.Router();

router
  .post('/api/admin/transactions', TransactionController.createTransaction)
  .get('/api/admin/transactions/:id', TransactionController.getTransactionById)
  .put('/api/admin/transactions/:id', TransactionController.updateTransactionStatusById);

export default router;
