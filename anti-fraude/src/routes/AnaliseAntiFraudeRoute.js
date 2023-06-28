import express from 'express';
import AnaliseAntiFraudeController from '../controllers/AnaliseAntiFraudeController.js';

const router = express.Router();

router
  .post('/api/admin/antifraude', AnaliseAntiFraudeController.criarAnalise)
  .get('/api/admin/antifraude', AnaliseAntiFraudeController.listaAnalises);

export default router;
