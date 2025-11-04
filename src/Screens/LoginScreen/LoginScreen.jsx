import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessengerContext } from '../../Context/MessengerContext/MessengerContext.jsx'
import './LoginScreen.css'

const FORM_FIELDS = {
    EMAIL: 'email',
    PASSWORD: 'password'
}

const initial_form_state = {
    [FORM_FIELDS.EMAIL]: '',
    [FORM_FIELDS.PASSWORD]: ''
}

export const LoginScreen = () => {
    const navigate = useNavigate()
    const { login, authLoading, error, clearError, isAuthenticated } = useContext(MessengerContext)

    const [form_state, setFormState] = React.useState(initial_form_state)
    const [localError, setLocalError] = React.useState('')

    // 🔄 Efecto para redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home', { replace: true })
        }
    }, [isAuthenticated, navigate])

    // 🔄 Limpiar errores automáticamente
    useEffect(() => {
        if (error || localError) {
            const timer = setTimeout(() => {
                clearError()
                setLocalError('')
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [error, localError, clearError])

    // 🎯 Manejar cambios en los inputs
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }))

        // Limpiar errores cuando el usuario escribe
        if (error || localError) {
            clearError()
            setLocalError('')
        }
    }

    // 🎯 Validaciones del formulario
    const validateForm = () => {
        if (!form_state[FORM_FIELDS.EMAIL] || !form_state[FORM_FIELDS.PASSWORD]) {
            setLocalError('Por favor completa todos los campos')
            return false
        }

        if (!/\S+@\S+\.\S+/.test(form_state[FORM_FIELDS.EMAIL])) {
            setLocalError('Por favor ingresa un email válido')
            return false
        }

        if (form_state[FORM_FIELDS.PASSWORD].length < 6) {
            setLocalError('La contraseña debe tener al menos 6 caracteres')
            return false
        }

        return true
    }

    // 🚀 Manejar envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault()
        setLocalError('')
        clearError()

        if (!validateForm()) {
            return
        }

        try {
            const result = await login(
                form_state[FORM_FIELDS.EMAIL],
                form_state[FORM_FIELDS.PASSWORD]
            )

            if (result?.success) {
                // La navegación se manejará automáticamente por el contexto
                console.log('✅ Login exitoso, redirigiendo...')
            } else {
                setLocalError(result?.error || 'Error al iniciar sesión')
            }
        } catch (err) {
            setLocalError(err.message || 'Error de conexión')
        }
    }

    // 🔄 Ir al registro
    const handleGoToRegister = () => {
        navigate('/register')
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Iniciar Sesión</h1>
                <p className="login-subtitle">Bienvenido de vuelta</p>

                {/* Mensajes de error */}
                {(error || localError) && (
                    <div className="error-message">
                        ❌ {error || localError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor={FORM_FIELDS.EMAIL}>Email:</label>
                        <input
                            name={FORM_FIELDS.EMAIL}
                            id={FORM_FIELDS.EMAIL}
                            type="email"
                            value={form_state[FORM_FIELDS.EMAIL]}
                            onChange={handleInputChange}
                            placeholder="tu@email.com"
                            required
                            disabled={authLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor={FORM_FIELDS.PASSWORD}>Contraseña:</label>
                        <input
                            name={FORM_FIELDS.PASSWORD}
                            id={FORM_FIELDS.PASSWORD}
                            type="password"
                            value={form_state[FORM_FIELDS.PASSWORD]}
                            onChange={handleInputChange}
                            placeholder="Tu contraseña"
                            required
                            disabled={authLoading}
                        />
                    </div>

                    {/* Estado del botón */}
                    {!isAuthenticated ? (
                        <button 
                            type="submit" 
                            disabled={authLoading}
                            className="login-button"
                        >
                            {authLoading ? (
                                <>
                                    <div className="button-spinner"></div>
                                    Iniciando sesión...
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    ) : (
                        <>
                            <button type="submit" disabled={true} className="login-button success">
                                Sesión Iniciada ✅
                            </button>
                            <span style={{ color: 'green', textAlign: 'center', display: 'block', marginTop: '10px' }}>
                                Redirigiendo...
                            </span>
                        </>
                    )}
                </form>

                <div className="register-link">
                    <p>¿No tienes cuenta?</p>
                    <button
                        type="button"
                        onClick={handleGoToRegister}
                        className="link-button"
                        disabled={authLoading}
                    >
                        Regístrate aquí
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen