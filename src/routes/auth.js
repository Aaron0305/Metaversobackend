const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRecoveryRequest, validatePasswordReset } = require('../middleware/validation');

/**
 * @route   GET /api/auth/health
 * @desc    Verificar estado del servidor
 * @access  Public
 */
router.get('/health', authController.healthCheck);

/**
 * @route   POST /api/auth/send-recovery-email
 * @desc    Enviar email de recuperación de contraseña
 * @access  Public
 * @body    { email: string }
 */
router.post('/send-recovery-email', validateRecoveryRequest, authController.sendRecoveryEmail);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Restablecer la contraseña con el token
 * @access  Public
 * @body    { token: string, password: string, confirmPassword: string }
 */
router.post('/reset-password', validatePasswordReset, authController.resetPassword);

/**
 * @route   POST /api/auth/verify-token
 * @desc    Verificar si un token de recuperación es válido
 * @access  Public
 * @body    { token: string }
 */
router.post('/verify-token', authController.verifyToken);

module.exports = router;
