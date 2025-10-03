const express = require('express');
const {
  getBalance,
  getAllBalances,
  getMovimientosRecientes,
  getResumenBalance
} = require('../controllers/balanceController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Balance:
 *       type: object
 *       properties:
 *         saldo_actual:
 *           type: number
 *           description: Current account balance
 *           example: 1250.75
 *         moneda:
 *           type: string
 *           enum: [USD, EUR, PEN, MXN, COP]
 *           description: Currency type
 *           example: "USD"
 *         total_ingresos:
 *           type: number
 *           description: Total income transactions
 *           example: 2500.00
 *         total_egresos:
 *           type: number
 *           description: Total expense transactions
 *           example: 750.25
 *         total_depositos:
 *           type: number
 *           description: Total deposits
 *           example: 500.00
 *         ultimo_movimiento:
 *           type: string
 *           format: date-time
 *           description: Date of last movement
 *           example: "2024-01-15T10:30:00Z"
 *     MovimientoReciente:
 *       type: object
 *       properties:
 *         codigo:
 *           type: string
 *           description: Movement code
 *           example: "IN001"
 *         descripcion:
 *           type: string
 *           description: Movement description
 *           example: "Venta de producto"
 *         monto:
 *           type: number
 *           description: Movement amount
 *           example: 150.00
 *         tipo:
 *           type: string
 *           enum: [ingreso, egreso, deposito]
 *           description: Movement type
 *           example: "ingreso"
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Movement date
 *           example: "2024-01-15T10:30:00Z"
 *         categoria:
 *           type: string
 *           enum: [transaccion, deposito]
 *           description: Movement category
 *           example: "transaccion"
 *     Estadisticas:
 *       type: object
 *       properties:
 *         transacciones:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 enum: [ingreso, egreso]
 *               cantidad:
 *                 type: number
 *               monto_total:
 *                 type: number
 *               monto_promedio:
 *                 type: number
 *         depositos:
 *           type: object
 *           properties:
 *             cantidad:
 *               type: number
 *             monto_total:
 *               type: number
 *             monto_promedio:
 *               type: number
 */

/**
 * @swagger
 * /api/balance:
 *   get:
 *     summary: Get balance for all currencies
 *     tags: [Balance]
 *     description: Retrieve current balance information for all supported currencies
 *     responses:
 *       200:
 *         description: Balance information for all currencies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Balance'
 *                 fecha_consulta:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Server error
 */
router.route('/').get(getAllBalances);

/**
 * @swagger
 * /api/balance/{moneda}:
 *   get:
 *     summary: Get balance for specific currency
 *     tags: [Balance]
 *     description: Retrieve current balance information for a specific currency
 *     parameters:
 *       - in: path
 *         name: moneda
 *         required: true
 *         schema:
 *           type: string
 *           enum: [USD, EUR, PEN, MXN, COP]
 *         description: Currency code
 *         example: USD
 *     responses:
 *       200:
 *         description: Balance information for the specified currency
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Balance'
 *                 fecha_consulta:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid currency
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Moneda no válida. Permitidas: USD, EUR, PEN, MXN, COP"
 *       500:
 *         description: Server error
 */
router.route('/:moneda').get(getBalance);

/**
 * @swagger
 * /api/balance/{moneda}/movimientos:
 *   get:
 *     summary: Get recent movements for specific currency
 *     tags: [Balance]
 *     description: Retrieve recent transactions and deposits for a specific currency
 *     parameters:
 *       - in: path
 *         name: moneda
 *         required: true
 *         schema:
 *           type: string
 *           enum: [USD, EUR, PEN, MXN, COP]
 *         description: Currency code
 *         example: USD
 *       - in: query
 *         name: limite
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of movements to retrieve
 *         example: 20
 *     responses:
 *       200:
 *         description: List of recent movements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MovimientoReciente'
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
router.route('/:moneda/movimientos').get(getMovimientosRecientes);

/**
 * @swagger
 * /api/balance/{moneda}/resumen:
 *   get:
 *     summary: Get balance summary with recent movements and statistics
 *     tags: [Balance]
 *     description: Retrieve comprehensive balance information including recent movements and statistics
 *     parameters:
 *       - in: path
 *         name: moneda
 *         required: true
 *         schema:
 *           type: string
 *           enum: [USD, EUR, PEN, MXN, COP]
 *         description: Currency code
 *         example: USD
 *       - in: query
 *         name: limite
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 5
 *         description: Number of recent movements to include
 *         example: 10
 *     responses:
 *       200:
 *         description: Comprehensive balance summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       $ref: '#/components/schemas/Balance'
 *                     movimientos_recientes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MovimientoReciente'
 *                     estadisticas:
 *                       $ref: '#/components/schemas/Estadisticas'
 *                     fecha_consulta:
 *                       type: string
 *                       format: date-time
 *             examples:
 *               resumen_completo:
 *                 summary: Complete balance summary
 *                 value:
 *                   success: true
 *                   data:
 *                     balance:
 *                       saldo_actual: 1250.75
 *                       moneda: "USD"
 *                       total_ingresos: 2500.00
 *                       total_egresos: 750.25
 *                       total_depositos: 500.00
 *                       ultimo_movimiento: "2024-01-15T10:30:00Z"
 *                     movimientos_recientes:
 *                       - codigo: "IN001"
 *                         descripcion: "Venta de producto"
 *                         monto: 150.00
 *                         tipo: "ingreso"
 *                         fecha: "2024-01-15T10:30:00Z"
 *                         categoria: "transaccion"
 *                     estadisticas:
 *                       transacciones:
 *                         - _id: "ingreso"
 *                           cantidad: 10
 *                           monto_total: 2500.00
 *                           monto_promedio: 250.00
 *                       depositos:
 *                         cantidad: 2
 *                         monto_total: 500.00
 *                         monto_promedio: 250.00
 *                     fecha_consulta: "2024-01-15T11:00:00Z"
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
router.route('/:moneda/resumen').get(getResumenBalance);

module.exports = router;