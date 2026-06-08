import express from 'express';

import {
    obtenerUsuarios,
    crearUsuario,
    registrarUsuario,
    loginUsuario
} from '../controllers/usuarios.controller.js';

// Requisito: CRUD de usuarios
// Requisito: Login de usuarios
// Requisito: Roles y permisos
// Requisito: Contraseñas encriptadas
// Requisito: Backend en NodeJS

const router = express.Router();

router.get('/', obtenerUsuarios);

router.post('/', crearUsuario);

router.post('/registro', registrarUsuario);

router.post('/login', loginUsuario);

export default router;