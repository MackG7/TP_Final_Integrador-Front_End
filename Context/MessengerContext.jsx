import { createContext, useState } from 'react'
import messenger_data from '../Components/Data/messenger_data'

export const MessengerContext = createContext()

export const MessengerProvider = ({ children }) => {
    const [contacts, setContacts] = useState(messenger_data.contacts || [])

    const sendMessage = (contactId, texto) => {
        setContacts(prevContacts =>
            prevContacts.map(contact => {
                if (contact.id === contactId) {
                    const newMessage = {
                        id: contact.messages.length + 1,
                        emisor: 'YO',
                        texto,
                        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        status: 'no-visto'
                    }

                    return {
                        ...contact,
                        last_message: newMessage,
                        messages: [...contact.messages, newMessage]
                    }
                }
                return contact
            })
        )
    }



    const markAsRead = (contactId) => {
        setContacts(prevContacts =>
            prevContacts.map(contact => {
                if (contact.id === contactId) {
                    return { ...contact, unread_messages: 0 }
                }
                return contact
            })
        )
    }

    return (
        <MessengerContext.Provider value={{ contacts, sendMessage, markAsRead }}>
            {children}
        </MessengerContext.Provider>
    )
}






