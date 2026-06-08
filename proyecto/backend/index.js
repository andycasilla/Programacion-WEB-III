import express from 'express';
import cors from 'cors';

import './config/db.js';

import usuariosRoutes from './routes/usuarios.routes.js';
import productosRoutes from './routes/productos.routes.js';
import mantenimientosRoutes from './routes/mantenimientos.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import logsRoutes from './routes/logs.routes.js';
// Requisito: Backend en NodeJS
// Requisito: API REST con Express
// Requisito: Objetivo del sistema (Venta de computadoras y mantenimiento de PCs)
const app = express();

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuariosRoutes);
app.use('/productos', productosRoutes);
app.use('/mantenimientos', mantenimientosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/ventas', ventasRoutes);
app.use('/logs',logsRoutes);


app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});