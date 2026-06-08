import conexion from '../config/db.js';
// Requisito: CRUD de mantenimientos
// Requisito: Backend en NodeJS
// Requisito: Objetivo del sistema (Mantenimiento de computadoras)
export const obtenerMantenimientos = (req, res) => {
    const sql = 'SELECT * FROM mantenimientos';

    conexion.query(sql, (error, resultados) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'Error al obtener mantenimientos',
                error
            });
        }

        res.json(resultados);
    });
};
// Requisito: CRUD de mantenimientos
export const crearMantenimiento = (req, res) => {
    const { cliente, equipo, problema, estado, costo } = req.body;

    const sql = `
        INSERT INTO mantenimientos
        (cliente, equipo, problema, estado, costo)
        VALUES (?, ?, ?, ?, ?)
    `;

    conexion.query(
        sql,
        [cliente, equipo, problema, estado, costo],
        (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    mensaje: 'Error al crear mantenimiento',
                    error
                });
            }

            res.json({
                mensaje: 'Mantenimiento registrado',
                id: resultado.insertId
            });
        }
    );
};

// Requisito: CRUD de mantenimientos
export const eliminarMantenimiento = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM mantenimientos WHERE id = ?';

    conexion.query(sql, [id], (error) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'Error al eliminar mantenimiento',
                error
            });
        }

        res.json({
            mensaje: 'Mantenimiento eliminado'
        });
    });
};