const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  id_balance: {
    type: String,
    required: true,
    unique: true
  },
  saldo_actual: {
    type: Number,
    required: true,
    default: 0
  },
  moneda: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'PEN', 'MXN', 'COP'],
    default: 'USD'
  },
  ultimo_movimiento: {
    type: Date,
    default: Date.now
  },
  total_ingresos: {
    type: Number,
    default: 0
  },
  total_egresos: {
    type: Number,
    default: 0
  },
  total_depositos: {
    type: Number,
    default: 0
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'bloqueado'],
    default: 'activo'
  },
  descripcion: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Método para calcular el balance basado en transacciones y depósitos
balanceSchema.statics.calcularBalance = async function(moneda = 'USD') {
  const Transaction = require('./Transaction');
  const Deposit = require('./Deposit');

  try {
    // Calcular total de ingresos
    const totalIngresos = await Transaction.aggregate([
      { $match: { tipo_transaccion: 'ingreso', moneda: moneda, estado: 'confirmada' } },
      { $group: { _id: null, total: { $sum: '$monto_transaccion' } } }
    ]);

    // Calcular total de egresos
    const totalEgresos = await Transaction.aggregate([
      { $match: { tipo_transaccion: 'egreso', moneda: moneda, estado: 'confirmada' } },
      { $group: { _id: null, total: { $sum: '$monto_transaccion' } } }
    ]);

    // Calcular total de depósitos
    const totalDepositos = await Deposit.aggregate([
      { $match: { moneda: moneda, estado: 'confirmada' } },
      { $group: { _id: null, total: { $sum: '$monto_deposito' } } }
    ]);

    const ingresos = totalIngresos[0]?.total || 0;
    const egresos = totalEgresos[0]?.total || 0;
    const depositos = totalDepositos[0]?.total || 0;

    // Balance = Ingresos + Depósitos - Egresos
    const saldoActual = ingresos + depositos - egresos;

    return {
      saldo_actual: saldoActual,
      total_ingresos: ingresos,
      total_egresos: egresos,
      total_depositos: depositos,
      moneda: moneda
    };
  } catch (error) {
    throw new Error('Error calculando balance: ' + error.message);
  }
};

// Método para obtener movimientos recientes
balanceSchema.statics.obtenerMovimientosRecientes = async function(moneda = 'USD', limite = 10) {
  const Transaction = require('./Transaction');
  const Deposit = require('./Deposit');

  try {
    // Obtener transacciones recientes
    const transacciones = await Transaction.find({ 
      moneda: moneda, 
      estado: 'confirmada' 
    })
    .sort({ createdAt: -1 })
    .limit(limite)
    .select('codigo descripcion_transaccion monto_transaccion tipo_transaccion createdAt');

    // Obtener depósitos recientes
    const depositos = await Deposit.find({ 
      moneda: moneda, 
      estado: 'confirmada' 
    })
    .sort({ createdAt: -1 })
    .limit(limite)
    .select('codigo descripcion_deposito monto_deposito createdAt');

    // Combinar y ordenar por fecha
    const movimientos = [
      ...transacciones.map(t => ({
        codigo: t.codigo,
        descripcion: t.descripcion_transaccion,
        monto: t.monto_transaccion,
        tipo: t.tipo_transaccion,
        fecha: t.createdAt,
        categoria: 'transaccion'
      })),
      ...depositos.map(d => ({
        codigo: d.codigo,
        descripcion: d.descripcion_deposito,
        monto: d.monto_deposito,
        tipo: 'deposito',
        fecha: d.createdAt,
        categoria: 'deposito'
      }))
    ];

    return movimientos
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, limite);
  } catch (error) {
    throw new Error('Error obteniendo movimientos: ' + error.message);
  }
};

// Índices para optimizar consultas
balanceSchema.index({ moneda: 1 });
balanceSchema.index({ estado: 1 });
balanceSchema.index({ ultimo_movimiento: -1 });

module.exports = mongoose.model('Balance', balanceSchema);