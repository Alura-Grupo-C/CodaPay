import express from 'express';
import TransactionController from '../controllers/TransactionsController.js';

const router = express.Router();

router
  .post('/api/transactions', TransactionController.createTransaction);

export default router;
