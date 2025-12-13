const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { config, validateConfig } = require('./src/utils/config');
const authRoutes = require('./src/routes/auth');

// Crear aplicación Express
const app = express();

// Validar configuración
console.log('🔧 Validando configuración...');
const configValid = validateConfig();

// Middleware de seguridad
app.use(helmet());

// Configurar CORS
app.use(cors({
    origin: [
        config.cors.frontendUrl,
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger de requests (solo en desarrollo)
if (config.server.nodeEnv === 'development') {
    app.use((req, res, next) => {
        console.log(`📥 ${req.method} ${req.path}`);
        next();
    });
}

// Rutas de la API
app.use('/api/auth', authRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🔐 API de Recuperación de Contraseña - PlayFab',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/auth/health',
            sendRecoveryEmail: 'POST /api/auth/send-recovery-email',
            resetPassword: 'POST /api/auth/reset-password',
            verifyToken: 'POST /api/auth/verify-token'
        },
        documentation: 'Consulta el README.md para más información'
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: config.server.nodeEnv === 'development' ? err.message : undefined
    });
});

// Iniciar servidor
const PORT = config.server.port;
app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║   🔐 API de Recuperación de Contraseña - PlayFab          ║');
    console.log('║                                                            ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║   🌐 Servidor:     http://localhost:${PORT}                   ║`);
    console.log(`║   📍 Entorno:      ${config.server.nodeEnv.padEnd(20)}             ║`);
    console.log(`║   🎮 PlayFab ID:   ${(config.playfab.titleId || 'NO CONFIGURADO').padEnd(20)}             ║`);
    console.log('║                                                            ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║   📚 Endpoints disponibles:                                ║');
    console.log('║      GET  /api/auth/health                                 ║');
    console.log('║      POST /api/auth/send-recovery-email                    ║');
    console.log('║      POST /api/auth/reset-password                         ║');
    console.log('║      POST /api/auth/verify-token                           ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
});

module.exports = app;
