const Balance = require('../models/Balance');
const Transaction = require('../models/Transaction');
const Deposit = require('../models/Deposit');

// @desc    Get balance by currency
// @route   GET /api/balance/:moneda
// @access  Public
const getBalance = async (req, res) => {
  try {
    const { moneda } = req.params;
    
    // Validar moneda
    const monedasPermitidas = ['USD', 'EUR', 'PEN', 'MXN', 'COP'];
    if (!monedasPermitidas.includes(moneda.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: `Moneda no válida. Permitidas: ${monedasPermitidas.join(', ')}`
      });
    }

    // Calcular balance actual
    const balanceData = await Balance.calcularBalance(moneda.toUpperCase());
    
    // Obtener último movimiento
    const ultimoMovimiento = await getUltimoMovimiento(moneda.toUpperCase());

    res.status(200).json({
      success: true,
      data: {
        ...balanceData,
        ultimo_movimiento: ultimoMovimiento,
        fecha_consulta: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get balance for all currencies
// @route   GET /api/balance
// @access  Public
const getAllBalances = async (req, res) => {
  try {
    const monedas = ['USD', 'EUR', 'PEN', 'MXN', 'COP'];
    const balances = [];

    for (const moneda of monedas) {
      try {
        const balanceData = await Balance.calcularBalance(moneda);
        const ultimoMovimiento = await getUltimoMovimiento(moneda);
        
        balances.push({
          ...balanceData,
          ultimo_movimiento: ultimoMovimiento
        });
      } catch (error) {
        // Si hay error con una moneda específica, continuar con las demás
        balances.push({
          moneda: moneda,
          saldo_actual: 0,
          total_ingresos: 0,
          total_egresos: 0,
          total_depositos: 0,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      data: balances,
      fecha_consulta: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get recent movements for balance
// @route   GET /api/balance/:moneda/movimientos
// @access  Public
const getMovimientosRecientes = async (req, res) => {
  try {
    const { moneda } = req.params;
    const limite = parseInt(req.query.limite) || 10;
    
    // Validar moneda
    const monedasPermitidas = ['USD', 'EUR', 'PEN', 'MXN', 'COP'];
    if (!monedasPermitidas.includes(moneda.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: `Moneda no válida. Permitidas: ${monedasPermitidas.join(', ')}`
      });
    }

    // Validar límite
    if (limite < 1 || limite > 100) {
      return res.status(400).json({
        success: false,
        error: 'El límite debe estar entre 1 y 100'
      });
    }

    const movimientos = await Balance.obtenerMovimientosRecientes(moneda.toUpperCase(), limite);

    res.status(200).json({
      success: true,
      count: movimientos.length,
      data: movimientos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get balance summary with recent movements
// @route   GET /api/balance/:moneda/resumen
// @access  Public
const getResumenBalance = async (req, res) => {
  try {
    const { moneda } = req.params;
    const limiteMovimientos = parseInt(req.query.limite) || 5;
    
    // Validar moneda
    const monedasPermitidas = ['USD', 'EUR', 'PEN', 'MXN', 'COP'];
    if (!monedasPermitidas.includes(moneda.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: `Moneda no válida. Permitidas: ${monedasPermitidas.join(', ')}`
      });
    }

    // Obtener balance
    const balanceData = await Balance.calcularBalance(moneda.toUpperCase());
    
    // Obtener movimientos recientes
    const movimientos = await Balance.obtenerMovimientosRecientes(moneda.toUpperCase(), limiteMovimientos);
    
    // Obtener último movimiento
    const ultimoMovimiento = await getUltimoMovimiento(moneda.toUpperCase());

    // Calcular estadísticas adicionales
    const estadisticas = await calcularEstadisticas(moneda.toUpperCase());

    res.status(200).json({
      success: true,
      data: {
        balance: {
          ...balanceData,
          ultimo_movimiento: ultimoMovimiento
        },
        movimientos_recientes: movimientos,
        estadisticas: estadisticas,
        fecha_consulta: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Función auxiliar para obtener último movimiento
async function getUltimoMovimiento(moneda) {
  try {
    // Buscar en transacciones
    const ultimaTransaccion = await Transaction.findOne({
      moneda: moneda,
      estado: 'confirmada'
    }).sort({ createdAt: -1 }).select('createdAt');

    // Buscar en depósitos
    const ultimoDeposito = await Deposit.findOne({
      moneda: moneda,
      estado: 'confirmada'
    }).sort({ createdAt: -1 }).select('createdAt');

    // Determinar cuál es más reciente
    const fechaTransaccion = ultimaTransaccion?.createdAt || new Date(0);
    const fechaDeposito = ultimoDeposito?.createdAt || new Date(0);

    return fechaTransaccion > fechaDeposito ? fechaTransaccion : fechaDeposito;
  } catch (error) {
    return null;
  }
}

// Función auxiliar para calcular estadísticas
async function calcularEstadisticas(moneda) {
  try {
    // Contar transacciones por tipo
    const statsTransacciones = await Transaction.aggregate([
      { $match: { moneda: moneda, estado: 'confirmada' } },
      {
        $group: {
          _id: '$tipo_transaccion',
          cantidad: { $sum: 1 },
          monto_total: { $sum: '$monto_transaccion' },
          monto_promedio: { $avg: '$monto_transaccion' }
        }
      }
    ]);

    // Contar depósitos
    const statsDepositos = await Deposit.aggregate([
      { $match: { moneda: moneda, estado: 'confirmada' } },
      {
        $group: {
          _id: 'depositos',
          cantidad: { $sum: 1 },
          monto_total: { $sum: '$monto_deposito' },
          monto_promedio: { $avg: '$monto_deposito' }
        }
      }
    ]);

    return {
      transacciones: statsTransacciones,
      depositos: statsDepositos[0] || { cantidad: 0, monto_total: 0, monto_promedio: 0 }
    };
  } catch (error) {
    return {
      transacciones: [],
      depositos: { cantidad: 0, monto_total: 0, monto_promedio: 0 }
    };
  }
}

module.exports = {
  getBalance,
  getAllBalances,
  getMovimientosRecientes,
  getResumenBalance
};