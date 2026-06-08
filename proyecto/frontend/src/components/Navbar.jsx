import { useNavigate } from 'react-router-dom'
// Requisito: Frontend en React
// Requisito: Menú principal del sistema
// Requisito: Navegación entre módulos
// Requisito: Gestión de productos
// Requisito: Gestión de clientes
// Requisito: Gestión de mantenimientos
// Requisito: Gestión de ventas
// Requisito: Logout de usuarios
// Requisito: Autenticación de usuarios
//Objetivo del sistema (Venta de computadoras y mantenimiento de PCs)
function Navbar({ seccionActiva, cambiarSeccion }) {
    const navigate = useNavigate()

    async function cerrarSesion() {

    try {

        const usuario = JSON.parse(
            localStorage.getItem('usuario')
        )

        if(usuario){

            await fetch(
                'http://localhost:3000/logs',
                {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        usuario:usuario.nombre,
                        evento:'Salida',
                        browser:navigator.userAgent
                    })
                }
            )

        }

    } catch(error){

        console.error(
            'Error al registrar salida:',
            error
        )

    }

    localStorage.removeItem('usuario')
    localStorage.removeItem('rol')
    localStorage.removeItem('token')

    navigate('/')

}

    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg shadow-sm">
            <div className="container">
                <a 
                    className="navbar-brand fw-bold" 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); cambiarSeccion('stats'); }}
                >
                    TechStore
                </a>

                <div className="navbar-nav me-auto">
                    <button 
                        className={`nav-link btn border-0 bg-transparent ${seccionActiva === 'productos' ? 'active' : ''}`}
                        onClick={() => cambiarSeccion('productos')}
                    >
                        Productos
                    </button>
                    
                    <button 
                        className={`nav-link btn border-0 bg-transparent ${seccionActiva === 'clientes' ? 'active' : ''}`}
                        onClick={() => cambiarSeccion('clientes')}
                    >
                        Clientes
                    </button>
                    
                    <button 
                        className={`nav-link btn border-0 bg-transparent ${seccionActiva === 'mantenimientos' ? 'active' : ''}`}
                        onClick={() => cambiarSeccion('mantenimientos')}
                    >
                        Mantenimientos
                    </button>
                    
                    <button 
                        className={`nav-link btn border-0 bg-transparent ${seccionActiva === 'ventas' ? 'active' : ''}`}
                        onClick={() => cambiarSeccion('ventas')}
                    >
                        Ventas
                    </button>
                </div>

                <div className="d-flex">
                    <button 
                        className="btn btn-outline-danger btn-sm fw-bold" 
                        onClick={cerrarSesion}
                        type="button"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar