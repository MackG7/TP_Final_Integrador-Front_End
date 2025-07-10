import { useState, useContext } from 'react'
import { MessengerContext } from '../Context/MessengerContext'
import './MessageInput.css'

function MessageInput({ contactId }) {
    const [text, setText] = useState('')
    const { sendMessage } = useContext(MessengerContext)

    const handleSend = () => {
        if (text.trim() === '') return
        sendMessage(contactId, text)
        setText('')
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend()
    }

    return (
        <div className="message-input-container">
            <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Escribe un mensaje..."
                className="message-input"
            />
            <button onClick={handleSend} className="send-button">Enviar</button>
        </div>
    )
}

export default MessageInput

