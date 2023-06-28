import express from 'express';
import ClienteController from '../controllers/ClientesController.js'

const router = express.Router();

router
    .post('/api/admin/cliente', ClienteController.createCliente)


export default router;