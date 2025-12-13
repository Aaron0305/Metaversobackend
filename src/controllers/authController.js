const playfabService = require('../services/playfabService');

/**
 * Controlador para enviar email de recuperación de contraseña
 * POST /api/auth/send-recovery-email
 */
const sendRecoveryEmail = async (req, res) => {
    try {
        const { email } = req.body;

        console.log(`📧 Solicitando recuperación de contraseña para: ${email}`);

        const result = await playfabService.sendAccountRecoveryEmail(email);

        res.status(200).json({
            success: true,
            message: 'Si el email está registrado, recibirás las instrucciones para restablecer tu contraseña.',
            data: result
        });

    } catch (error) {
        console.error('❌ Error en sendRecoveryEmail:', error);

        // Por seguridad, no revelamos si el email existe o no
        if (error.code === 'AccountNotFound') {
            return res.status(200).json({
                success: true,
                message: 'Si el email está registrado, recibirás las instrucciones para restablecer tu contraseña.'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Error al procesar la solicitud. Por favor, intenta de nuevo más tarde.',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                code: error.code,
                details: error.error || error
            } : undefined
        });
    }
};

/**
 * Controlador para restablecer la contraseña
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        console.log('🔐 Intentando restablecer contraseña...');

        const result = await playfabService.resetPasswordWithToken(token, password);

        res.status(200).json({
            success: true,
            message: '¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión con tu nueva contraseña.',
            data: result
        });

    } catch (error) {
        console.error('Error en resetPassword:', error);

        // Manejar errores específicos de PlayFab
        let statusCode = 500;
        let message = 'Error al restablecer la contraseña. Por favor, intenta de nuevo.';

        if (error.code === 'InvalidToken' || error.code === 'ExpiredToken') {
            statusCode = 400;
            message = 'El enlace de recuperación ha expirado o no es válido. Por favor, solicita uno nuevo.';
        }

        res.status(statusCode).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

/**
 * Controlador para verificar el estado del servidor
 * GET /api/auth/health
 */
const healthCheck = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
};

/**
 * Controlador para verificar token de recuperación
 * POST /api/auth/verify-token
 */
const verifyToken = async (req, res) => {
    try {
        const { token } = req.body;

        const result = await playfabService.verifyRecoveryToken(token);

        res.status(200).json({
            success: true,
            valid: result.valid,
            message: result.message
        });

    } catch (error) {
        console.error('Error en verifyToken:', error);
        res.status(400).json({
            success: false,
            valid: false,
            message: 'Token no válido'
        });
    }
};

module.exports = {
    sendRecoveryEmail,
    resetPassword,
    healthCheck,
    verifyToken
};
