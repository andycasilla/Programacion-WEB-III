import conexion from '../config/db.js';
// Requisito: CRUD de mantenimientos
// Requisito: Backend en NodeJS
// Requisito: Objetivo del sistema (Mantenimiento de computadoras)
export const obtenerMantenimientos = (req, res) => {
    const sql = 'SELECT * FROM mantenimientos WHERE activo = 1';

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
// CRUD de mantenimientos: actualizar
export const actualizarMantenimiento = (req, res) => {
    const { id } = req.params;
    const { cliente, equipo, problema, estado, costo } = req.body;

    const sql = `
        UPDATE mantenimientos
        SET cliente = ?, equipo = ?, problema = ?, estado = ?, costo = ?
        WHERE id = ?
    `;

    conexion.query(
        sql,
        [cliente, equipo, problema, estado, costo, id],
        (error) => {
            if (error) {
                return res.status(500).json({
                    mensaje: 'Error al actualizar mantenimiento',
                    error
                });
            }

            res.json({
                ok: true,
                mensaje: 'Mantenimiento actualizado correctamente'
            });
        }
    );
};

// Requisito: CRUD de mantenimientos
export const eliminarMantenimiento = (req, res) => {
    const { id } = req.params;

    const sql = `
        UPDATE mantenimientos
        SET activo = 0
        WHERE id = ?
    `;

    conexion.query(sql, [id], (error) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al dar de baja mantenimiento',
                error
            });
        }

        res.json({
            ok: true,
            mensaje: 'Mantenimiento dado de baja correctamente'
        });
    });
};