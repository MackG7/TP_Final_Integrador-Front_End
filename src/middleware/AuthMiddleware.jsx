import React, { useEffect, useState, useContext } from 'react'
import LOCALSTORAGE_KEYS from '../constants/LocalStorage.js'
import { Navigate, Outlet } from 'react-router-dom'
import { MessengerContext } from '../Context/MessengerContext.jsx'
import './AuthMiddleware.css'

const AuthMiddleware = () => {
    const [isValidToken, setIsValidToken] = useState(null)
    const [loading, setLoading] = useState(true)
    const { setUser, logout } = useContext(MessengerContext) // ✅ Añadir logout del contexto

    // Función para verificar el token con el servidor
    const verifyTokenWithServer = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                
                // Actualizar el usuario en el contexto
                if (data.user && setUser) {
                    setUser(data.user)
                    // Actualizar también localStorage por si hay cambios
                    localStorage.setItem(LOCALSTORAGE_KEYS.USER_DATA, JSON.stringify(data.user))
                }
                
                return true
            } else {
                console.log('❌ Token inválido en el servidor')
                return false
            }
        } catch (error) {
            console.error('Error verificando token con servidor:', error)
            return false
        }
    }

    // Función para verificar token localmente (como fallback)
    const verifyTokenLocally = (token) => {
        if (!token) return false
        
        try {
            const parts = token.split('.')
            if (parts.length !== 3) return false
            
            const payload = JSON.parse(atob(parts[1]))
            const currentTime = Date.now() / 1000
            
            // Verificar expiración
            if (payload.exp && payload.exp < currentTime) {
                console.log('❌ Token expirado localmente')
                return false
            }
            
            return true
        } catch (error) {
            console.error('Error en verificación local:', error)
            return false
        }
    }

    // Función para limpiar datos de autenticación
    const clearAuthData = () => {
        localStorage.removeItem(LOCALSTORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(LOCALSTORAGE_KEYS.USER_DATA)
        if (logout) {
            logout() // ✅ Usar logout del contexto si está disponible
        }
    }

    useEffect(() => {
        const checkAuthentication = async () => {
            const auth_token = localStorage.getItem(LOCALSTORAGE_KEYS.AUTH_TOKEN)
            
            if (!auth_token) {
                setIsValidToken(false)
                setLoading(false)
                return
            }

            try {
                // Primero intentar verificar con el servidor
                const serverValid = await verifyTokenWithServer(auth_token)
                
                if (serverValid) {
                    setIsValidToken(true)
                } else {
                    // Si falla la verificación con servidor, intentar verificación local
                    const localValid = verifyTokenLocally(auth_token)
                    
                    if (localValid) {
                        console.log('⚠️ Usando verificación local (servidor no disponible)')
                        setIsValidToken(true)
                        
                        // Intentar recuperar usuario desde localStorage
                        try {
                            const userData = localStorage.getItem(LOCALSTORAGE_KEYS.USER_DATA)
                            if (userData && setUser) {
                                setUser(JSON.parse(userData))
                            }
                        } catch (error) {
                            console.error('Error recuperando usuario:', error)
                        }
                    } else {
                        setIsValidToken(false)
                        clearAuthData()
                    }
                }
            } catch (error) {
                console.error('Error en checkAuthentication:', error)
                setIsValidToken(false)
                clearAuthData()
            } finally {
                setLoading(false)
            }
        }

        checkAuthentication()
    }, [setUser, logout]) // ✅ Añadir logout como dependencia

    // Mostrar loading mientras verificamos
    if (loading) {
        return (
            <div className="auth-loading-container">
                <div className="auth-loading-spinner"></div>
                <p className="auth-loading-text">Verificando autenticación...</p>
            </div>
        )
    }

    // Si el token es válido, mostrar las rutas protegidas
    if (isValidToken) {
        return <Outlet />
    }
    
    // Si no hay token válido, redirigir al login
    return <Navigate to="/login" replace />
}

export default AuthMiddleware