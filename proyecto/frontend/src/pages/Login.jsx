import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Captcha from '../components/Captcha'

function Login() {

    const navigate = useNavigate()

    const [correo, setCorreo] = useState('')
    const [password, setPassword] = useState('')
    const [captchaOk, setCaptchaOk] = useState(false)

    async function iniciarSesion(e) {

        e.preventDefault()

        if (!captchaOk) {
            alert('Primero verifica el CAPTCHA')
            return
        }

        try {

            const respuesta = await fetch(
                'http://localhost:3000/usuarios/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo,
                        password
                    })
                }
            )

            const data = await respuesta.json()

            if (respuesta.ok) {

                const infoUsuario =
                    data.usuario ||
                    data.user ||
                    {
                        nombre: correo,
                        rol: 'empleado'
                    }

                const rolUsuario =
                    data.usuario?.rol ||
                    data.user?.rol ||
                    data.rol ||
                    'empleado'

                localStorage.setItem(
                    'usuario',
                    JSON.stringify(infoUsuario)
                )

                localStorage.setItem(
                    'rol',
                    rolUsuario
                )

                if (data.token) {
                    localStorage.setItem(
                        'token',
                        data.token
                    )
                }

                // REGISTRO DEL LOG DE INGRESO
                await fetch(
                    'http://localhost:3000/logs',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            usuario: infoUsuario.nombre,
                            evento: 'Ingreso',
                            browser: navigator.userAgent
                        })
                    }
                )

                navigate('/dashboard')

            } else {

                alert(
                    data.mensaje ||
                    'Error en las credenciales de acceso'
                )

            }

        } catch (error) {

            console.error(
                'Error en la conexión:',
                error
            )

            alert(
                'No se pudo conectar con el servidor. Verifica que el Backend esté encendido.'
            )

        }

    }

    return (
        <div
            className="container mt-5"
            style={{ maxWidth: '450px' }}
        >
            <div className="card shadow">
                <div className="card-body">

                    <h2 className="text-center mb-4">
                        Iniciar Sesión
                    </h2>

                    <form onSubmit={iniciarSesion}>

                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Correo"
                                value={correo}
                                onChange={(e) =>
                                    setCorreo(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="p-2 border rounded bg-light mb-3">
                            <Captcha
                                onValidate={setCaptchaOk}
                            />
                        </div>

                        <button
                            className={`btn w-100 mt-2 ${
                                captchaOk
                                    ? 'btn-primary'
                                    : 'btn-secondary'
                            }`}
                            type="submit"
                            disabled={!captchaOk}
                        >
                            {captchaOk
                                ? 'Ingresar al Sistema'
                                : 'Verifica el CAPTCHA para desbloquear'}
                        </button>

                        <div className="text-center mt-4">

                            <p className="mb-1 text-muted">
                                ¿No tienes cuenta?
                            </p>

                            <a
                                href="/registro"
                                className="btn btn-outline-success btn-sm"
                            >
                                Registrarse
                            </a>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    )

}

export default Login