import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessengerContext } from '../../Context/MessengerContext/MessengerContext.jsx'
import './RegisterScreen.css'

const FORM_FIELDS = {
    NAME: 'name',
    EMAIL: 'email',
    PASSWORD: 'password'
}

const initial_form_state = {
    [FORM_FIELDS.NAME]: '',
    [FORM_FIELDS.EMAIL]: '',
    [FORM_FIELDS.PASSWORD]: ''
}

const RegisterScreen = () => {
    const navigate = useNavigate()
    const { register, authLoading, error, clearError, isAuthenticated } = useContext(MessengerContext)

    const [form_state, setFormState] = useState(initial_form_state)
    const [localError, setLocalError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

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
        if (!form_state[FORM_FIELDS.NAME] || !form_state[FORM_FIELDS.EMAIL] || !form_state[FORM_FIELDS.PASSWORD]) {
            setLocalError('Por favor completa todos los campos')
            return false
        }

        if (form_state[FORM_FIELDS.NAME].length < 2) {
            setLocalError('El nombre debe tener al menos 2 caracteres')
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
    setSuccessMessage('')
    clearError()

    if (!validateForm()) {
        return
    }

    try {
        // ✅ CORREGIDO: Enviar objeto con la estructura que espera el backend
        const result = await register({
            name: form_state[FORM_FIELDS.NAME],
            email: form_state[FORM_FIELDS.EMAIL],
            password: form_state[FORM_FIELDS.PASSWORD]
        })

        if (result?.success) {
            setSuccessMessage(result.message || '¡Registro exitoso! Redirigiendo...')
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: '¡Registro exitoso! Por favor inicia sesión.',
                        registeredEmail: form_state[FORM_FIELDS.EMAIL]
                    }
                })
            }, 2000)
        } else {
            setLocalError(result?.error || 'Error en el registro')
        }
    } catch (err) {
        setLocalError(err.message || 'Error de conexión')
    }
}

    // 🔄 Ir al login
    const handleGoToLogin = () => {
        navigate('/login')
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Regístrate</h1>
                <p className="register-subtitle">Crea tu cuenta</p>

                {/* Mensajes de éxito */}
                {successMessage && (
                    <div className="success-message">
                        ✅ {successMessage}
                    </div>
                )}

                {/* Mensajes de error */}
                {(error || localError) && (
                    <div className="error-message">
                        ❌ {error || localError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor={FORM_FIELDS.NAME}>Nombre:</label>
                        <input
                            name={FORM_FIELDS.NAME}
                            id={FORM_FIELDS.NAME}
                            type="text"
                            value={form_state[FORM_FIELDS.NAME]}
                            onChange={handleInputChange}
                            placeholder="Tu nombre completo"
                            required
                            disabled={authLoading}
                        />
                    </div>

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
                            placeholder="Mínimo 6 caracteres"
                            required
                            disabled={authLoading}
                        />
                    </div>

                    {/* Estado del botón */}
                    {!successMessage ? (
                        <button 
                            type="submit" 
                            disabled={authLoading}
                            className="register-button"
                        >
                            {authLoading ? (
                                <>
                                    <div className="button-spinner"></div>
                                    Registrando...
                                </>
                            ) : (
                                'Registrarse'
                            )}
                        </button>
                    ) : (
                        <>
                            <button type="submit" disabled={true} className="register-button success">
                                Registrado ✅
                            </button>
                            <span style={{ color: 'green', textAlign: 'center', display: 'block', marginTop: '10px' }}>
                                {successMessage}
                            </span>
                        </>
                    )}
                </form>

                <div className="login-link">
                    <p>¿Ya tienes cuenta?</p>
                    <button
                        type="button"
                        onClick={handleGoToLogin}
                        className="link-button"
                        disabled={authLoading}
                    >
                        Inicia sesión aquí
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegisterScreen