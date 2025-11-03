import './Message.css'

function Message({ message, isOwn, isGroupChat }) {
    return (
        <div className={`message ${isOwn ? 'own-message' : 'other-message'}`}>
            <div className="message-content">
                {/* 🔹 En grupos, mostrar el nombre del emisor si no soy yo */}
                {!isOwn && isGroupChat && (
                    <p className="message-sender">{message.emisor}</p>
                )}

                <p className="message-text">{message.texto}</p>

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