# Referencias entre Depósitos y Transacciones

## 🔗 Relación entre Modelos

El modelo `Deposit` ahora tiene una referencia al modelo `Transaction` a través del campo `gasto_referencia_id`.

### 📊 **Estructura de la Referencia:**

```javascript
// En el modelo Deposit
gasto_referencia_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Transaction',
  required: false
}
```

## 🎯 **Funcionamiento:**

### ✅ **Crear Depósito con Referencia:**
```bash
POST /api/deposits
Content-Type: application/json

{
  "monto": 1500,
  "moneda": "PEN",
  "destinatario": "Juan Pérez",
  "tipo_deposito": "Transferencia",
  "descripcion": "Depósito relacionado con venta",
  "gasto_referencia_id": "6507d1234567890abcdef123"  // ← ObjectId de Transaction
}
```

### 📋 **Respuesta con Datos Poblados:**
```json
{
  "success": true,
  "data": {
    "id_deposito": "auto-generated-uuid",
    "monto": 1500,
    "moneda": "PEN",
    "destinatario": "Juan Pérez",
    "tipo_deposito": "Transferencia",
    "descripcion": "Depósito relacionado con venta",
    "gasto_referencia_id": {
      "_id": "6507d1234567890abcdef123",
      "codigo": "IN001",
      "descripcion_transaccion": "Venta de productos",
      "monto_transaccion": 1500,
      "tipo_transaccion": "ingreso",
      "moneda": "PEN",
      "estado": "confirmada"
      // ... resto de campos de la transacción
    },
    "estado": "pendiente",
    "fecha_deposito": "2025-10-03T...",
    "createdAt": "2025-10-03T...",
    "updatedAt": "2025-10-03T..."
  }
}
```

## 🔍 **Endpoints que Populan la Referencia:**

### 1. **Obtener Todos los Depósitos**
```bash
GET /api/deposits
```
- ✅ Incluye datos completos de transacciones referenciadas

### 2. **Obtener Depósito Específico**
```bash
GET /api/deposits/:id
```
- ✅ Incluye datos completos de la transacción referenciada

### 3. **Crear Depósito**
```bash
POST /api/deposits
```
- ✅ Valida que la transacción referenciada existe
- ✅ Retorna el depósito con la referencia poblada

### 4. **Actualizar Depósito**
```bash
PUT /api/deposits/:id
```
- ✅ Permite cambiar la referencia
- ✅ Retorna el depósito con la nueva referencia poblada

## 🛡️ **Validaciones Implementadas:**

### ✅ **Al Crear:**
- Verifica que el `gasto_referencia_id` existe en la colección `Transaction`
- Si no existe, retorna error 400

### ✅ **Respuestas Consistentes:**
- Todos los endpoints retornan la referencia poblada
- Si no hay referencia, el campo es `null`

## 📝 **Ejemplos de Uso:**

### **Caso 1: Depósito SIN Referencia**
```bash
POST /api/deposits
{
  "monto": 500,
  "moneda": "USD",
  "destinatario": "María García",
  "tipo_deposito": "Efectivo",
  "descripcion": "Depósito general"
  // gasto_referencia_id no se envía
}
```

### **Caso 2: Depósito CON Referencia**
```bash
# Primero obtener el ObjectId de una transacción
GET /api/transactions
# Usar el _id de alguna transacción

POST /api/deposits
{
  "monto": 1200,
  "moneda": "PEN",
  "destinatario": "Carlos López",
  "tipo_deposito": "Transferencia",
  "descripcion": "Depósito por venta específica",
  "gasto_referencia_id": "6507d1234567890abcdef123"
}
```

### **Caso 3: Error de Referencia Inválida**
```bash
POST /api/deposits
{
  "monto": 800,
  "moneda": "EUR",
  "destinatario": "Ana Rodríguez",
  "tipo_deposito": "Cheque",
  "descripcion": "Depósito con referencia incorrecta",
  "gasto_referencia_id": "000000000000000000000000"  // ← No existe
}
```

**Respuesta de Error:**
```json
{
  "success": false,
  "error": "Referenced transaction not found"
}
```

## 🎨 **En Swagger:**

La documentación muestra:
- `gasto_referencia_id` como string (ObjectId)
- Descripción: "Reference to a Transaction ObjectId"
- En las respuestas, mostrará el objeto completo de la transacción

## 💡 **Beneficios:**

1. **Trazabilidad**: Puedes relacionar depósitos con transacciones específicas
2. **Integridad**: Se valida que la referencia exista
3. **Información Completa**: Los endpoints retornan todos los datos relacionados
4. **Flexibilidad**: La referencia es opcional
5. **Performance**: Un solo query para obtener toda la información relacionada