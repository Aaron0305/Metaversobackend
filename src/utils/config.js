require('dotenv').config();

const config = {
    // PlayFab Configuration
    playfab: {
        titleId: process.env.PLAYFAB_TITLE_ID,
        secretKey: process.env.PLAYFAB_SECRET_KEY,
    },

    // Server Configuration
    server: {
        port: process.env.PORT || 5000,
        nodeEnv: process.env.NODE_ENV || 'development',
    },

    // CORS Configuration
    cors: {
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    },

    // Callback URL para PlayFab
    callbackUrl: process.env.PRODUCTION_CALLBACK_URL || 'http://localhost:3000/reset',
};

// Validar configuración requerida
const validateConfig = () => {
    const required = ['playfab.titleId', 'playfab.secretKey'];
    const missing = [];

    if (!config.playfab.titleId) missing.push('PLAYFAB_TITLE_ID');
    if (!config.playfab.secretKey) missing.push('PLAYFAB_SECRET_KEY');

    if (missing.length > 0) {
        console.warn(`⚠️  Variables de entorno faltantes: ${missing.join(', ')}`);
        console.warn('   Por favor, configura el archivo .env');
    }

    return missing.length === 0;
};

module.exports = { config, validateConfig };
