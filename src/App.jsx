import { BrowserRouter, Routes, Route } from 'react-router'
import { MessengerProvider } from '../Context/MessengerContext'
import ContactDetail from '../ContactDetail/ContactDetail'
import ContactInfo from '../ContactInfo/ContactInfo'
import Home from '../Components/Home/Home'
import Chat from '../Components/Chat/Chat'

function App() {
  return (
    <MessengerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" 
          element={<Home />} />

          <Route path="/chat/:contactId" 
          element={<Chat />} />

          <Route path="/contact/:contactId" 
          element={<ContactDetail />} />

          <Route path="/contactInfo/:contactId" 
          element={<ContactInfo />} />
          
        </Routes>
      </BrowserRouter>
    </MessengerProvider>
  )
}

export default App










