import express from 'express';
import AnaliseAntiFraudeController from '../controllers/AnaliseAntiFraudeController.js';
import jwtMiddleware from '../../middlewares/jwtMiddleware.js';

const router = express.Router();

router
  .post('/api/admin/antifraude', AnaliseAntiFraudeController.criarAnalise)
  .get('/api/admin/antifraude', jwtMiddleware.tokenVerifier, AnaliseAntiFraudeController.listaAnalises)
  .put('/api/admin/antifraude/:id', jwtMiddleware.tokenVerifier, AnaliseAntiFraudeController.atualizarStatusDaAnalise)
  .get('/api/admin/antifraude/:id', jwtMiddleware.tokenVerifier, AnaliseAntiFraudeController.listaAnaliseById);

export default router;
