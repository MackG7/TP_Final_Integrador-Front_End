import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { MessengerContext } from '../src/Context/MessengerContext.jsx'

// Importar componentes
import LoginScreen from '../src/Screens/LoginScreen/LoginScreen.jsx'
import RegisterScreen from '../src/Screens/RegisterScreen/RegisterScreen.jsx'
import HomeScreen from '../src/Components/HomeScreen/HomeScreen.jsx'
import CreateGroupScreen from '../src/Components/CreateGroup/CreateGroup.jsx'
import GroupsScreen from "./Screens/GroupScreen/GroupsScreen.jsx"
import GroupPageScreen from './Screens/GroupScreen/GroupPageScreen.jsx'
import ContactDetail from '../src/ContactDetail/ContactDetail.jsx'

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(MessengerContext)

  if (loading) return <div>Cargando...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* Rutas protegidas */}
        <Route path="/home" element={
          <ProtectedRoute>
            <HomeScreen />
          </ProtectedRoute>
        } />

        <Route path="/home" element={
          <ProtectedRoute>
            <GroupsScreen />
          </ProtectedRoute>
        } />

        <Route path="/create-group" element={
          <ProtectedRoute>
            <CreateGroupScreen />
          </ProtectedRoute>
        } />
        <Route path="/chat/:id" element={
          <ProtectedRoute>
            <GroupPageScreen />
          </ProtectedRoute>
        } />

        <Route
          path="/chat/contact/:id"
          element={
            <ProtectedRoute>
              <ContactDetail /> 
            </ProtectedRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Ruta 404 */}
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </div>
  )
}

export default App









