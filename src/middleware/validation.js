const { body, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Validaciones para solicitar recuperación de contraseña
 */
const validateRecoveryRequest = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('El email es requerido')
        .isEmail()
        .withMessage('Por favor, ingresa un email válido')
        .normalizeEmail(),
    handleValidationErrors
];

/**
 * Validaciones para restablecer la contraseña
 */
const validatePasswordReset = [
    body('token')
        .trim()
        .notEmpty()
        .withMessage('El token de recuperación es requerido'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[a-z]/)
        .withMessage('La contraseña debe contener al menos una letra minúscula')
        .matches(/[A-Z]/)
        .withMessage('La contraseña debe contener al menos una letra mayúscula')
        .matches(/[0-9]/)
        .withMessage('La contraseña debe contener al menos un número'),
    body('confirmPassword')
        .notEmpty()
        .withMessage('La confirmación de contraseña es requerida')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        }),
    handleValidationErrors
];

module.exports = {
    validateRecoveryRequest,
    validatePasswordReset,
    handleValidationErrors
};
