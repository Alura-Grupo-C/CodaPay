import express from 'express';
import AnaliseAntiFraudeController from '../controllers/AnaliseAntiFraudeController.js';

const router = express.Router();

router
  .post('/api/admin/antifraude', AnaliseAntiFraudeController.criarAnalise);

export default router;
