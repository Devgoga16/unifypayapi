# UnifyPay API

REST API para el sistema UnifyPay con operaciones CRUD para transacciones y depósitos, conectado a MongoDB y documentado con Swagger.

## 🚀 Características

- **CRUD completo** para Transacciones y Depósitos
- **Base de datos MongoDB** con Mongoose ODM
- **Documentación automática** con Swagger UI
- **Validación de datos** con esquemas de Mongoose
- **Middleware de seguridad** con Helmet
- **CORS habilitado** para peticiones cross-origin
- **Logging** de peticiones con Morgan
- **Variables de entorno** para configuración
- **Manejo de errores** centralizado

## 📋 Prerequisitos

- Node.js (versión 14 o superior)
- MongoDB (local o remoto)
- npm o yarn

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd unifypayapi
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
4. **Configurar variables de entorno**
   
   El archivo `.env` ya está creado con valores por defecto. Modifica según tus necesidades:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/unifypaydb
   ```

   Para producción, ver [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

5. **Asegurar que MongoDB esté ejecutándose**
   
   Si tienes MongoDB instalado localmente:
   ```bash
   mongod
   ```
   
   O usa MongoDB Atlas para una base de datos en la nube.

## 🚀 Ejecución

### Modo Desarrollo (con auto-reinicio)
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## 🌐 Despliegue en Vercel

Este proyecto está configurado para desplegarse fácilmente en Vercel:

```bash
# Ejecutar script de configuración
./setup-vercel.ps1    # Windows
./setup-vercel.sh     # Linux/Mac
```

Ver documentación completa en [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

## 📚 Documentación de la API

Una vez que el servidor esté ejecutándose, puedes acceder a:

- **Documentación Swagger**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/health`
- **Info de la API**: `http://localhost:3000/`

## 🛣️ Endpoints

### Transacciones
- `GET /api/transactions` - Obtener todas las transacciones
- `POST /api/transactions` - Crear nueva transacción
- `GET /api/transactions/:id` - Obtener transacción por ID
- `PUT /api/transactions/:id` - Actualizar transacción
- `DELETE /api/transactions/:id` - Eliminar transacción

### Depósitos
- `GET /api/deposits` - Obtener todos los depósitos
- `POST /api/deposits` - Crear nuevo depósito
- `GET /api/deposits/:id` - Obtener depósito por ID
- `PUT /api/deposits/:id` - Actualizar depósito
- `DELETE /api/deposits/:id` - Eliminar depósito

## 💾 Esquemas de Datos

### Transaction
```typescript
{
  id_transaccion: string;        // Único, generado automáticamente si no se proporciona
  descripcion_transaccion: string;
  monto_transaccion: number;     // Mínimo 0
  tipo_transaccion: "ingreso" | "egreso";
  fecha_transaccion: Date;       // ISO 8601, por defecto Date.now()
  moneda: "PEN" | "USD" | "EUR";
  estado: "confirmada" | "pendiente" | "cancelada"; // Por defecto "pendiente"
  medio_pago: string;
  referencia?: string;           // Opcional
  notas?: string;               // Opcional
}
```

### Deposit
```typescript
{
  id_deposito: string;          // Único, generado automáticamente si no se proporciona
  monto: number;                // Mínimo 0
  moneda: "PEN" | "USD" | "EUR";
  fecha_deposito: Date;         // ISO 8601, por defecto Date.now()
  destinatario: string;         // Obligatorio
  banco?: string;               // Opcional
  numero_cuenta?: string;       // Opcional
  tipo_deposito: "Transferencia" | "Efectivo" | "Cheque" | "Depósito en ventanilla";
  estado: "confirmado" | "pendiente" | "rechazado"; // Por defecto "pendiente"
  descripcion: string;          // Obligatorio
  documento_respaldo?: string;  // Opcional
  notas?: string;              // Opcional
  gasto_referencia_id?: string; // Opcional
}
```

## 🧪 Ejemplos de Uso

### Crear una Transacción
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion_transaccion": "Pago de servicios",
    "monto_transaccion": 150.50,
    "tipo_transaccion": "egreso",
    "moneda": "PEN",
    "medio_pago": "transferencia",
    "notas": "Pago mensual de internet"
  }'
```

### Crear un Depósito
```bash
curl -X POST http://localhost:3000/api/deposits \
  -H "Content-Type: application/json" \
  -d '{
    "monto": 500,
    "moneda": "USD",
    "destinatario": "Juan Pérez",
    "tipo_deposito": "Transferencia",
    "descripcion": "Depósito por venta de productos",
    "banco": "Banco de Crédito"
  }'
```

## 📁 Estructura del Proyecto

```
unifypayapi/
├── src/
│   ├── config/
│   │   ├── database.js      # Configuración de MongoDB
│   │   └── swagger.js       # Configuración de Swagger
│   ├── controllers/
│   │   ├── transactionController.js
│   │   └── depositController.js
│   ├── models/
│   │   ├── Transaction.js
│   │   └── Deposit.js
│   └── routes/
│       ├── transactions.js
│       └── deposits.js
├── server.js               # Archivo principal de la aplicación
├── package.json
├── .env                   # Variables de entorno
├── .gitignore
└── README.md
```

## 🔧 Scripts Disponibles

- `npm start` - Ejecutar en modo producción
- `npm run dev` - Ejecutar en modo desarrollo con nodemon
- `npm test` - Ejecutar tests (pendiente de implementación)

## 🛡️ Seguridad

- Helmet.js para headers de seguridad
- Validación de datos con Mongoose
- Manejo seguro de errores
- Variables de entorno para configuración sensible

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.