# Despliegue en Vercel - UnifyPay API

## 🚀 Configuración para Vercel

Este proyecto está configurado para desplegarse como una función serverless en Vercel.

### 📁 **Archivos de Configuración Creados:**

1. **`vercel.json`** - Configuración principal de Vercel
2. **`api/index.js`** - Punto de entrada para la función serverless
3. **`.env.example`** - Plantilla de variables de entorno

### 🔧 **Pasos para Desplegar:**

#### **1. Preparar el Proyecto**
```bash
# Asegúrate de que todos los archivos estén commitados
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

#### **2. Variables de Entorno en Vercel**
En el dashboard de Vercel, configura estas variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/unifypaydb?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-for-production
API_VERSION=v1
```

#### **3. Desplegar**

**Opción A: Desde Vercel Dashboard**
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Importa el proyecto
4. Configura las variables de entorno
5. Deploy!

**Opción B: Desde CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Para production
vercel --prod
```

### 🌐 **URLs del Proyecto Desplegado**

Después del despliegue, tendrás URLs como:
```
https://unifypayapi.vercel.app/
https://unifypayapi.vercel.app/api-docs
https://unifypayapi.vercel.app/health
https://unifypayapi.vercel.app/api/dashboard
https://unifypayapi.vercel.app/api/transactions
https://unifypayapi.vercel.app/api/deposits
```

### 📊 **Endpoints Disponibles en Producción:**

| Endpoint | Descripción |
|----------|-------------|
| `GET /` | Información de la API |
| `GET /health` | Health check |
| `GET /api-docs` | Documentación Swagger |
| `GET /api/dashboard` | Resumen ejecutivo |
| `GET /api/transactions` | Todas las transacciones |
| `GET /api/transactions/ingresos` | Solo ingresos |
| `GET /api/transactions/egresos` | Solo egresos |
| `GET /api/transactions/codigo/:codigo` | Por código (IN001, EX001) |
| `POST /api/transactions` | Crear transacción |
| `PUT /api/transactions/:id` | Actualizar transacción |
| `DELETE /api/transactions/:id` | Eliminar transacción |
| `GET /api/deposits` | Todos los depósitos |
| `GET /api/deposits/codigo/:codigo` | Por código (DE001) |
| `POST /api/deposits` | Crear depósito |
| `PUT /api/deposits/:id` | Actualizar depósito |
| `DELETE /api/deposits/:id` | Eliminar depósito |

### 🗄️ **Base de Datos MongoDB**

#### **Opción 1: MongoDB Atlas (Recomendado)**
1. Ve a [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Configura el usuario y password
4. Obtén la connection string
5. Úsala en `MONGODB_URI`

#### **Ejemplo de Connection String:**
```
mongodb+srv://unifypay:password123@cluster0.abc123.mongodb.net/unifypaydb?retryWrites=true&w=majority
```

### ⚙️ **Configuración de vercel.json**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

### 🔒 **Variables de Entorno Requeridas**

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | `production` |
| `MONGODB_URI` | Conexión a MongoDB | `mongodb+srv://...` |
| `JWT_SECRET` | Clave secreta (futuro) | `super-secret-key` |
| `API_VERSION` | Versión de la API | `v1` |

### 🧪 **Testing en Producción**

#### **Health Check:**
```bash
curl https://unifypayapi.vercel.app/health
```

#### **Dashboard:**
```bash
curl https://unifypayapi.vercel.app/api/dashboard
```

#### **Crear Transacción:**
```bash
curl -X POST https://unifypayapi.vercel.app/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion_transaccion": "Test desde producción",
    "monto_transaccion": 100,
    "tipo_transaccion": "ingreso",
    "moneda": "PEN",
    "medio_pago": "transferencia"
  }'
```

### 📈 **Monitoreo**

Vercel proporciona:
- **Analytics**: Tráfico y performance
- **Logs**: Logs en tiempo real
- **Error tracking**: Errores y excepciones
- **Performance**: Métricas de velocidad

### 🚨 **Consideraciones Importantes**

#### **Límites de Vercel (Plan Gratuito):**
- **Execution Time**: 10 segundos por request
- **Payload Size**: 4.5MB
- **Bandwidth**: 100GB/mes
- **Function Size**: 50MB

#### **Optimizaciones:**
- Conexiones a DB se reutilizan automáticamente
- Cold starts optimizados
- Caching automático de assets estáticos

### 🔄 **CI/CD Automático**

Una vez configurado:
1. **Push a main** → Auto-deploy a producción
2. **Pull requests** → Preview deployments
3. **Branches** → Branch previews

### 📱 **CORS para Frontend**

Si tienes un frontend, configura CORS:
```env
CORS_ORIGIN=https://tu-frontend.vercel.app
```

O en el código:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
```

### 🆘 **Troubleshooting**

#### **Error de Conexión a DB:**
- Verifica que `MONGODB_URI` esté configurada
- Asegúrate de que la IP de Vercel esté whitelisteada en MongoDB Atlas (usa `0.0.0.0/0`)

#### **Function Timeout:**
- Verifica que las consultas a DB sean eficientes
- Considera aumentar `maxDuration` en `vercel.json`

#### **Cold Start Issues:**
- Primera request puede ser lenta (normal en serverless)
- Requests subsecuentes serán más rápidas

¡Tu API está lista para producción en Vercel! 🎉