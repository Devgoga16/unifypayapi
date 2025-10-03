const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id_transaccion: {
    type: String,
    required: true,
    unique: true
  },
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  descripcion_transaccion: {
    type: String,
    required: true
  },
  monto_transaccion: {
    type: Number,
    required: true,
    min: 0
  },
  tipo_transaccion: {
    type: String,
    required: true,
    enum: ['ingreso', 'egreso']
  },
  fecha_transaccion: {
    type: Date,
    required: true,
    default: Date.now
  },
  moneda: {
    type: String,
    required: true,
    enum: ['PEN', 'USD', 'EUR']
  },
  estado: {
    type: String,
    required: true,
    enum: ['confirmada', 'pendiente', 'cancelada'],
    default: 'pendiente'
  },
  medio_pago: {
    type: String,
    required: true
  },
  referencia: {
    type: String,
    required: false
  },
  notas: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Método estático para generar el próximo código basado en el tipo
transactionSchema.statics.generateNextCode = async function(tipo_transaccion) {
  const prefix = tipo_transaccion === 'ingreso' ? 'IN' : 'EX';
  
  // Buscar la última transacción del mismo tipo
  const lastTransaction = await this.findOne({ 
    tipo_transaccion: tipo_transaccion 
  }).sort({ codigo: -1 });
  
  let nextNumber = 1;
  
  if (lastTransaction && lastTransaction.codigo) {
    // Extraer el número del código (ejemplo: IN005 -> 5)
    const lastNumber = parseInt(lastTransaction.codigo.substr(2));
    nextNumber = lastNumber + 1;
  }
  
  // Formatear con ceros a la izquierda (001, 002, etc.)
  const formattedNumber = nextNumber.toString().padStart(3, '0');
  return `${prefix}${formattedNumber}`;
};

module.exports = mongoose.model('Transaction', transactionSchema);