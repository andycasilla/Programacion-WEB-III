import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Captcha from '../components/Captcha'

function Registro() {
    const navigate = useNavigate()
    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [password, setPassword] = useState('')
    const [rol, setRol] = useState('empleado') // Rol por defecto
    const [captchaOk, setCaptchaOk] = useState(false)

    // NUEVOS ESTADOS: Para controlar el nivel de seguridad visual de la contraseña
    const [seguridad, setSeguridad] = useState('')
    const [colorSeguridad, setColorSeguridad] = useState('')

    // NUEVA FUNCIÓN: Evalúa la robustez del texto ingresado paso a paso
    function evaluarContraseña(valor) {
        setPassword(valor)

        if (valor.length === 0) {
            setSeguridad('')
            return
        }

        const tieneNumeros = /\d/.test(valor)
        const tieneMayusculas = /[A-Z]/.test(valor)
        const tieneEspeciales = /[!@#$%^&*(),.?":{}|<>]/.test(valor)

        // Criterio 1: Fuerte (Más de 8 caracteres con números, mayúsculas y símbolos)
        if (valor.length >= 8 && tieneNumeros && tieneMayusculas && tieneEspeciales) {
            setSeguridad('Fuerte')
            setColorSeguridad('#198754') // Verde
        } 
        // Criterio 2: Media (Más de 6 caracteres con números o mayúsculas)
        else if (valor.length >= 6 && (tieneNumeros || tieneMayusculas)) {
            setSeguridad('Media')
            setColorSeguridad('#ffc107') // Amarillo
        } 
        // Criterio 3: Débil (Texto corto o plano)
        else {
            setSeguridad('Débil...')
            setColorSeguridad('#dc3545') // Rojo
        }
    }

    async function registrarUsuario(e) {
        e.preventDefault()

        if (!captchaOk) {
            alert('Primero verifica el CAPTCHA')
            return
        }

        try {
            const respuesta = await fetch('http://localhost:3000/usuarios/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, correo, password, rol })
            })

            const data = await respuesta.json()

            if (respuesta.ok) {
                alert('¡Usuario registrado con éxito!')
                navigate('/')
            } else {
                alert(data.mensaje || 'Error al registrar el usuario')
            }
        } catch (error) {
            console.error('Error en el registro:', error)
            alert('No se pudo conectar con el servidor.')
        }
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '450px' }}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="text-center mb-4">Crear Cuenta</h2>
                    
                    <form onSubmit={registrarUsuario}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre Completo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Correo Electrónico"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />
                        </div>

                        {/* SECCIÓN MODIFICADA: Ahora evalúa e imprime la robustez en pantalla */}
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => evaluarContraseña(e.target.value)} // <-- Cambiado aquí
                                required
                            />
                            {seguridad && (
                                <div className="mt-1 small fw-bold" style={{ fontSize: '13px' }}>
                                    Seguridad: <span style={{ color: colorSeguridad }}>{seguridad}</span>
                                </div>
                            )}
                        </div>

                        {/* Selección de Rol con tu diseño Cyberpunk */}
                        <div className="mb-3">
                            <label className="form-label text-muted small mb-1">Selecciona tu Rol de Acceso:</label>
                            <select 
                                className="form-control"
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                            >
                                <option value="empleado"> Empleado / Técnico</option>
                                <option value="administrador"> Administrador</option>
                                <option value="gerente"> Gerente de Tienda</option>
                            </select>
                        </div>

                        <div className="p-2 border rounded bg-light mb-3">
                            <Captcha onValidate={setCaptchaOk} />
                        </div>

                        <button
                            className={`btn w-100 mt-2 ${captchaOk ? 'btn-primary' : 'btn-secondary'}`}
                            type="submit"
                            disabled={!captchaOk}
                        >
                            {captchaOk ? 'Registrar Cuenta' : ' Verifica el CAPTCHA'}
                        </button>

                        <div className="text-center mt-4">
                            <p className="mb-1 text-muted">¿Ya tienes una cuenta?</p>
                            <a href="/" className="btn btn-outline-success btn-sm">
                                Iniciar Sesión
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Registro