import express from 'express';
import AnaliseAntiFraudeController from '../controllers/AnaliseAntiFraudeController.js';

const router = express.Router();

router
  .post('/api/admin/antifraude', AnaliseAntiFraudeController.criarAnalise)
  .get('/api/admin/antifraude', AnaliseAntiFraudeController.listaAnalises)
  .put('/api/admin/antifraude/:id', AnaliseAntiFraudeController.atualizarStatusDaAnalise)
  .get('/api/admin/antifraude/:id', AnaliseAntiFraudeController.listaAnaliseById);

export default router;
