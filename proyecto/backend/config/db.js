import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Requisito: Backend en NodeJS
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

conexion.connect((error) => {
    if (error) {
        console.log('Error de conexión:', error);
    } else {
        console.log('MySQL conectado');
    }
});

export default conexion;