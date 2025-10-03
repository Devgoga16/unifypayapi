# Servicio de Balance - UnifyPay API

## Descripción
El servicio de balance permite consultar el saldo actual de tu cuenta basado en todas las transacciones (ingresos/egresos) y depósitos registrados en el sistema.

## Funcionalidades

### 1. Cálculo Automático del Balance
- **Fórmula**: `Saldo = Ingresos + Depósitos - Egresos`
- Solo considera transacciones y depósitos con estado `confirmada`
- Calcula por moneda específica
- Incluye estadísticas detalladas

### 2. Soporte Multi-Moneda
- USD (Dólar Estadounidense)
- EUR (Euro)
- PEN (Sol Peruano)
- MXN (Peso Mexicano)
- COP (Peso Colombiano)

### 3. Movimientos Recientes
- Lista de transacciones y depósitos más recientes
- Ordenados por fecha (más reciente primero)
- Configurable hasta 100 movimientos

## Endpoints Disponibles

### 1. Obtener Balance por Moneda
```http
GET /api/balance/{moneda}
```

**Ejemplo**:
```bash
curl http://localhost:5000/api/balance/USD
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "saldo_actual": 1250.75,
    "total_ingresos": 2500.00,
    "total_egresos": 750.25,
    "total_depositos": 500.00,
    "moneda": "USD",
    "ultimo_movimiento": "2024-01-15T10:30:00Z",
    "fecha_consulta": "2024-01-15T11:00:00Z"
  }
}
```

### 2. Obtener Balance de Todas las Monedas
```http
GET /api/balance
```

**Ejemplo**:
```bash
curl http://localhost:5000/api/balance
```

**Respuesta**:
```json
{
  "success": true,
  "data": [
    {
      "saldo_actual": 1250.75,
      "total_ingresos": 2500.00,
      "total_egresos": 750.25,
      "total_depositos": 500.00,
      "moneda": "USD",
      "ultimo_movimiento": "2024-01-15T10:30:00Z"
    },
    {
      "saldo_actual": 980.50,
      "total_ingresos": 1500.00,
      "total_egresos": 519.50,
      "total_depositos": 0,
      "moneda": "EUR",
      "ultimo_movimiento": "2024-01-14T15:20:00Z"
    }
  ],
  "fecha_consulta": "2024-01-15T11:00:00Z"
}
```

### 3. Obtener Movimientos Recientes
```http
GET /api/balance/{moneda}/movimientos?limite=20
```

**Parámetros**:
- `limite` (opcional): Número de movimientos (1-100, por defecto 10)

**Ejemplo**:
```bash
curl http://localhost:5000/api/balance/USD/movimientos?limite=5
```

**Respuesta**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "codigo": "IN003",
      "descripcion": "Venta de producto",
      "monto": 150.00,
      "tipo": "ingreso",
      "fecha": "2024-01-15T10:30:00Z",
      "categoria": "transaccion"
    },
    {
      "codigo": "DE001",
      "descripcion": "Depósito inicial",
      "monto": 500.00,
      "tipo": "deposito",
      "fecha": "2024-01-14T15:20:00Z",
      "categoria": "deposito"
    }
  ]
}
```

### 4. Resumen Completo de Balance
```http
GET /api/balance/{moneda}/resumen?limite=10
```

**Ejemplo**:
```bash
curl http://localhost:5000/api/balance/USD/resumen?limite=5
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "balance": {
      "saldo_actual": 1250.75,
      "total_ingresos": 2500.00,
      "total_egresos": 750.25,
      "total_depositos": 500.00,
      "moneda": "USD",
      "ultimo_movimiento": "2024-01-15T10:30:00Z"
    },
    "movimientos_recientes": [
      {
        "codigo": "IN003",
        "descripcion": "Venta de producto",
        "monto": 150.00,
        "tipo": "ingreso",
        "fecha": "2024-01-15T10:30:00Z",
        "categoria": "transaccion"
      }
    ],
    "estadisticas": {
      "transacciones": [
        {
          "_id": "ingreso",
          "cantidad": 10,
          "monto_total": 2500.00,
          "monto_promedio": 250.00
        },
        {
          "_id": "egreso",
          "cantidad": 5,
          "monto_total": 750.25,
          "monto_promedio": 150.05
        }
      ],
      "depositos": {
        "cantidad": 2,
        "monto_total": 500.00,
        "monto_promedio": 250.00
      }
    },
    "fecha_consulta": "2024-01-15T11:00:00Z"
  }
}
```

## Códigos de Error

### 400 - Bad Request
```json
{
  "success": false,
  "error": "Moneda no válida. Permitidas: USD, EUR, PEN, MXN, COP"
}
```

### 400 - Límite Inválido
```json
{
  "success": false,
  "error": "El límite debe estar entre 1 y 100"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "error": "Error calculando balance: [mensaje específico]"
}
```

## Características Técnicas

### Optimización de Consultas
- Utiliza agregaciones de MongoDB para cálculos eficientes
- Índices en campos de moneda y estado
- Consultas paralelas para múltiples monedas

### Validaciones
- Monedas soportadas únicamente
- Límites de paginación
- Estados de transacciones válidos

### Consideraciones de Performance
- Cálculos en tiempo real (no cachea resultados)
- Para aplicaciones de alto volumen considerar:
  - Cache Redis para balances frecuentes
  - Vistas materializadas en MongoDB
  - Agregaciones pre-calculadas

## Integración con Frontend

### JavaScript/React Example
```javascript
// Obtener balance de USD
const balance = await fetch('/api/balance/USD');
const balanceData = await balance.json();

