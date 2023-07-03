import express from 'express';
import AccountController from '../controllers/AccountsController.js';
import userValidation from '../../middlewares/userValidation.js';
import jwtMiddleware from '../../middlewares/jwtMiddleware.js';

const router = express.Router();

router
  .get('/api/admin/accounts', jwtMiddleware.tokenVerifier, AccountController.findAccounts)
  .get('/api/admin/accounts/:id', jwtMiddleware.tokenVerifier, AccountController.findAccountById)
  .post('/api/admin/accounts', AccountController.createAccount)
  .post('/api/accounts/login', userValidation.loginValidation, AccountController.loginAccount)
  .put('/api/admin/accounts/:id', jwtMiddleware.tokenVerifier, AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', jwtMiddleware.tokenVerifier, AccountController.deleteAccount);

export default router;
