import express from 'express';

import {
    obtenerVentas,
    crearVenta,
    eliminarVenta
} from '../controllers/ventas.controller.js';
// Requisito: CRUD de ventas
// Requisito: Backend en NodeJS
// Requisito: Objetivo del sistema (Venta de computadoras y componentes)
const router = express.Router();

router.get('/', obtenerVentas);

router.post('/', crearVenta);

router.delete('/:id', eliminarVenta);

export default router;