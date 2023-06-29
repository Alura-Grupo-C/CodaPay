import express from 'express';
import ClienteController from '../controllers/ClientesController.js'

const router = express.Router();

router
    .get('/api/admin/clientes', ClienteController.findClientes)
    .get('/api/admin/clientes/:id', ClienteController.findClienteById)
    .post('/api/admin/clientes', ClienteController.createCliente)


export default router;