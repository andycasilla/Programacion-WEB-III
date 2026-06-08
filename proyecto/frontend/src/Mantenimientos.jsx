import { useState, useEffect } from 'react'

function Mantenimientos() {
    const API = 'http://localhost:3000/mantenimientos'

    const [mantenimientos, setMantenimientos] = useState([])
    const [buscar, setBuscar] = useState('')

    const [cliente, setCliente] = useState('')
    const [equipo, setEquipo] = useState('')
    const [problema, setProblema] = useState('')
    const [estado, setEstado] = useState('Pendiente')
    const [costo, setCosto] = useState('')

    // Estados para controlar la edición del soporte técnico
    const [editando, setEditando] = useState(false)
    const [mantenimientoId, setMantenimientoId] = useState(null)

    useEffect(() => {
        obtenerMantenimientos()
    }, [])

    async function obtenerMantenimientos() {
        try {
            const res = await fetch(API)
            const data = await res.json()
            
            // CORRECCIÓN SEGURA PARA MYSQL:
            // Solo ocultamos la tarjeta si el campo 'activo' es estrictamente 0.
            // Si el campo es null, undefined o 1 (como en tus registros anteriores), se seguirán mostrando perfectamente.
            if (Array.isArray(data)) {
                const registrosVisibles = data.filter(m => m.activo !== 0 && m.activo !== '0');
                setMantenimientos(registrosVisibles);
            } else {
                setMantenimientos([]);
            }
        } catch (error) {
            console.error("Error al obtener mantenimientos:", error)
        }
    }

    async function guardarMantenimiento(e) {
        e.preventDefault()

        const mantenimiento = {
            cliente,
            equipo,
            problema,
            estado,
            costo: Number(costo),
            activo: 1
        }

        try {
            if (editando) {
                await fetch(`${API}/${mantenimientoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(mantenimiento)
                })
                setEditando(false)
                setMantenimientoId(null)
            } else {
                await fetch(API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(mantenimiento)
                })
            }

            limpiarFormulario()
            obtenerMantenimientos()
        } catch (error) {
            console.error("Error al guardar mantenimiento:", error)
        }
    }

    // Requisito de la materia: ELIMINACIÓN LÓGICA 
    async function eliminarMantenimiento(id) {
        if (!confirm('¿Está seguro de dar de baja esta orden de mantenimiento técnico?')) return

        try {
            const res = await fetch(`${API}/desactivar/${id}`, {
                method: 'DELETE'
            })

            const resultado = await res.json()

            if (resultado.ok) {
                obtenerMantenimientos()
            }
        } catch (error) {
            console.error("Error en la baja lógica del mantenimiento:", error)
        }
    }

    
    function limpiarFormulario() {
        setCliente('')
        setEquipo('')
        setProblema('')
        setEstado('Pendiente')
        setCosto('')
    }

    function activarEdicion(m) {
        setEditando(true)
        setMantenimientoId(m.id || m._id)
        setCliente(m.cliente)
        setEquipo(m.equipo)
        setProblema(m.problema)
        setEstado(m.estado)
        setCosto(m.costo)
    }


    return (
        <>
            <h2 className="mb-4" style={{ color: '#ff7b00' }}>Órdenes de Soporte y Mantenimiento</h2>

            <div className="card mb-4">
                <div className="card-body">
                    <h4 className="mb-3" style={{ color: '#ff7b00' }}>
                        {editando ? 'Modificar Ficha de Soporte' : 'Nueva Ficha de Servicio'}
                    </h4>
                    
                    <form onSubmit={guardarMantenimiento}>
                        <div className="row">
                            <div className="col-md-6">
                                <input
                                    className="form-control mb-2"
                                    placeholder="Nombre del Cliente"
                                    value={cliente}
                                    onChange={(e) => setCliente(e.target.value)}
                                    required
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Equipo Técnico (Ej: Laptop ASUS x515)"
                                    value={equipo}
                                    onChange={(e) => setEquipo(e.target.value)}
                                    required
                                />
                                <select
                                    className="form-select mb-2"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En reparación">En reparación</option>
                                    <option value="Terminado">Terminado</option>
                                </select>
                            </div>
                            
                            <div className="col-md-6">
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Descripción del problema reportado..."
                                    value={problema}
                                    onChange={(e) => setProblema(e.target.value)}
                                    rows="3"
                                    required
                                ></textarea>
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    placeholder="Costo Estimado (Bs.)"
                                    value={costo}
                                    onChange={(e) => setCosto(e.target.value)}
                                    min="0"
                                    step="0.50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-2">
                            <button type="submit" className="btn btn-orange w-100 fw-bold">
                                {editando ? 'Actualizar Orden de Soporte' : 'Registrar Orden de Servicio'}
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

            <input
                className="form-control mb-4"
                placeholder="Filtrar por nombre de cliente..."
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
            />

            <div className="row">
                {mantenimientos
                    .filter(m =>
                        m.cliente && m.cliente.toLowerCase().includes(buscar.toLowerCase())
                    )
                    .map(m => (
                        <div key={m.id || m._id} className="col-md-4 mb-3">
                            <div className="card h-100 border-secondary bg-dark-card">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h4 style={{ color: '#ff7b00' }} className="fw-bold">{m.cliente}</h4>
                                        <hr style={{ backgroundColor: '#ff7b00' }} />
                                        <p className="text-light mb-1"><b>Equipo:</b> {m.equipo}</p>
                                        <p className="text-light mb-1">
                                            <b>Estado: </b> 
                                            <span className={`badge ${
                                                m.estado === 'Terminado' ? 'bg-success' : 
                                                m.estado === 'En reparación' ? 'bg-warning text-dark' : 'bg-danger'
                                            }`}>
                                                {m.estado}
                                            </span>
                                        </p>
                                        <p className="text-light mb-2"><b>Costo Técnico:</b> Bs. {Number(m.costo).toFixed(2)}</p>
                                        <p className="text-light-50 small text-justify"><b>Problema:</b> {m.problema}</p>
                                    </div>

                                    <div className="d-flex gap-2 mt-3">
                                        <button
                                            className="btn btn-warning w-100 fw-bold"
                                            onClick={() => activarEdicion(m)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger w-100 fw-bold"
                                            onClick={() => eliminarMantenimiento(m.id || m._id)}
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

export default Mantenimientos