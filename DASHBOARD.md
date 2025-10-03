# Endpoint Dashboard - Resumen Ejecutivo

## 🎯 **Endpoint Principal**
```
GET /api/dashboard
```

## 📊 **Funcionalidades del Dashboard**

### 🗓️ **1. Resumen Mensual**
- **Ingresos del mes actual**: Cantidad y totales por moneda
- **Egresos del mes actual**: Cantidad y totales por moneda  
- **Depósitos del mes actual**: Cantidad y totales por moneda
- **Códigos más recientes** de cada tipo

### 📈 **2. Actividad Reciente**
- **Últimos 5 ingresos** creados
- **Últimos 5 egresos** creados
- **Últimos 5 depósitos** creados
- Incluye información de transacciones relacionadas

### 📋 **3. Estadísticas Generales**
- Total histórico de ingresos
- Total histórico de egresos
- Total histórico de depósitos
- Timestamp de última actualización

## 🧪 **Ejemplo de Respuesta**

```bash
GET /api/dashboard
```

```json
{
  "success": true,
  "data": {
    "resumen_mensual": {
      "mes": "octubre 2025",
      "periodo": {
        "inicio": "2025-10-01T00:00:00.000Z",
        "fin": "2025-10-31T23:59:59.999Z"
      },
      "ingresos": {
        "cantidad": 15,
        "totales_por_moneda": {
          "PEN": 12500.50,
          "USD": 3200.00,
          "EUR": 800.00
        },
        "ultimo_codigo": "IN015"
      },
      "egresos": {
        "cantidad": 8,
        "totales_por_moneda": {
          "PEN": 5200.30,
          "USD": 800.00
        },
        "ultimo_codigo": "EX008"
      },
      "depositos": {
        "cantidad": 5,
        "totales_por_moneda": {
          "PEN": 8500.00,
          "EUR": 1200.00
        },
        "ultimo_codigo": "DE005"
      }
    },
    "actividad_reciente": {
      "ingresos": [
        {
          "codigo": "IN015",
          "descripcion": "Venta de productos premium",
          "monto": 1500.00,
          "moneda": "PEN",
          "estado": "confirmada",
          "fecha": "2025-10-03T14:30:00.000Z",
          "creado": "2025-10-03T14:30:15.123Z"
        },
        {
          "codigo": "IN014",
          "descripcion": "Servicios de consultoría",
          "monto": 2500.00,
          "moneda": "USD",
          "estado": "pendiente",
          "fecha": "2025-10-02T10:15:00.000Z",
          "creado": "2025-10-02T10:15:45.456Z"
        }
        // ... 3 más
      ],
      "egresos": [
        {
          "codigo": "EX008",
          "descripcion": "Pago de servicios",
          "monto": 250.00,
          "moneda": "PEN",
          "estado": "confirmada",
          "fecha": "2025-10-03T09:00:00.000Z",
          "creado": "2025-10-03T09:00:30.789Z"
        }
        // ... 4 más
      ],
      "depositos": [
        {
          "codigo": "DE005",
          "descripcion": "Depósito bancario cliente VIP",
          "monto": 5000.00,
          "moneda": "PEN",
          "estado": "confirmado",
          "destinatario": "María García",
          "tipo_deposito": "Transferencia",
          "fecha": "2025-10-03T16:00:00.000Z",
          "creado": "2025-10-03T16:00:45.321Z",
          "transaccion_relacionada": {
            "codigo": "IN015",
            "descripcion": "Venta de productos premium"
          }
        }
        // ... 4 más
      ]
    },
    "estadisticas_generales": {
      "total_ingresos_historico": 150,
      "total_egresos_historico": 89,
      "total_depositos_historico": 45,
      "ultima_actualizacion": "2025-10-03T18:30:45.123Z"
    }
  }
}
```

## 💰 **Cálculos por Moneda**

El dashboard calcula automáticamente los totales separados por moneda:

### **Ejemplo de Totales:**
```json
{
  "totales_por_moneda": {
    "PEN": 12500.50,    // Soles peruanos
    "USD": 3200.00,     // Dólares americanos
    "EUR": 800.00       // Euros
  }
}
```

## 🔗 **Referencias Relacionadas**

### **Depósitos con Transacciones:**
Los depósitos que tienen `gasto_referencia_id` mostrarán:
```json
{
  "transaccion_relacionada": {
    "codigo": "IN015",
    "descripcion": "Venta de productos premium"
  }
}
```

### **Sin Referencia:**
```json
{
  "transaccion_relacionada": null
}
```

## 📅 **Periodo del Resumen Mensual**

- **Inicio**: Primer día del mes actual a las 00:00:00
- **Fin**: Último día del mes actual a las 23:59:59
- **Automático**: Se actualiza cada mes sin intervención

## 🎨 **Estructura de Actividad Reciente**

### **Campos Comunes:**
- `codigo`: Código único (IN001, EX001, DE001)
- `descripcion`: Descripción del registro
- `monto`: Cantidad monetaria
- `moneda`: Tipo de moneda (PEN, USD, EUR)
- `estado`: Estado actual
- `fecha`: Fecha del registro
- `creado`: Timestamp de creación

### **Campos Específicos de Depósitos:**
- `destinatario`: Nombre del destinatario
- `tipo_deposito`: Tipo (Transferencia, Efectivo, etc.)
- `transaccion_relacionada`: Info de transacción referenciada

## 🚀 **Casos de Uso**

### **1. Panel Principal de Aplicación**
```javascript
// Frontend puede usar esta data para mostrar:
const { resumen_mensual } = dashboardData;
console.log(`Ingresos este mes: ${resumen_mensual.ingresos.cantidad}`);
console.log(`Total en PEN: ${resumen_mensual.ingresos.totales_por_moneda.PEN}`);
```

### **2. Widgets de Actividad**
```javascript
// Mostrar últimas transacciones
const { actividad_reciente } = dashboardData;
actividad_reciente.ingresos.forEach(ingreso => {
  console.log(`${ingreso.codigo}: ${ingreso.descripcion}`);
});
```

### **3. Contadores y Estadísticas**
```javascript
// Para badges o contadores
const { estadisticas_generales } = dashboardData;
console.log(`Total registros: ${estadisticas_generales.total_ingresos_historico + 
                                 estadisticas_generales.total_egresos_historico + 
                                 estadisticas_generales.total_depositos_historico}`);
```

## ⚡ **Performance**

- **Optimizado**: Una sola petición para todo el dashboard
- **Indexado**: Consultas optimizadas por fecha y tipo
- **Populate**: Referencias cargadas automáticamente
- **Limitado**: Solo últimos 5 de cada tipo para evitar sobrecarga

## 🔧 **Parámetros**

Este endpoint **NO** requiere parámetros:
- No acepta query parameters
- No acepta body
- No requiere autenticación (por ahora)

## 📚 **Integración con Swagger**

Documentación completa disponible en:
```
GET /api-docs
```

Buscar la sección **Dashboard** para ver:
- Esquemas completos
- Ejemplos interactivos
- Códigos de respuesta
- Estructura detallada