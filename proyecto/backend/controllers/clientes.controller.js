import conexion from '../config/db.js';
// Requisito: CRUD de clientes
// Requisito: Backend en NodeJS
export const obtenerClientes = (req, res) => {

    const sql = 'SELECT * FROM clientes';

    conexion.query(sql, (error, resultados) => {

        if (error) {
            return res.status(500).json({
                mensaje: 'Error al obtener clientes',
                error
            });
        }

        res.json(resultados);

    });

};
// Requisito: CRUD de clientes
export const crearCliente = (req, res) => {

    const {
        nombre,
        telefono,
        correo,
        direccion
    } = req.body;

    const sql = `
        INSERT INTO clientes
        (nombre, telefono, correo, direccion)
        VALUES (?, ?, ?, ?)
    `;

    conexion.query(
        sql,
        [
            nombre,
            telefono,
            correo,
            direccion
        ],
        (error, resultado) => {

            if (error) {
                return res.status(500).json({
                    mensaje: 'Error al crear cliente',
                    error
                });
            }

            res.json({
                mensaje: 'Cliente creado',
                id: resultado.insertId
            });

        }
    );

};
// Requisito: CRUD de clientes
export const eliminarCliente = (req, res) => {

    const { id } = req.params;

    const sql = 'DELETE FROM clientes WHERE id = ?';

    conexion.query(sql, [id], (error) => {

        if (error) {
            return res.status(500).json({
                mensaje: 'Error al eliminar cliente',
                error
            });
        }

        res.json({
            mensaje: 'Cliente eliminado'
        });

    });

};