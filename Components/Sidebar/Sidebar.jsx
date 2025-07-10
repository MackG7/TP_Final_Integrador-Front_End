import { useContext } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { MessengerContext } from '../../Context/MessengerContext'
import ContactList from '../ContactList/ContactList'
import '../Sidebar/Sidebar.css'
import { BsFilter } from "react-icons/bs";
import { PiNotePencilLight } from "react-icons/pi";

function Sidebar() {
    const { contacts, setActiveContact } = useContext(MessengerContext)
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('');

    const handleContactClick = (contact) => {
        navigate(`/chat/${contact.id}`)
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    return (

        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Wsp-messenger </h2>
                <div className='wspIcons'>
                    <div><PiNotePencilLight size={25} /> </div>
                    <div><BsFilter size={25} /> </div>
                </div>
            </div>
            <ContactList contacts={contacts} onContactClick={handleContactClick} />
        </div>
    )
}

export default Sidebar

