import { useState } from 'react' // Requisito: Frontend en React

import Navbar from './components/Navbar' // Requisito: Menú de navegación
import DashboardStats from './DashboardStats' // Requisito: Gráfico estadístico y reporte PDF
import Productos from './Productos' // Requisito: CRUD de productos
import Clientes from './Clientes' // Requisito: CRUD de clientes
import Mantenimientos from './Mantenimientos' // Requisito: CRUD de mantenimientos
import Ventas from './Ventas' // Requisito: CRUD de ventas

function Dashboard() {

    const [seccion, setSeccion] = useState('stats') // Requisito: Navegación entre módulos

    const usuarioGuardado = localStorage.getItem('usuario') // Requisito: Autenticación de usuarios
    const usuario = usuarioGuardado
        ? JSON.parse(usuarioGuardado)
        : { nombre: 'Invitado' }

    const rol = localStorage.getItem('rol') || 'Sin Rol' // Requisito: Roles y permisos

    return (
        <>
            <Navbar
                seccionActiva={seccion}
                cambiarSeccion={setSeccion}
            />

            <div className="container mt-4">

                {/* Caja de estado del sistema con colores legibles sobre el fondo oscuro */}
                <div className="alert alert-info shadow-sm d-flex justify-content-between align-items-center animate__animated animate__fadeInDown" style={{ backgroundColor: '#1a2332', borderColor: '#ff7b00' }}>
                    <div>
                        <h5 className="mb-1" style={{ color: '#ffffff' }}>
                            <b>Usuario:</b> {usuario.nombre}
                        </h5>

                        <h6 className="mb-0" style={{ color: '#d6d6d6' }}>
                            <b>Rol:</b> {rol}
                        </h6>
                    </div>

                    {seccion !== 'stats' && (
                        <button
                            className="btn btn-sm btn-orange fw-bold"
                            onClick={() => setSeccion('stats')}
                        >
                            Volver al Inicio
                        </button>
                    )}

                </div>

                {/* Requisito: Menú principal del sistema */}
                {/* Requisito: Gráfico estadístico */}
                {/* Requisito: Reporte PDF */}
                {seccion === 'stats' && (
                    <div className="animate__animated animate__fadeInLeft">
                        <h1 className="text-center mb-4 fw-bold" style={{ color: '#ff7b00' }}>
                            TechStore Admin
                        </h1>

                        <DashboardStats />
                    </div>
                )}

                {/* Requisito: CRUD de productos */}
                {seccion === 'productos' && (
                    <div className="animate__animated animate__fadeInLeft">
                        <Productos />
                    </div>
                )}

                {/* Requisito: CRUD de clientes */}
                {seccion === 'clientes' && (
                    <div className="animate__animated animate__fadeInLeft">
                        <Clientes />
                    </div>
                )}

                {/* Requisito: CRUD de mantenimientos */}
                {seccion === 'mantenimientos' && (
                    <div className="animate__animated animate__fadeInLeft">
                        <Mantenimientos />
                    </div>
                )}

                {/* Requisito: CRUD de ventas */}
                {seccion === 'ventas' && (
                    <div className="animate__animated animate__fadeInLeft">
                        <Ventas />
                    </div>
                )}

            </div>
        </>
    )
}

export default Dashboard