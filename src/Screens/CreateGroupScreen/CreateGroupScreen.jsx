import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessengerContext } from '../../Context/MessengerContext/MessengerContext.jsx';
import './CreateGroupScreen.css';

const CreateGroupScreen = () => {
    const navigate = useNavigate();
    const { createGroup, authLoading, error, clearError } = useContext(MessengerContext);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        url_img: ''
    });
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleCreateGroup = async () => {
    const newGroup = await createGroup(data); // API que devuelve el grupo creado
        setGroups(prev => [...prev, newGroup]);
        navigate(`/chat/${newGroup._id}`); // redirige automáticamente al grupo
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar errores al escribir
        if (error || localError) {
            clearError();
            setLocalError('');
        }
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setLocalError('El nombre del grupo es requerido');
            return false;
        }

        if (formData.name.length < 3) {
            setLocalError('El nombre debe tener al menos 3 caracteres');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');
        clearError();

        if (!validateForm()) {
            return;
        }

        try {
            const result = await createGroup(formData);

            if (result?.success) {
                setSuccessMessage('¡Grupo creado exitosamente!');
                
                // Redirigir al grupo después de 2 segundos
                setTimeout(() => {
                    navigate('/groups');
                }, 2000);
            } else {
                setLocalError(result?.error || 'Error al crear el grupo');
            }
        } catch (err) {
            setLocalError(err.message || 'Error de conexión');
        }
    };

    const handleCancel = () => {
        navigate('/groups');
    };

    return (
        <div className="create-group-container">
            <div className="create-group-card">
                <div className="create-group-header">
                    <h1>Crear Nuevo Grupo</h1>
                    <p>Crea un grupo para chatear con tus contactos</p>
                </div>

                {/* Mensajes de estado */}
                {successMessage && (
                    <div className="success-message">
                        ✅ {successMessage}
                    </div>
                )}

                {(error || localError) && (
                    <div className="error-message">
                        ❌ {error || localError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="create-group-form">
                    <div className="form-group">
                        <label htmlFor="name">Nombre del Grupo *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Ej: Familia, Amigos del Trabajo, etc."
                            required
                            disabled={authLoading}
                            maxLength={50}
                        />
                        <span className="char-count">{formData.name.length}/50</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descripción (Opcional)</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe el propósito de este grupo..."
                            rows="3"
                            disabled={authLoading}
                            maxLength={200}
                        />
                        <span className="char-count">{formData.description.length}/200</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="url_img">URL de Imagen (Opcional)</label>
                        <input
                            type="url"
                            id="url_img"
                            name="url_img"
                            value={formData.url_img}
                            onChange={handleInputChange}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            disabled={authLoading}
                        />
                        <small className="helper-text">
                            Enlace a una imagen para el avatar del grupo
                        </small>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="cancel-button"
                            disabled={authLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={authLoading || !formData.name.trim()}
                            className="create-button"
                        >
                            {authLoading ? (
                                <>
                                    <div className="button-spinner"></div>
                                    Creando Grupo...
                                </>
                            ) : (
                                'Crear Grupo'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupScreen;