import express from 'express';

import {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from '../controllers/productos.controller.js';
// Requisito: CRUD de productos
// Requisito: Backend en NodeJS
// Requisito: Objetivo del sistema (Venta de computadoras y componentes)
const router = express.Router();

router.get('/', obtenerProductos);

router.post('/', crearProducto);

router.put('/:id', actualizarProducto);

router.delete('/:id', eliminarProducto);

export default router;