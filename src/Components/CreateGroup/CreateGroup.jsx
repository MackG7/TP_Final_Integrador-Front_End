import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessengerContext } from '../../Context/MessengerContext/MessengerContext.jsx';
import './CreateGroup.css';

const CreateGroupScreen = () => {
    const navigate = useNavigate();
    const { createGroup, authLoading, error, clearError } = useContext(MessengerContext);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        url_img: '',
        isPrivate: false
    });
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [touched, setTouched] = useState({
        name: false,
        description: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Marcar como tocado
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Limpiar errores al escribir
        if (error || localError) {
            clearError();
            setLocalError('');
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const validateForm = () => {
        console.log('🔍 [VALIDACIÓN] Datos del formulario:', formData);

        if (!formData.name.trim()) {
            setLocalError('El nombre del grupo es requerido');
            return false;
        }

        if (formData.name.trim().length < 3) {
            setLocalError('El nombre debe tener al menos 3 caracteres');
            return false;
        }

        if (formData.name.trim().length > 50) {
            setLocalError('El nombre no puede tener más de 50 caracteres');
            return false;
        }

        if (formData.url_img && !isValidUrl(formData.url_img)) {
            setLocalError('La URL de la imagen no es válida');
            return false;
        }

        console.log('✅ [VALIDACIÓN] Formulario válido');
        return true;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');
        clearError();

        console.log('📝 [SUBMIT] Datos del formulario:', formData);

        if (!validateForm()) {
            console.log('❌ [SUBMIT] Validación fallida');
            return;
        }

        try {
            console.log('🚀 [SUBMIT] Enviando datos al backend:', {
                name: formData.name.trim(),
                description: formData.description.trim(),
                url_img: formData.url_img.trim(),
                isPrivate: formData.isPrivate
            });

            const result = await createGroup({
                name: formData.name.trim(),
                description: formData.description.trim(),
                url_img: formData.url_img.trim(),
                isPrivate: formData.isPrivate
            });

            console.log('📨 [SUBMIT] Resultado recibido:', result);

            if (result?.success) {
                setSuccessMessage('¡Grupo creado exitosamente!');
                setFormData({
                    name: '',
                    description: '',
                    url_img: '',
                    isPrivate: false
                });
                setTouched({
                    name: false,
                    description: false
                });

                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            } else {
                console.log('❌ [SUBMIT] Error en resultado:', result?.error);
                setLocalError(result?.error || 'Error al crear el grupo');
            }
        } catch (err) {
            console.error('💥 [SUBMIT] Error inesperado:', err);
            setLocalError(err.message || 'Error de conexión');
        }
    };

    const handleCancel = () => {
        navigate('/home');
    };

    const handleClearForm = () => {
        setFormData({
            name: '',
            description: '',
            url_img: '',
            isPrivate: false
        });
        setTouched({
            name: false,
            description: false
        });
        setLocalError('');
        setSuccessMessage('');
        clearError();
    };

    // Mostrar error de campo específico
    const showFieldError = (field) => {
        return touched[field] && !formData[field].trim();
    };

    return (
        <div className="create-group-screen">
            <div className="create-group-card">
                <div className="screen-header">
                    <h1>Crear Nuevo Grupo</h1>
                    <p>Comunícate con varias personas a la vez</p>
                </div>

                {/* Mensajes de estado */}
                {successMessage && (
                    <div className="success-message">
                        <span className="success-icon">✅</span>
                        <div>
                            <strong>¡Éxito!</strong>
                            <p>{successMessage}</p>
                        </div>
                    </div>
                )}

                {(error || localError) && (
                    <div className="error-message">
                        <span className="error-icon">❌</span>
                        <div>
                            <strong>Error</strong>
                            <p>{error || localError}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="group-form">
                    {/* Nombre del Grupo */}
                    <div className="form-group">
                        <label htmlFor="name" className="required">
                            Nombre del Grupo
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('name')}
                            placeholder="Ej: Familia, Amigos del Trabajo..."
                            required
                            disabled={authLoading}
                            maxLength={50}
                            className={showFieldError('name') ? 'input-error' : (formData.name ? 'has-value' : '')}
                        />
                        {showFieldError('name') && (
                            <span className="field-error">El nombre del grupo es requerido</span>
                        )}
                        <div className="input-footer">
                            <span className="char-count">
                                {formData.name.length}/50
                            </span>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="form-group">
                        <label htmlFor="description">
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('description')}
                            placeholder="Describe el propósito de este grupo (opcional)..."
                            rows="3"
                            disabled={authLoading}
                            maxLength={200}
                            className={showFieldError('description') ? 'input-error' : ''}
                        />
                        {showFieldError('description') && (
                            <span className="field-error">La descripción no puede estar vacía</span>
                        )}
                        <div className="input-footer">
                            <span className="char-count">
                                {formData.description.length}/200
                            </span>
                        </div>
                    </div>

                    {/* URL de Imagen */}
                    <div className="form-group">
                        <label htmlFor="url_img">
                            Imagen del Grupo (URL)
                        </label>
                        <input
                            type="url"
                            id="url_img"
                            name="url_img"
                            value={formData.url_img}
                            onChange={handleInputChange}
                            placeholder="https://ejemplo.com/imagen-grupo.jpg"
                            disabled={authLoading}
                        />
                        <div className="input-footer">
                            <small className="helper-text">
                                Enlace a una imagen para el avatar del grupo
                            </small>
                        </div>
                    </div>

                    {/* Previsualización de imagen */}
                    {formData.url_img && isValidUrl(formData.url_img) && (
                        <div className="image-preview">
                            <label>Vista previa:</label>
                            <div className="preview-container">
                                <img
                                    src={formData.url_img}
                                    alt="Vista previa"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Configuración de privacidad */}
                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="isPrivate"
                                checked={formData.isPrivate}
                                onChange={handleInputChange}
                                disabled={authLoading}
                            />
                            <span className="checkmark"></span>
                            Grupo privado
                        </label>
                        <small className="helper-text">
                            Los grupos privados requieren invitación para unirse
                        </small>
                    </div>

                    {/* Acciones del formulario */}
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleClearForm}
                            className="secondary-button"
                            disabled={authLoading}
                        >
                            Limpiar
                        </button>
                        <div className="primary-actions">
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
                                className="submit-button"
                            >
                                {authLoading ? (
                                    <>
                                        <div className="button-spinner"></div>
                                        Creando Grupo...
                                    </>
                                ) : (
                                    <>
                                        <span className="button-icon">💬</span>
                                        Crear Grupo
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupScreen;