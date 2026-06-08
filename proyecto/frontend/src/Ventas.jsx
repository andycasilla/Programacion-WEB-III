import { useState, useEffect } from 'react'

function Ventas() {
    const API = 'http://localhost:3000/ventas'

    const [ventas, setVentas] = useState([])
    const [buscar, setBuscar] = useState('')

    const [cliente, setCliente] = useState('')
    const [producto, setProducto] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [total, setTotal] = useState('')

    useEffect(() => {
        obtenerVentas()
    }, [])

    async function obtenerVentas() {
        try {
            const res = await fetch(API)
            const data = await res.json()
            // Filtrado preventivo en el frontend para mostrar solo las transacciones activas
            setVentas(Array.isArray(data) ? data.filter(v => v.activo !== false) : [])
        } catch (error) {
            console.error("Error al obtener las ventas:", error)
        }
    }

    async function guardarVenta(e) {
        e.preventDefault()

        const venta = {
            cliente,
            producto,
            cantidad: Number(cantidad),
            total: Number(total),
            activo: true // Registro marcado como activo
        }

        try {
            await fetch(API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(venta)
            })

            setCliente('')
            setProducto('')
            setCantidad('')
            setTotal('')

            obtenerVentas()
        } catch (error) {
            console.error("Error al registrar la venta:", error)
        }
    }

    // Requisito de la materia: ELIMINACIÓN LÓGICA (Anulación de factura/venta)
    async function eliminarVenta(id) {
        if (!confirm('¿Está seguro de anular esta transacción de venta?')) return

        await fetch(`${API}/${id}`, {
            method: 'DELETE'
        })
    }

    const totalVentas = ventas.reduce(
        (acumulador, venta) => acumulador + Number(venta.total || 0),
        0
    )

    return (
        <>
            <h2 className="mb-4" style={{ color: '#ff7b00' }}>Registro de Transacciones de Ventas</h2>

            <div className="card mb-4">
                <div className="card-body">
                    <h4 className="mb-3" style={{ color: '#ff7b00' }}>Nueva Facturación</h4>
                    
                    <form onSubmit={guardarVenta}>
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
                                    placeholder="Modelo o ID del Producto"
                                    value={producto}
                                    onChange={(e) => setProducto(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    placeholder="Cantidad Unidades"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    min="1"
                                    required
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    placeholder="Total a pagar (Bs.)"
                                    value={total}
                                    onChange={(e) => setTotal(e.target.value)}
                                    min="0"
                                    step="0.10"
                                    required
                                />
                            </div>
                        </div>

                        <button className="btn btn-orange w-100 fw-bold mt-2">
                            Procesar y Emitir Venta
                        </button>
                    </form>
                </div>
            </div>

            {/* Caja de ingresos combinada con el tema oscuro */}
            <div className="card mb-4 border-secondary bg-dark-card text-center py-2">
                <div className="card-body">
                    <h3 className="text-light">Total Liquidado en Caja</h3>
                    <h1 style={{ color: '#ff7b00', fontWeight: 'bold' }}>Bs. {totalVentas}</h1>
                </div>
            </div>

            <input
                className="form-control mb-4"
                placeholder="Filtrar ventas por nombre del cliente..."
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
            />

            <div className="row">
                {ventas
                    .filter(v =>
                        v.cliente.toLowerCase().includes(buscar.toLowerCase())
                    )
                    .map(v => (
                        <div key={v.id || v._id} className="col-md-4 mb-3">
                            <div className="card h-100 border-secondary bg-dark-card">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h4 style={{ color: '#ff7b00' }} className="fw-bold">{v.cliente}</h4>
                                        <hr style={{ backgroundColor: '#ff7b00' }} />
                                        <p className="text-light mb-1"><b>Producto:</b> {v.producto}</p>
                                        <p className="text-light mb-1"><b>Cantidad:</b> {v.cantidad} uds.</p>
                                        <p className="text-light mb-0"><b>Total:</b> Bs. {v.total}</p>
                                    </div>

                                    <div className="mt-3">
                                        <button
                                            className="btn btn-danger w-100 fw-bold"
                                            onClick={() => eliminarVenta(v.id || v._id)}
                                        >
                                            Anular Venta
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

export default Ventas