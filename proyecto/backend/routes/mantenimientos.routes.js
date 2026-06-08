import express from 'express';

import {
    obtenerMantenimientos,
    crearMantenimiento,
    eliminarMantenimiento,
    actualizarMantenimiento
} from '../controllers/mantenimientos.controller.js';
// Requisito: CRUD de mantenimientos
// Requisito: Backend en NodeJS
// Requisito: Objetivo del sistema (Mantenimiento de computadoras)
const router = express.Router();

router.get('/', obtenerMantenimientos);

router.post('/', crearMantenimiento);

router.put('/:id', actualizarMantenimiento);

router.delete('/desactivar/:id', eliminarMantenimiento);

export default router;