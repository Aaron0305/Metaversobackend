const PlayFabClient = require('playfab-sdk/Scripts/PlayFab/PlayFabClient');
const PlayFabServer = require('playfab-sdk/Scripts/PlayFab/PlayFabServer');
const PlayFabAdmin = require('playfab-sdk/Scripts/PlayFab/PlayFabAdmin');
const { config } = require('../utils/config');

// Configurar PlayFab
PlayFabClient.settings.titleId = config.playfab.titleId;
PlayFabServer.settings.titleId = config.playfab.titleId;
PlayFabServer.settings.developerSecretKey = config.playfab.secretKey;
PlayFabAdmin.settings.titleId = config.playfab.titleId;
PlayFabAdmin.settings.developerSecretKey = config.playfab.secretKey;

/**
 * Envía un email de recuperación de contraseña a través de PlayFab
 * @param {string} email - Email del usuario
 * @returns {Promise<object>} - Resultado de la operación
 */
const sendPasswordResetEmail = (email) => {
    return new Promise((resolve, reject) => {
        const request = {
            Email: email,
            TitleId: config.playfab.titleId,
        };

        PlayFabServer.SendCustomAccountRecoveryEmail(request, (error, result) => {
            if (error) {
                console.error('Error en SendCustomAccountRecoveryEmail:', error);
                reject({
                    success: false,
                    error: error.errorMessage || 'Error al enviar email de recuperación',
                    code: error.errorCode || 'UNKNOWN_ERROR'
                });
            } else {
                console.log('Email de recuperación enviado exitosamente');
                resolve({
                    success: true,
                    message: 'Email de recuperación enviado exitosamente'
                });
            }
        });
    });
};

/**
 * Alternativa: Usar el método estándar de recuperación de PlayFab
 * @param {string} email - Email del usuario
 * @returns {Promise<object>} - Resultado de la operación
 */
const sendAccountRecoveryEmail = (email) => {
    return new Promise((resolve, reject) => {
        const request = {
            Email: email,
            TitleId: config.playfab.titleId,
        };

        PlayFabClient.SendAccountRecoveryEmail(request, (error, result) => {
            if (error) {
                console.error('Error en SendAccountRecoveryEmail:', error);
                reject({
                    success: false,
                    error: error.errorMessage || 'Error al enviar email de recuperación',
                    code: error.errorCode || 'UNKNOWN_ERROR'
                });
            } else {
                console.log('Email de recuperación enviado exitosamente');
                resolve({
                    success: true,
                    message: 'Se ha enviado un email con las instrucciones para restablecer tu contraseña'
                });
            }
        });
    });
};

/**
 * Restablece la contraseña del usuario usando el token de recuperación
 * @param {string} token - Token de recuperación recibido en el email
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<object>} - Resultado de la operación
 */
const resetPasswordWithToken = (token, newPassword) => {
    return new Promise((resolve, reject) => {
        const request = {
            Token: token,
            Password: newPassword,
        };

        PlayFabAdmin.ResetPassword(request, (error, result) => {
            if (error) {
                console.error('Error en ResetPassword:', error);
                reject({
                    success: false,
                    error: error.errorMessage || 'Error al restablecer la contraseña',
                    code: error.errorCode || 'UNKNOWN_ERROR'
                });
            } else {
                console.log('Contraseña restablecida exitosamente');
                resolve({
                    success: true,
                    message: 'Contraseña actualizada exitosamente'
                });
            }
        });
    });
};

/**
 * Verifica si un token de recuperación es válido
 * (Nota: PlayFab no tiene un endpoint específico para esto,
 * pero podemos intentar obtener información del usuario)
 */
const verifyRecoveryToken = (token) => {
    return new Promise((resolve) => {
        // PlayFab no tiene un endpoint específico para verificar tokens
        // El token se validará cuando se intente cambiar la contraseña
        if (token && token.length > 0) {
            resolve({
                success: true,
                valid: true,
                message: 'Token presente'
            });
        } else {
            resolve({
                success: false,
                valid: false,
                message: 'Token no proporcionado'
            });
        }
    });
};

module.exports = {
    sendPasswordResetEmail,
    sendAccountRecoveryEmail,
    resetPasswordWithToken,
    verifyRecoveryToken
};
