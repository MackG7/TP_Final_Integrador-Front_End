import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../styles/global.css'
import { MessengerProvider } from '../Context/MessengerContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MessengerProvider>
      <App />
    </MessengerProvider>
  </React.StrictMode>
)



