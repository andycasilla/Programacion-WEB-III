import { useState, useEffect } from 'react' // Requisito: Frontend en React

function Clientes() {

    const API = 'http://localhost:3000/clientes' // Requisito: Comunicación con Backend NodeJS

    const [clientes, setClientes] = useState([]) // Requisito: Gestión de clientes
    const [buscar, setBuscar] = useState('') // Requisito: Búsqueda de registros

    const [nombre, setNombre] = useState('')
    const [telefono, setTelefono] = useState('')
    const [correo, setCorreo] = useState('')
    const [direccion, setDireccion] = useState('')

    useEffect(() => {
        obtenerClientes()
    }, []) // Requisito: Consulta de clientes al cargar el módulo

    async function obtenerClientes() {
        const res = await fetch(API)
        const data = await res.json()
        setClientes(data)
    }

    async function guardarCliente(e) {
        e.preventDefault()

        const cliente = {
            nombre,
            telefono,
            correo,
            direccion
        } // Requisito: CRUD - Crear cliente

        await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })

        setNombre('')
        setTelefono('')
        setCorreo('')
        setDireccion('')

        obtenerClientes()
    }

    async function eliminarCliente(id) {

        if (!confirm('¿Eliminar cliente?')) return // Requisito: Eliminación de registros

        await fetch(`${API}/${id}`, {
            method: 'DELETE'
        })

        obtenerClientes()
    }

    return (
        <>
            <h2 className="mt-5">Clientes</h2>

            <div className="card mb-4">
                <div className="card-body">

                    <form onSubmit={guardarCliente}>

                        <input
                            className="form-control mb-2"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />

                        <input
                            className="form-control mb-2"
                            placeholder="Teléfono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />

                        <input
                            className="form-control mb-2"
                            placeholder="Correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />

                        <textarea
                            className="form-control mb-2"
                            placeholder="Dirección"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                        ></textarea>

                        <button className="btn btn-primary w-100">
                            Guardar Cliente
                        </button>

                    </form>

                </div>
            </div>

            <input
                className="form-control mb-4"
                placeholder="Buscar cliente..."
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
            /> {/* Requisito: Búsqueda/Filtro de registros */}

            <div className="row">
                {clientes
                    .filter(cliente =>
                        cliente.nombre.toLowerCase().includes(buscar.toLowerCase())
                    ) // Requisito: Filtrado de clientes
                    .map(cliente => (
                        <div key={cliente.id} className="col-md-4 mb-3">
                            <div className="card h-100">
                                <div className="card-body">

                                    <h4>{cliente.nombre}</h4>

                                    <p><b>Teléfono:</b> {cliente.telefono}</p>
                                    <p><b>Correo:</b> {cliente.correo}</p>
                                    <p><b>Dirección:</b> {cliente.direccion}</p>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => eliminarCliente(cliente.id)}
                                    >
                                        Eliminar
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    )
}

export default Clientes