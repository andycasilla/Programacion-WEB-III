//para probar instalar "npm install"

import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('practica_2', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

const conectaBD = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado a MySQL');

        await sequelize.sync();
        console.log('Tablas sincronizadas');

    } catch (error) {
        console.error('Error de conexión', error);
        process.exit(1);
    }
};

const app = express();
app.use(express.json());

//PARA LAS CATEGORIAS
const Categoria = sequelize.define('Categoria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'categorias',
    timestamps: false
});

//PARA LOS PRODUCTOS
const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    categoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'productos',
    timestamps: false
});

Categoria.hasMany(Producto, {
    foreignKey: 'categoriaId',
    onDelete: 'CASCADE'
});

Producto.belongsTo(Categoria, {
    foreignKey: 'categoriaId'
});

//EJERCICIO 1
app.post('/categorias', async (req, res) => {

    try {
        const { nombre, descripcion } = req.body;
        const resultado = await Categoria.create(
        {
            nombre,
            descripcion
        });
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear categoría',error});
    }
});

//EJERCICIO 2
app.get('/categorias', async (req, res) => {
    try {
        const resultado = await Categoria.findAll();
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({mensaje: 'Error al obtener categorías',error});
    }
});

//EJERCICIO 3
app.get('/categorias/:id', async (req, res) => {
    try {
        const resultado = await Categoria.findByPk(
            req.params.id,
            {
                include: [Producto]
            }
        );

        if (!resultado) {
            return res.status(404).json({mensaje: 'Categoría no encontrada'});
        }
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({mensaje: 'Error al buscar categoría',error});
    }
});

//EJERCICIO 4
app.patch('/categorias/:id', async (req, res) => {

    try {
        const { nombre, descripcion } = req.body;
        await Categoria.update(
            {
                nombre,
                descripcion
            },
            {
                where: {id: req.params.id}
            }
        );
        res.status(200).json({mensaje: 'Categoría actualizada'});
    } catch (error) {
        res.status(500).json({mensaje: 'Error al actualizar categoría',error});
    }
});

//EJERCICIO 5
app.delete('/categorias/:id', async (req, res) => {
    try {
        await Categoria.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({mensaje: 'Categoría eliminada correctamente'});
    } catch (error) {
        res.status(500).json({mensaje: 'Error al eliminar categoría',error});
    }
});

const PUERTO = 3001;
const iniciarServidor = async () => {
    await conectaBD();
    app.listen(PUERTO, () => {
        console.log(`Servidor backend en http://localhost:${PUERTO}`);
    });
};

iniciarServidor();