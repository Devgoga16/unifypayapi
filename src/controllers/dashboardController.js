const Transaction = require('../models/Transaction');
const Deposit = require('../models/Deposit');

// @desc    Get dashboard summary
// @route   GET /api/dashboard
// @access  Public
const getDashboardSummary = async (req, res) => {
  try {
    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Get current month income transactions
    const ingresos = await Transaction.find({
      tipo_transaccion: 'ingreso',
      fecha_transaccion: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Get current month expense transactions
    const egresos = await Transaction.find({
      tipo_transaccion: 'egreso',
      fecha_transaccion: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Get current month deposits
    const depositos = await Deposit.find({
      fecha_deposito: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    }).populate('gasto_referencia_id');

    // Calculate totals by currency
    const calcularTotalesPorMoneda = (transacciones, campo = 'monto_transaccion') => {
      return transacciones.reduce((totales, item) => {
        const moneda = item.moneda;
        const monto = item[campo] || item.monto || 0;
        
        if (!totales[moneda]) {
          totales[moneda] = 0;
        }
        totales[moneda] += monto;
        return totales;
      }, {});
    };

    // Get recent activity (last 5 of each type)
    const actividadRecienteIngresos = await Transaction.find({
      tipo_transaccion: 'ingreso'
    })
    .sort({ createdAt: -1 })
    .limit(5);

    const actividadRecienteEgresos = await Transaction.find({
      tipo_transaccion: 'egreso'
    })
    .sort({ createdAt: -1 })
    .limit(5);

    const actividadRecienteDepositos = await Deposit.find({})
      .populate('gasto_referencia_id')
      .sort({ createdAt: -1 })
      .limit(5);

    // Build response
    const dashboard = {
      resumen_mensual: {
        mes: now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        periodo: {
          inicio: startOfMonth.toISOString(),
          fin: endOfMonth.toISOString()
        },
        ingresos: {
          cantidad: ingresos.length,
          totales_por_moneda: calcularTotalesPorMoneda(ingresos),
          ultimo_codigo: ingresos.length > 0 ? ingresos[ingresos.length - 1].codigo : null
        },
        egresos: {
          cantidad: egresos.length,
          totales_por_moneda: calcularTotalesPorMoneda(egresos),
          ultimo_codigo: egresos.length > 0 ? egresos[egresos.length - 1].codigo : null
        },
        depositos: {
          cantidad: depositos.length,
          totales_por_moneda: calcularTotalesPorMoneda(depositos, 'monto'),
          ultimo_codigo: depositos.length > 0 ? depositos[depositos.length - 1].codigo : null
        }
      },
      actividad_reciente: {
        ingresos: actividadRecienteIngresos.map(item => ({
          codigo: item.codigo,
          descripcion: item.descripcion_transaccion,
          monto: item.monto_transaccion,
          moneda: item.moneda,
          estado: item.estado,
          fecha: item.fecha_transaccion,
          creado: item.createdAt
        })),
        egresos: actividadRecienteEgresos.map(item => ({
          codigo: item.codigo,
          descripcion: item.descripcion_transaccion,
          monto: item.monto_transaccion,
          moneda: item.moneda,
          estado: item.estado,
          fecha: item.fecha_transaccion,
          creado: item.createdAt
        })),
        depositos: actividadRecienteDepositos.map(item => ({
          codigo: item.codigo,
          descripcion: item.descripcion,
          monto: item.monto,
          moneda: item.moneda,
          estado: item.estado,
          destinatario: item.destinatario,
          tipo_deposito: item.tipo_deposito,
          fecha: item.fecha_deposito,
          creado: item.createdAt,
          transaccion_relacionada: item.gasto_referencia_id ? {
            codigo: item.gasto_referencia_id.codigo,
            descripcion: item.gasto_referencia_id.descripcion_transaccion
          } : null
        }))
      },
      estadisticas_generales: {
        total_ingresos_historico: await Transaction.countDocuments({ tipo_transaccion: 'ingreso' }),
        total_egresos_historico: await Transaction.countDocuments({ tipo_transaccion: 'egreso' }),
        total_depositos_historico: await Deposit.countDocuments({}),
        ultima_actualizacion: new Date().toISOString()
      }
    };

    res.status(200).json({
      success: true,
      data: dashboard
    });

  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getDashboardSummary
};