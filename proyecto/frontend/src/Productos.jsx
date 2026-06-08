import { useState, useEffect } from 'react'

function Productos() {
    const API = 'http://localhost:3000/productos'

    const [productos, setProductos] = useState([])
    const [buscar, setBuscar] = useState('')

    const [nombre, setNombre] = useState('')
    const [marca, setMarca] = useState('')
    const [categoria, setCategoria] = useState('')
    const [precio, setPrecio] = useState('')
    const [stock, setStock] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [imagen, setImagen] = useState('')

    const [editando, setEditando] = useState(false)
    const [productoId, setProductoId] = useState(null)

    useEffect(() => {
        obtenerProductos()
    }, [])

    async function obtenerProductos() {
        try {
            const respuesta = await fetch(API)
            const data = await respuesta.json()
            // Filtrar preventivo en el front por si el backend aún envía los desactivados
            setProductos(Array.isArray(data) ? data.filter(p => p.activo !== false) : [])
        } catch (error) {
            console.error("Error al obtener productos:", error)
        }
    }

    async function guardarProducto(e) {
        e.preventDefault()

        const producto = {
            nombre,
            marca,
            categoria,
            precio: Number(precio),
            stock: Number(stock),
            descripcion,
            imagen,
            activo: true // Mantenemos el registro marcado como activo
        }

        try {
            if (editando) {
                await fetch(`${API}/${productoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(producto)
                })
                setEditando(false)
                setProductoId(null)
            } else {
                await fetch(API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(producto)
                })
            }
            limpiarFormulario()
            obtenerProductos()
        } catch (error) {
            console.error("Error al guardar producto:", error)
        }
    }

    
    function limpiarFormulario() {
        setNombre('')
        setMarca('')
        setCategoria('')
        setPrecio('')
        setStock('')
        setDescripcion('')
        setImagen('')
    }

    function editarProducto(producto) {
        setEditando(true)
        setProductoId(producto.id || producto._id) // Soporte para ID de SQL o MongoDB

        setNombre(producto.nombre)
        setMarca(producto.marca)
        setCategoria(producto.categoria)
        setPrecio(producto.precio)
        setStock(producto.stock)
        setDescripcion(producto.descripcion)
        setImagen(producto.imagen)
    }

    // Requisito de la materia: ELIMINACIÓN LÓGICA (No destruye la fila, la desactiva)
    async function eliminarProducto(id) {

        if (!confirm('¿Eliminar producto?')) return

        try {

            await fetch(`${API}/${id}`, {
                method: 'DELETE'
            })

            obtenerProductos()

        } catch (error) {

            console.error(error)

        }

    }



    return (
        <>
            <div className="card mb-4">
                <div className="card-body">
                    <h3 className="mb-3" style={{ color: '#ff7b00' }}>
                        {editando ? 'Modificar Elemento de Inventario' : 'Registrar Nuevo Producto'}
                    </h3>

                    <form onSubmit={guardarProducto}>
                        <div className="row">
                            <div className="col-md-6">
                                <input
                                    className="form-control mb-2"
                                    placeholder="Nombre del Producto"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Marca"
                                    value={marca}
                                    onChange={(e) => setMarca(e.target.value)}
                                    required
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Categoría"
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    placeholder="Precio (Bs.)"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    min="0"
                                    step="0.10"
                                    required
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    placeholder="Unidades en Stock"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    min="0"
                                    required
                                />
                                <input
                                    type="url"
                                    className="form-control mb-2"
                                    placeholder="URL de la Imagen"
                                    value={imagen}
                                    onChange={(e) => setImagen(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <textarea
                            className="form-control mb-3"
                            placeholder="Especificaciones técnicas o descripción..."
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows="2"
                            required
                        ></textarea>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-orange w-100 fw-bold">
                                {editando ? 'Actualizar Registro' : 'Confirmar Registro'}
                            </button>
                            {editando && (
                                <button 
                                    type="button" 
                                    className="btn btn-outline-danger"
                                    onClick={() => { setEditando(false); limpiarFormulario(); }}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <h2 className="mb-3" style={{ color: '#ff7b00' }}>Inventario General</h2>

            <input
                className="form-control mb-4"
                placeholder="Filtrar por nombre del producto..."
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
            />

            <div className="row">
                {productos
                    .filter(producto =>
                        producto.nombre.toLowerCase().includes(buscar.toLowerCase())
                    )
                    .map(producto => (
                        <div key={producto.id || producto._id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm border-secondary bg-dark-card">
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    style={{
                                        height: '220px',
                                        objectFit: 'cover',
                                        width: '100%'
                                    }}
                                />

                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h4 style={{ color: '#ff7b00' }} className="fw-bold">{producto.nombre}</h4>
                                        <hr style={{ backgroundColor: '#ff7b00' }} />
                                        <p className="text-light mb-1"><b>Marca:</b> {producto.marca}</p>
                                        <p className="text-light mb-1"><b>Categoría:</b> {producto.categoria}</p>
                                        <p className="text-light mb-1"><b>Precio:</b> Bs. {producto.precio}</p>
                                        <p className="text-light mb-2"><b>Stock:</b> {producto.stock} uds.</p>
                                        <p className="text-light-50 small text-justify">{producto.descripcion}</p>
                                    </div>

                                    <div className="d-flex gap-2 mt-3">
                                        <button
                                            className="btn btn-warning w-100 fw-bold"
                                            onClick={() => editarProducto(producto)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger w-100 fw-bold"
                                            onClick={() => eliminarProducto(producto.id || producto._id)}
                                        >
                                            Dar de Baja
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    )
}

export default Productos