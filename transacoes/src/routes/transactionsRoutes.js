import express from 'express';
import TransactionController from '../controllers/TransactionsController.js';
import jwtMiddleware from '../../middlewares/jwtMiddleware.js';

const router = express.Router();

router
  .post('/api/admin/transactions', jwtMiddleware.tokenVerifier, TransactionController.createTransaction)
  .get('/api/admin/transactions/:id', TransactionController.getTransactionById)
  .put('/api/admin/transactions/:id', TransactionController.updateTransactionStatusById);

export default router;
