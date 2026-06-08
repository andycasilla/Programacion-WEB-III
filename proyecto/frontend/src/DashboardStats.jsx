import { useEffect, useState, useRef } from 'react' // Requisito: Frontend en React
import html2pdf from 'html2pdf.js' // Requisito: Reporte en PDF
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js' // Requisito: Gráfico estadístico
import { Bar } from 'react-chartjs-2' // Requisito: Gráfico estadístico

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

function DashboardStats() {
    const [productos, setProductos] = useState([]) // Requisito: Estadísticas de productos
    const [clientes, setClientes] = useState([]) // Requisito: Estadísticas de clientes
    const [mantenimientos, setMantenimientos] = useState([]) // Requisito: Estadísticas de mantenimientos
    const [ventas, setVentas] = useState([]) // Requisito: Estadísticas de ventas

    const documentoPdfRef = useRef() // Requisito: Generación de PDF

    useEffect(() => {
        cargarDatos()
    }, [])

    async function cargarDatos() {
        try {
            setProductos([])
            setClientes([])
            setMantenimientos([])
            setVentas([])

            // Requisito: Comunicación con Backend NodeJS (Añadimos timestamp para romper la caché del navegador)
            const t = Date.now()
            const p = await fetch(`http://localhost:3000/productos?t=${t}`)
            const c = await fetch(`http://localhost:3000/clientes?t=${t}`)
            const m = await fetch(`http://localhost:3000/mantenimientos?t=${t}`)
            const v = await fetch(`http://localhost:3000/ventas?t=${t}`)

            const dataProductos = await p.json()
            const dataClientes = await c.json()
            const dataMantenimientos = await m.json()
            const dataVentas = await v.json()

            // Filtramos los mantenimientos para no meter en los totales los que están dados de baja lógica (activo === 0)
            const mantenimientosActivos = Array.isArray(dataMantenimientos) 
                ? dataMantenimientos.filter(item => item.activo !== 0 && item.activo !== '0')
                : []

            setProductos(Array.isArray(dataProductos) ? dataProductos : [])
            setClientes(Array.isArray(dataClientes) ? dataClientes : [])
            setMantenimientos(mantenimientosActivos)
            setVentas(Array.isArray(dataVentas) ? dataVentas : [])

        } catch (error) {
            console.error('Error al cargar las estadísticas:', error)
        }
    }

    const totalVendido = ventas.reduce(
        (acum, venta) => acum + Number(venta.total || 0),
        0
    ) // Requisito: Estadísticas del sistema

    const datosGrafico = {
        labels: [
            'Productos en Inventario',
            'Clientes Registrados',
            'Órdenes de Mantenimiento',
            'Transacciones de Ventas'
        ],
        datasets: [
            {
                label: 'Cantidad Total',
                data: [
                    productos.length,
                    clientes.length,
                    mantenimientos.length,
                    ventas.length
                ],
                backgroundColor: 'rgba(255, 123, 0, 0.6)',
                borderColor: '#ff7b00',
                borderWidth: 2
            }
        ]
    } // Requisito: Gráfico estadístico

    const opcionesGrafico = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#d6d6d6',
                    font: {
                        family: 'Rajdhani',
                        size: 16
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: '#444'
                },
                ticks: {
                    color: '#d6d6d6',
                    font: {
                        family: 'Rajdhani',
                        size: 14
                    }
                }
            },
            y: {
                grid: {
                    color: '#444'
                },
                ticks: {
                    color: '#d6d6d6',
                    font: {
                        family: 'Rajdhani',
                        size: 14
                    }
                }
            }
        }
    }

    // CORRECCIÓN SOLUCIONADA: Forzar recarga antes de compilar el PDF para que contenga los datos nuevos de la BD
    async function exportarPDF() {
        // 1. Forzar una actualización de datos asíncrona justo antes de generar el archivo
        await cargarDatos()

        // 2. Darle un breve respiro de 300ms a React para que pinte los nuevos valores en el DOM oculto
        setTimeout(() => {
            const elemento = documentoPdfRef.current

            const opciones = {
                margin: 15,
                filename: `Informe_Estadistico_TechStore_${Date.now()}.pdf`,
                image: {
                    type: 'jpeg',
                    quality: 0.98
                },
                html2canvas: {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    useCORS: true
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                }
            }

            html2pdf()
                .set(opciones)
                .from(elemento)
                .save()
        }, 300)
    } // Requisito: Reporte PDF

    return (
        <div className="mb-5">
            {/* Requisito: Reporte PDF */}
            <div className="d-flex justify-content-end mb-4">
                <button
                    className="btn btn-success fw-bold px-4 shadow-sm"
                    onClick={exportarPDF}
                >
                    📊 Generar y Exportar Reporte PDF Actualizado
                </button>
            </div>

            {/* Requisito: Gráfico estadístico */}
            <h2 className="mb-4" style={{ color: '#ff7b00' }}>
                Resumen Operativo del Sistema
            </h2>

            <div className="row">
                <div className="col-md-3 mb-3">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h2 style={{ color: '#ff7b00', fontWeight: 'bold' }}>
                                {productos.length}
                            </h2>
                            <p className="mb-0 text-light fw-semibold">
                                Productos en Inventario
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h2 style={{ color: '#ff7b00', fontWeight: 'bold' }}>
                                {clientes.length}
                            </h2>
                            <p className="mb-0 text-light fw-semibold">
                                Clientes Registrados
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h2 style={{ color: '#ff7b00', fontWeight: 'bold' }}>
                                {mantenimientos.length}
                            </h2>
                            <p className="mb-0 text-light fw-semibold">
                                Órdenes de Mantenimiento
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h2 style={{ color: '#ff7b00', fontWeight: 'bold' }}>
                                {ventas.length}
                            </h2>
                            <p className="mb-0 text-light fw-semibold">
                                Transacciones de Ventas
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Requisito: Gráfico estadístico */}
            <div className="row mt-4">
                <div className="col-md-8 mx-auto">
                    <div className="card p-4 shadow-sm">
                        <h3 className="text-center mb-4" style={{ color: '#ff7b00' }}>
                            Comparativa de Registros en Base de Datos
                        </h3>
                        <Bar data={datosGrafico} options={opcionesGrafico} />
                    </div>
                </div>
            </div>

            {/*ESTRUCTURA DEL DOCUMENTO PDF REAL VINCULADO AL ESTADO DE REACT */}
            <div style={{ display: 'none' }}>
                <div
                    ref={documentoPdfRef}
                    style={{
                        color: '#222222',
                        fontFamily: 'Arial, sans-serif',
                        padding: '30px',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <div style={{ textAlign: 'center', borderBottom: '3px solid #ff7b00', paddingBottom: '15px', marginBottom: '25px' }}>
                        <h1 style={{ color: '#ff7b00', margin: '0 0 5px 0', fontSize: '26px', fontWeight: 'bold' }}>TECHSTORE - REPORTE DE GERENCIA</h1>
                        <p style={{ color: '#666666', margin: '0', fontSize: '14px' }}>Informe de Auditoría y Estado Operativo del Sistema Nnativo MySQL</p>
                        <p style={{ color: '#999999', margin: '5px 0 0 0', fontSize: '12px' }}>Fecha de Emisión: {new Date().toLocaleString()}</p>
                    </div>

                    <h2 style={{ color: '#ff7b00', fontSize: '18px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>1. Resumen Ejecutivo Cuantitativo</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', marginBottom: '30px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                                <th style={{ padding: '10px', border: '1px solid #dddddd', color: '#333' }}>Módulo del Sistema</th>
                                <th style={{ padding: '10px', border: '1px solid #dddddd', color: '#333', textAlign: 'center' }}>Cantidad Mapeada en DB</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '10px', border: '1px solid #dddddd' }}>Artículos y Stock Tecnológico en Inventario</td>
                                <td style={{ padding: '10px', border: '1px solid #dddddd', textAlign: 'center', fontWeight: 'bold' }}>{productos.length} Unidades</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', border: '1px solid #dddddd' }}>Clientes Activos Afiliados</td>
                                <td style={{ padding: '10px', border: '1px solid #dddddd', textAlign: 'center', fontWeight: 'bold' }}>{clientes.length} Registros</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', border: '1px solid #dddddd' }}>Fichas de Soporte Técnico (Órdenes Activas)</td>
                                <td style={{ padding: '10px', border: '1px solid #dddddd', textAlign: 'center', fontWeight: 'bold' }}>{mantenimientos.length} Órdenes</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', border: '1px solid #dddddd' }}>Cierre Contable - Ventas Registradas</td>
                                <td style={{ padding: '10px', border: '1px solid #dddddd', textAlign: 'center', fontWeight: 'bold' }}>{ventas.length} Transacciones</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2 style={{ color: '#ff7b00', fontSize: '18px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>2. Desempeño Financiero Estimado</h2>
                    <div style={{ backgroundColor: '#fff2e6', borderLeft: '5px solid #ff7b00', padding: '15px', marginTop: '15px', marginBottom: '30px', borderRadius: '4px' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#555' }}>Monto bruto consolidado de transacciones comerciales:</p>
                        <h2 style={{ margin: '0', color: '#d46600', fontSize: '24px', fontWeight: 'bold' }}>Bs. {totalVendido.toFixed(2)} BOLIVIANOS</h2>
                    </div>

                    <h2 style={{ color: '#ff7b00', fontSize: '18px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>3. Desglose Detallado de Órdenes de Mantenimiento Activas</h2>
                    {mantenimientos.length === 0 ? (
                        <p style={{ italic: 'true', color: '#777', marginTop: '10px' }}>No se registran órdenes vigentes en este periodo.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#ff7b00', color: '#ffffff', textAlign: 'left' }}>
                                    <th style={{ padding: '8px', fontSize: '13px' }}>Cliente</th>
                                    <th style={{ padding: '8px', fontSize: '13px' }}>Equipo Técnico</th>
                                    <th style={{ padding: '8px', fontSize: '13px', textAlign: 'center' }}>Estado</th>
                                    <th style={{ padding: '8px', fontSize: '13px', textAlign: 'right' }}>Costo Técnico</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mantenimientos.map((m, idx) => (
                                    <tr key={m.id || m._id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '12px', fontWeight: 'bold' }}>{m.cliente}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '12px' }}>{m.equipo}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '12px', textAlign: 'center' }}>{m.estado}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '12px', textAlign: 'right' }}>Bs. {Number(m.costo || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '11px', color: '#aaaaaa', borderTop: '1px dashed #cccccc', paddingTop: '10px' }}>
                        Este documento digital es un reporte oficial extraído directamente desde el motor relacional MySQL de la plataforma TechStore.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardStats