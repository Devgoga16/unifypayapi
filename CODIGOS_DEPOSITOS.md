# Códigos Automáticos para Depósitos

## 🆔 Sistema de Códigos Correlativos - Depósitos

El sistema ahora genera automáticamente códigos únicos y correlativos para cada depósito:

### 💰 **Depósitos**: `DE001`, `DE002`, `DE003`...

## ✨ Características

- **Generación automática**: No necesitas enviar el campo `codigo` en el POST
- **Correlativos**: Secuencia numérica única para todos los depósitos
- **Formato fijo**: DE + 3 números con ceros a la izquierda
- **Únicos**: No se pueden duplicar códigos
- **Inmutables**: No se pueden cambiar en actualizaciones (PUT)

## 🧪 Ejemplos de Uso

### Crear un Depósito
```bash
POST /api/deposits
Content-Type: application/json

{
  "monto": 2500.00,
  "moneda": "PEN",
  "destinatario": "Juan Pérez",
  "tipo_deposito": "Transferencia",
  "descripcion": "Depósito por venta de productos",
  "banco": "Banco de Crédito",
  "numero_cuenta": "12345678901"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id_deposito": "auto-generated-uuid",
    "codigo": "DE001",  // ← Generado automáticamente
    "monto": 2500,
    "moneda": "PEN",
    "destinatario": "Juan Pérez",
    "tipo_deposito": "Transferencia",
    "descripcion": "Depósito por venta de productos",
    "banco": "Banco de Crédito",
    "numero_cuenta": "12345678901",
    "estado": "pendiente",
    "fecha_deposito": "2025-10-03T...",
    "gasto_referencia_id": null,
    "createdAt": "2025-10-03T...",
    "updatedAt": "2025-10-03T..."
  }
}
```

### Crear Depósito con Referencia a Transacción
```bash
POST /api/deposits
Content-Type: application/json

{
  "monto": 1500.00,
  "moneda": "USD",
  "destinatario": "María García",
  "tipo_deposito": "Efectivo",
  "descripcion": "Depósito relacionado con venta específica",
  "gasto_referencia_id": "6507d1234567890abcdef123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "codigo": "DE002",  // ← Segundo depósito
    "monto": 1500,
    "moneda": "USD",
    "destinatario": "María García",
    "tipo_deposito": "Efectivo",
    "descripcion": "Depósito relacionado con venta específica",
    "gasto_referencia_id": {
      "_id": "6507d1234567890abcdef123",
      "codigo": "IN001",
      "descripcion_transaccion": "Venta de productos",
      "monto_transaccion": 1500,
      "tipo_transaccion": "ingreso"
      // ... datos completos de la transacción referenciada
    },
    // ... resto de campos
  }
}
```

### Secuencia de Códigos
Si creas más depósitos, la secuencia será:

1. **Primer depósito**: `DE001`
2. **Segundo depósito**: `DE002`
3. **Tercer depósito**: `DE003`
4. **Cuarto depósito**: `DE004`
5. **Quinto depósito**: `DE005`

## 🔍 Buscar Depósito por Código

### Endpoint Específico
```bash
GET /api/deposits/codigo/DE001
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "codigo": "DE001",
    "monto": 2500,
    "moneda": "PEN",
    "destinatario": "Juan Pérez",
    "gasto_referencia_id": {
      // Datos completos de la transacción si existe referencia
    }
    // ... resto de campos
  }
}
```

### Error si no existe
```bash
GET /api/deposits/codigo/DE999
```

**Respuesta:**
```json
{
  "success": false,
  "error": "Deposit with codigo 'DE999' not found"
}
```

## 🔒 Restricciones

1. **No envíes el campo `codigo`** en el POST - se genera automáticamente
2. **No puedes cambiar el `codigo`** en actualizaciones (PUT)
3. **Cada código es único** en toda la base de datos
4. **Los códigos son inmutables** una vez asignados

## 🎯 Schema Actualizado

```typescript
interface Deposit {
  id_deposito: string;                    // UUID auto-generado
  codigo: string;                         // DE001, DE002, etc. (auto-generado)
  monto: number;
  moneda: "PEN" | "USD" | "EUR";
  fecha_deposito: Date;
  destinatario: string;
  banco?: string;
  numero_cuenta?: string;
  tipo_deposito: "Transferencia" | "Efectivo" | "Cheque" | "Depósito en ventanilla";
  estado: "confirmado" | "pendiente" | "rechazado";
  descripcion: string;
  documento_respaldo?: string;
  notas?: string;
  gasto_referencia_id?: ObjectId;         // Referencia a Transaction
  createdAt: Date;
  updatedAt: Date;
}
```

## 📊 Endpoints Disponibles

- `GET /api/deposits` - Todos los depósitos (incluye códigos)
- `GET /api/deposits/codigo/:codigo` - **🆕 Buscar por código (DE001, DE002...)**
- `GET /api/deposits/:id` - Buscar por ID
- `POST /api/deposits` - Crear con código auto-generado
- `PUT /api/deposits/:id` - Actualizar (código inmutable)
- `DELETE /api/deposits/:id` - Eliminar

## 🎭 Comparación con Transacciones

| Entidad | Prefijo | Formato | Ejemplo |
|---------|---------|---------|---------|
| **Ingresos** | IN | IN + 3 dígitos | IN001, IN002, IN003 |
| **Egresos** | EX | EX + 3 dígitos | EX001, EX002, EX003 |
| **Depósitos** | DE | DE + 3 dígitos | DE001, DE002, DE003 |

## 💡 Beneficios

1. **Identificación rápida**: Códigos cortos y fáciles de recordar
2. **Trazabilidad**: Cada depósito tiene un identificador único secuencial
3. **Integridad**: Validación automática de referencias
4. **Consistencia**: Mismo patrón que las transacciones
5. **Documentación**: Swagger actualizado con ejemplos