import conexion from '../config/db.js';

export const registrarLog = (req, res) => {

    const { usuario, evento, browser } = req.body;

    const ip =
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress;

    const sql = `
        INSERT INTO logs
        (usuario, ip, evento, browser)
        VALUES (?, ?, ?, ?)
    `;

    conexion.query(
        sql,
        [usuario, ip, evento, browser],
        (error) => {

            if (error) {
                return res.status(500).json(error);
            }

            res.json({
                mensaje: 'Log registrado'
            });

        }
    );

};