if (balanceData.success) {
  console.log(`Saldo actual: $${balanceData.data.saldo_actual}`);
  console.log(`Último movimiento: ${balanceData.data.ultimo_movimiento}`);
}

// Obtener resumen completo
const resumen = await fetch('/api/balance/USD/resumen?limite=10');
const resumenData = await resumen.json();

if (resumenData.success) {
  const { balance, movimientos_recientes, estadisticas } = resumenData.data;
  
  // Mostrar balance
  document.getElementById('saldo').textContent = `$${balance.saldo_actual}`;
  
  // Mostrar movimientos recientes
  movimientos_recientes.forEach(mov => {
    console.log(`${mov.codigo}: ${mov.descripcion} - $${mov.monto}`);
  });
  
  // Mostrar estadísticas
  estadisticas.transacciones.forEach(stat => {
    console.log(`${stat._id}: ${stat.cantidad} transacciones, promedio $${stat.monto_promedio}`);
  });
}
```

### Vue.js Example
```vue
<template>
  <div class="balance-card">
    <h2>Balance de Cuenta</h2>
    <div class="saldo">
      <span class="moneda">{{ balance.moneda }}</span>
      <span class="cantidad">${{ balance.saldo_actual }}</span>
    </div>
    
    <div class="estadisticas">
      <div class="stat">
        <label>Ingresos:</label>
        <span>${{ balance.total_ingresos }}</span>
      </div>
      <div class="stat">
        <label>Egresos:</label>
        <span>${{ balance.total_egresos }}</span>
      </div>
      <div class="stat">
        <label>Depósitos:</label>
        <span>${{ balance.total_depositos }}</span>
      </div>
    </div>
    
    <div class="movimientos">
      <h3>Movimientos Recientes</h3>
      <div v-for="mov in movimientos" :key="mov.codigo" class="movimiento">
        <span class="codigo">{{ mov.codigo }}</span>
        <span class="descripcion">{{ mov.descripcion }}</span>
        <span class="monto" :class="mov.tipo">{{ mov.monto }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      balance: {},
      movimientos: []
    }
  },
  async mounted() {
    await this.cargarResumen();
  },
  methods: {
    async cargarResumen() {
      try {
        const response = await fetch('/api/balance/USD/resumen?limite=5');
        const data = await response.json();
        
        if (data.success) {
          this.balance = data.data.balance;
          this.movimientos = data.data.movimientos_recientes;
        }
      } catch (error) {
        console.error('Error cargando balance:', error);
      }
    }
  }
}
</script>
```

## Swagger Documentation

El servicio está completamente documentado en Swagger UI:
- **URL**: `http://localhost:5000/api-docs`
- **Sección**: Balance
- **Esquemas**: Balance, MovimientoReciente, Estadisticas
- **Ejemplos**: Incluidos para todos los endpoints

## Casos de Uso

### 1. Dashboard Principal
Usar `/api/balance/{moneda}/resumen` para mostrar un dashboard completo con balance actual, movimientos recientes y estadísticas.

### 2. Widget de Balance
Usar `/api/balance/{moneda}` para mostrar solo el saldo actual en widgets o componentes pequeños.

### 3. Historial de Movimientos
Usar `/api/balance/{moneda}/movimientos` para páginas dedicadas al historial de transacciones.

### 4. Vista Multi-Moneda
Usar `/api/balance` para dashboards que muestren balances en todas las monedas soportadas.

## Próximas Mejoras

1. **Cache de Balances**: Redis para balances consultados frecuentemente
2. **Alertas de Balance**: Notificaciones cuando el saldo sea bajo
3. **Proyecciones**: Predicción de balance futuro basado en patrones
4. **Exportación**: Generar reportes PDF/Excel del balance
5. **Balance Histórico**: Consultar balance en fechas específicas