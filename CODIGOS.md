# Códigos Automáticos para Transacciones

## 🆔 Sistema de Códigos Correlativos

El sistema ahora genera automáticamente códigos únicos y correlativos para cada transacción:

### 📈 **Ingresos**: `IN001`, `IN002`, `IN003`...
### 📉 **Egresos**: `EX001`, `EX002`, `EX003`...

## ✨ Características

- **Generación automática**: No necesitas enviar el campo `codigo` en el POST
- **Correlativos independientes**: Los ingresos y egresos tienen numeración separada
- **Formato fijo**: 2 letras + 3 números con ceros a la izquierda
- **Únicos**: No se pueden duplicar códigos
- **Inmutables**: No se pueden cambiar en actualizaciones (PUT)

## 🧪 Ejemplos de Uso

### Crear un Ingreso
```bash
POST /api/transactions
Content-Type: application/json

{
  "descripcion_transaccion": "Venta de productos",
  "monto_transaccion": 1500.00,
  "tipo_transaccion": "ingreso",
  "moneda": "PEN",
  "medio_pago": "transferencia"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id_transaccion": "auto-generated-uuid",
    "codigo": "IN001",  // ← Generado automáticamente
    "descripcion_transaccion": "Venta de productos",
    "monto_transaccion": 1500,
    "tipo_transaccion": "ingreso",
    "moneda": "PEN",
    "estado": "pendiente",
    "medio_pago": "transferencia",
    "fecha_transaccion": "2025-10-03T...",
    "createdAt": "2025-10-03T...",
    "updatedAt": "2025-10-03T..."
  }
}
```

### Crear un Egreso
```bash
POST /api/transactions
Content-Type: application/json

{
  "descripcion_transaccion": "Pago de servicios",
  "monto_transaccion": 250.00,
  "tipo_transaccion": "egreso",
  "moneda": "PEN",
  "medio_pago": "efectivo"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "codigo": "EX001",  // ← Primer egreso
    "tipo_transaccion": "egreso",
    // ... resto de campos
  }
}
```

### Secuencia de Códigos
Si creas más transacciones, la secuencia será:

1. **Primer ingreso**: `IN001`
2. **Primer egreso**: `EX001`
3. **Segundo ingreso**: `IN002`
4. **Segundo egreso**: `EX002`
5. **Tercer ingreso**: `IN003`
6. **Tercer egreso**: `EX003`

## 🔒 Restricciones

1. **No envíes el campo `codigo`** en el POST - se genera automáticamente
2. **No puedes cambiar el `codigo`** en actualizaciones (PUT)
3. **Cada código es único** en toda la base de datos
4. **Los códigos son inmutables** una vez asignados

## 🎯 Schema Actualizado

```typescript
interface Transaction {
  id_transaccion: string;          // UUID auto-generado
  codigo: string;                  // IN001, EX001, etc. (auto-generado)
  descripcion_transaccion: string;
  monto_transaccion: number;
  tipo_transaccion: "ingreso" | "egreso";
  fecha_transaccion: Date;
  moneda: "PEN" | "USD" | "EUR";
  estado: "confirmada" | "pendiente" | "cancelada";
  medio_pago: string;
  referencia?: string;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 📊 Endpoints Disponibles

- `GET /api/transactions` - Todas las transacciones (incluye códigos)
- `GET /api/transactions/ingresos` - Solo ingresos (IN001, IN002...)
- `GET /api/transactions/egresos` - Solo egresos (EX001, EX002...)
- `POST /api/transactions` - Crear con código auto-generado
- `PUT /api/transactions/:id` - Actualizar (código inmutable)

## 🔍 Búsqueda por Código

Puedes buscar transacciones por su código usando el endpoint de ID:

```bash
GET /api/transactions/IN001  # Buscar por código
```

**Nota**: El sistema busca por `id_transaccion`, pero puedes modificar la lógica si quieres buscar también por código.