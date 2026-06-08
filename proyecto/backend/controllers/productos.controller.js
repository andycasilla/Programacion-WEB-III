import conexion from '../config/db.js';

// Requisito: CRUD de productos
// Requisito: Backend en NodeJS
// Requisito: Objetivo del sistema (Venta de computadoras y componentes)

export const obtenerProductos = (req, res) => {
    const sql = 'SELECT * FROM productos';

    conexion.query(sql, (error, resultados) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'Error al obtener productos',
                error
            });
        }

        res.json(resultados);
    });
};

// Requisito: CRUD de productos
export const crearProducto = (req, res) => {
    const {
        nombre,
        marca,
        categoria,
        precio,
        stock,
        descripcion,
        imagen
    } = req.body;

    const sql = `
        INSERT INTO productos
        (nombre, marca, categoria, precio, stock, descripcion, imagen)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    conexion.query(
        sql,
        [nombre, marca, categoria, precio, stock, descripcion, imagen],
        (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    mensaje: 'Error al crear producto',
                    error
                });
            }

            res.json({
                mensaje: 'Producto creado',
                id: resultado.insertId
            });
        }
    );
};

// Requisito: CRUD de productos
export const actualizarProducto = (req, res) => {
    const { id } = req.params;

    const {
        nombre,
        marca,
        categoria,
        precio,
        stock,
        descripcion,
        imagen
    } = req.body;

    const sql = `
        UPDATE productos
        SET
            nombre = ?,
            marca = ?,
            categoria = ?,
            precio = ?,
            stock = ?,
            descripcion = ?,
            imagen = ?
        WHERE id = ?
    `;

    conexion.query(
        sql,
        [nombre, marca, categoria, precio, stock, descripcion, imagen, id],
        (error) => {
            if (error) {
                return res.status(500).json({
                    mensaje: 'Error al actualizar producto',
                    error
                });
            }

            res.json({
                mensaje: 'Producto actualizado'
            });
        }
    );
};

// Requisito: CRUD de productos
export const eliminarProducto = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM productos WHERE id = ?';

    conexion.query(sql, [id], (error) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'Error al eliminar producto',
                error
            });
        }

        res.json({
            mensaje: 'Producto eliminado'
        });
    });
};