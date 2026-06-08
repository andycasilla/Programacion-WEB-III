import express from 'express';

import {
    obtenerClientes,
    crearCliente,
    eliminarCliente
} from '../controllers/clientes.controller.js';
// Requisito: CRUD de clientes
// Requisito: Backend en NodeJS
const router = express.Router();

router.get('/', obtenerClientes);

router.post('/', crearCliente);

router.delete('/:id', eliminarCliente);

export default router;