import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'  
import '../styles/global.css' 
import { BrowserRouter } from 'react-router-dom'; 
import { MessengerProvider } from './Context/providers/MessengerProvider.jsx' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MessengerProvider>
        <App />  {/* ← App directamente, no dentro de Routes */}
      </MessengerProvider>
    </BrowserRouter>
  </React.StrictMode>
)


