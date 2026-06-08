import conexion from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Requisito: CRUD de usuarios
// Requisito: Login de usuarios
// Requisito: Roles y permisos
// Requisito: Contraseñas encriptadas
// Requisito: Backend en NodeJS

export const obtenerUsuarios = (req, res) => {
    const sql = 'SELECT * FROM usuarios';

    conexion.query(sql, (error, resultados) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'Error al obtener usuarios',
                error
            });
        }

        res.json(resultados);
    });
};

// Requisito: CRUD de usuarios
// Requisito: Contraseñas encriptadas
export const crearUsuario = async (req, res) => {
    const {
        nombre,
        correo,
        password,
        rol
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const sql = `
        INSERT INTO usuarios
        (nombre, correo, password, rol)
        VALUES (?, ?, ?, ?)
    `;

    conexion.query(
        sql,
        [nombre, correo, passwordHash, rol],
        (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    mensaje: 'Error al crear usuario',
                    error
                });
            }

            res.json({
                mensaje: 'Usuario creado correctamente',
                id: resultado.insertId
            });
        }
    );
};

// Requisito: Registro de usuarios
// Requisito: Contraseñas encriptadas
export const registrarUsuario = async (req, res) => {
    const {
        nombre,
        correo,
        password
    } = req.body;

    const sqlVerificar =
        'SELECT * FROM usuarios WHERE correo = ?';

    conexion.query(
        sqlVerificar,
        [correo],
        async (error, resultados) => {
            if (error) {
                return res.status(500).json({
                    mensaje: 'Error del servidor'
                });
            }

            if (resultados.length > 0) {
                return res.status(400).json({
                    mensaje: 'El correo ya existe'
                });
            }

            const passwordHash =
                await bcrypt.hash(password, 10);

            const sqlInsertar = `
                INSERT INTO usuarios
                (nombre, correo, password, rol)
                VALUES (?, ?, ?, ?)
            `;

            conexion.query(
                sqlInsertar,
                [
                    nombre,
                    correo,
                    passwordHash,
                    'admin'
                ],
                (error) => {
                    if (error) {
                        return res.status(500).json({
                            mensaje: 'Error al registrar usuario'
                        });
                    }

                    res.json({
                        mensaje: 'Usuario registrado correctamente'
                    });
                }
            );
        }
    );
};

// Requisito: Login de usuarios
// Requisito: Roles y permisos
export const loginUsuario = (req, res) => {
    const {
        correo,
        password
    } = req.body;

    const sql =
        'SELECT * FROM usuarios WHERE correo = ?';

    conexion.query(
        sql,
        [correo],
        async (error, resultados) => {
            if (error) {
                return res.status(500).json({
                    mensaje: 'Error del servidor'
                });
            }

            if (resultados.length === 0) {
                return res.status(404).json({
                    mensaje: 'Usuario no encontrado'
                });
            }

            const usuario = resultados[0];

            const passwordCorrecta =
                await bcrypt.compare(
                    password,
                    usuario.password
                );

            if (!passwordCorrecta) {
                return res.status(401).json({
                    mensaje: 'Contraseña incorrecta'
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    correo: usuario.correo,
                    rol: usuario.rol
                },
                'secreto',
                {
                    expiresIn: '1h'
                }
            );

            res.json({
                mensaje: 'Login correcto',
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    rol: usuario.rol
                }
            });
        }
    );
};