import { useEffect, useRef, useState } from 'react'
// Requisito: Frontend en React
// Requisito: CAPTCHA para ingreso al sistema
// Requisito: Seguridad en la autenticación
// Requisito: Validación previa al Login
function Captcha({ onValidate }) {
    const canvasRef = useRef(null)
    const captchaTextRef = useRef('') // Guarda el texto generado del CAPTCHA
    const [userInput, setUserInput] = useState('')

    function inicializarCaptcha() {
        const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
        let texto = ''

        for (let i = 0; i < 6; i++) {
            texto += caracteres.charAt(
                Math.floor(Math.random() * caracteres.length)
            )
        }

        captchaTextRef.current = texto

        const canvas = canvasRef.current

        if (canvas) {
            const ctx = canvas.getContext('2d')

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Fondo del CAPTCHA
            ctx.fillStyle = '#d7f0f0'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Líneas de distorsión
            for (let i = 0; i < 4; i++) {
                ctx.strokeStyle = 'rgba(0, 0, 128, 0.2)'
                ctx.beginPath()
                ctx.moveTo(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height
                )
                ctx.lineTo(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height
                )
                ctx.stroke()
            }

            // Letras del CAPTCHA
            for (let i = 0; i < texto.length; i++) {
                ctx.save()

                ctx.font = 'bold 32px Arial'
                ctx.fillStyle = 'navy'

                ctx.translate(25 + i * 24, 48)
                ctx.rotate((Math.random() - 0.5) * 0.4)

                ctx.fillText(texto[i], 0, 0)

                ctx.restore()
            }
        }
    }

    useEffect(() => {
        inicializarCaptcha()
    }, [])

    function verificar() {
        const ingresado = userInput.trim().toUpperCase()

        const correcto =
            ingresado === captchaTextRef.current

        onValidate(correcto)

        if (correcto) {
            alert('CAPTCHA verificado con éxito')
        } else {
            alert('CAPTCHA incorrecto, intenta de nuevo')

            inicializarCaptcha()

            setUserInput('')
        }
    }

    return (
        <div className="text-center">
            <canvas
                ref={canvasRef}
                width={200}
                height={70}
                className="border mb-3 rounded shadow-sm"
            />

            <div className="d-flex gap-2 mb-2">
                <input
                    className="form-control"
                    placeholder="Escribe el CAPTCHA"
                    value={userInput}
                    onChange={(e) =>
                        setUserInput(e.target.value)
                    }
                />

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={inicializarCaptcha}
                    title="Cambiar CAPTCHA"
                >
                    🔄
                </button>
            </div>

            <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={verificar}
            >
                Verificar CAPTCHA
            </button>
        </div>
    )
}

export default Captcha