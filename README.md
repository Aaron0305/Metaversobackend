# Backend - API de Recuperación de Contraseña

API REST construida con Express.js para manejar la recuperación de contraseñas a través de Azure PlayFab.

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PLAYFAB_TITLE_ID` | ID de tu título en PlayFab | `ABC123` |
| `PLAYFAB_SECRET_KEY` | Clave secreta de desarrollador | `XXXXXXX...` |
| `PORT` | Puerto del servidor | `5000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `FRONTEND_URL` | URL del frontend para CORS | `http://localhost:3000` |

## 🚀 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 📡 Endpoints

### Health Check
```http
GET /api/auth/health
```

### Enviar Email de Recuperación
```http
POST /api/auth/send-recovery-email
Content-Type: application/json

{
  "email": "usuario@ejemplo.com"
}
```

### Restablecer Contraseña
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "token-del-email",
  "password": "NuevaContraseña123",
  "confirmPassword": "NuevaContraseña123"
}
```

## 🔐 Requisitos de Contraseña

- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número

## 📋 Configuración en PlayFab

1. Ve al panel de administración de PlayFab
2. Navega a **Settings** → **Email Templates**
3. Configura el **Callback URL** para la recuperación de contraseña
4. El formato del callback debe ser: `https://tu-dominio.com/reset/{token}`

## 🛡️ Seguridad

- Helmet para headers de seguridad
- CORS configurado para tu dominio
- Validación de entrada con express-validator
- No se revela si un email existe en el sistema
