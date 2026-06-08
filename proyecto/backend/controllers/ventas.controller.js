import conexion from '../config/db.js';

// Requisito: CRUD de ventas
// Requisito: Backend en NodeJS
// Requisito: Objetivo del sistema (Venta de computadoras y componentes)

export const obtenerVentas = (req, res) => {
    const sql = 'SELECT * FROM ventas WHERE activo = 1 ORDER BY id DESC';

    conexion.query(sql, (error, resultados) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'Error al obtener ventas',
                error
            });
        }

        res.json(resultados);
    });
};

// Requisito: CRUD de ventas
export const crearVenta = (req, res) => {
    const {
        cliente,
        producto,
        cantidad,
        total
    } = req.body;

    const sql = `
        INSERT INTO ventas
        (cliente, producto, cantidad, total)
        VALUES (?, ?, ?, ?)
    `;

    conexion.query(
        sql,
        [cliente, producto, cantidad, total],
        (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    mensaje: 'Error al crear venta',
                    error
                });
            }

            res.json({
                mensaje: 'Venta registrada',
                id: resultado.insertId
            });
        }
    );
};

// Requisito: CRUD de ventas
export const eliminarVenta = (req, res) => {
    const { id } = req.params;

    const sql = `
        UPDATE ventas
        SET activo = 0
        WHERE id = ?
    `;

    conexion.query(sql, [id], (error) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al anular venta',
                error
            });
        }

        res.json({
            ok: true,
            mensaje: 'Venta anulada correctamente'
        });
    });
};