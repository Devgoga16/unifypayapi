const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
  id_deposito: {
    type: String,
    required: true,
    unique: true
  },
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  monto: {
    type: Number,
    required: true,
    min: 0
  },
  moneda: {
    type: String,
    required: true,
    enum: ['PEN', 'USD', 'EUR']
  },
  fecha_deposito: {
    type: Date,
    required: true,
    default: Date.now
  },
  destinatario: {
    type: String,
    required: true
  },
  banco: {
    type: String,
    required: false
  },
  numero_cuenta: {
    type: String,
    required: false
  },
  tipo_deposito: {
    type: String,
    required: true,
    enum: ['Transferencia', 'Efectivo', 'Cheque', 'Depósito en ventanilla']
  },
  estado: {
    type: String,
    required: true,
    enum: ['confirmado', 'pendiente', 'rechazado'],
    default: 'pendiente'
  },
  descripcion: {
    type: String,
    required: true
  },
  documento_respaldo: {
    type: String,
    required: false
  },
  notas: {
    type: String,
    required: false
  },
  gasto_referencia_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: false
  },
  archivo_adjunto: {
    type: String,
    required: false,
    // Base64 encoded file (comprobante de pago)
  },
  archivo_nombre: {
    type: String,
    required: false,
    // Original filename
  },
  archivo_tipo: {
    type: String,
    required: false,
    // MIME type (image/jpeg, application/pdf, etc.)
  },
  archivo_tamaño: {
    type: Number,
    required: false,
    // File size in bytes
  }
}, {
  timestamps: true
});

// Método estático para generar el próximo código
depositSchema.statics.generateNextCode = async function() {
  const prefix = 'DE';
  
  // Buscar el último depósito ordenado por código
  const lastDeposit = await this.findOne({}).sort({ codigo: -1 });
  
  let nextNumber = 1;
  
  if (lastDeposit && lastDeposit.codigo) {
    // Extraer el número del código (ejemplo: DE005 -> 5)
    const lastNumber = parseInt(lastDeposit.codigo.substr(2));
    nextNumber = lastNumber + 1;
  }
  
  // Formatear con ceros a la izquierda (001, 002, etc.)
  const formattedNumber = nextNumber.toString().padStart(3, '0');
  return `${prefix}${formattedNumber}`;
};

module.exports = mongoose.model('Deposit', depositSchema);