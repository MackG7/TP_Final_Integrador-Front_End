import './Message.css'

function Message({ message, isOwn }) {
    return (
        <div className={`message ${isOwn ? 'own-message' : 'other-message'}`}>
            <div className="message-content">
                <p>{message.texto}</p>
                <div className="message-meta">
                    <span className="message-time">{message.hora}</span>
                    {isOwn && (
                        <span className={`message-status ${message.status}`}>
                            {message.status === 'visto' ? '✓✓' : '✓'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Message