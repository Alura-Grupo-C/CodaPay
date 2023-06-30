import express from 'express';
import ClienteController from '../controllers/ClientesController.js';

const router = express.Router();

router
    .get('/api/admin/clientes', ClienteController.findClientes)
    .post('/api/admin/validar', ClienteController.validarDadosCliente)
    .post('/api/admin/clientes', ClienteController.createCliente)
    .get('/api/admin/clientes/:id', ClienteController.findClienteById)

export default router;
