const express = require('express');
const { getDashboardSummary } = require('../controllers/dashboardController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardSummary:
 *       type: object
 *       properties:
 *         resumen_mensual:
 *           type: object
 *           properties:
 *             mes:
 *               type: string
 *               example: "octubre 2025"
 *             periodo:
 *               type: object
 *               properties:
 *                 inicio:
 *                   type: string
 *                   format: date-time
 *                 fin:
 *                   type: string
 *                   format: date-time
 *             ingresos:
 *               type: object
 *               properties:
 *                 cantidad:
 *                   type: number
 *                   example: 15
 *                 totales_por_moneda:
 *                   type: object
 *                   example: { "PEN": 12500.50, "USD": 3200.00 }
 *                 ultimo_codigo:
 *                   type: string
 *                   example: "IN015"
 *             egresos:
 *               type: object
 *               properties:
 *                 cantidad:
 *                   type: number
 *                   example: 8
 *                 totales_por_moneda:
 *                   type: object
 *                   example: { "PEN": 5200.30, "USD": 800.00 }
 *                 ultimo_codigo:
 *                   type: string
 *                   example: "EX008"
 *             depositos:
 *               type: object
 *               properties:
 *                 cantidad:
 *                   type: number
 *                   example: 5
 *                 totales_por_moneda:
 *                   type: object
 *                   example: { "PEN": 8500.00, "EUR": 1200.00 }
 *                 ultimo_codigo:
 *                   type: string
 *                   example: "DE005"
 *         actividad_reciente:
 *           type: object
 *           properties:
 *             ingresos:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo:
 *                     type: string
 *                     example: "IN015"
 *                   descripcion:
 *                     type: string
 *                     example: "Venta de productos"
 *                   monto:
 *                     type: number
 *                     example: 1500.00
 *                   moneda:
 *                     type: string
 *                     example: "PEN"
 *                   estado:
 *                     type: string
 *                     example: "confirmada"
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                   creado:
 *                     type: string
 *                     format: date-time
 *             egresos:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo:
 *                     type: string
 *                     example: "EX008"
 *                   descripcion:
 *                     type: string
 *                     example: "Pago de servicios"
 *                   monto:
 *                     type: number
 *                     example: 250.00
 *                   moneda:
 *                     type: string
 *                     example: "PEN"
 *                   estado:
 *                     type: string
 *                     example: "pendiente"
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                   creado:
 *                     type: string
 *                     format: date-time
 *             depositos:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo:
 *                     type: string
 *                     example: "DE005"
 *                   descripcion:
 *                     type: string
 *                     example: "Depósito bancario"
 *                   monto:
 *                     type: number
 *                     example: 2000.00
 *                   moneda:
 *                     type: string
 *                     example: "PEN"
 *                   estado:
 *                     type: string
 *                     example: "confirmado"
 *                   destinatario:
 *                     type: string
 *                     example: "Juan Pérez"
 *                   tipo_deposito:
 *                     type: string
 *                     example: "Transferencia"
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                   creado:
 *                     type: string
 *                     format: date-time
 *                   transaccion_relacionada:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       codigo:
 *                         type: string
 *                         example: "IN012"
 *                       descripcion:
 *                         type: string
 *                         example: "Venta relacionada"
 *         estadisticas_generales:
 *           type: object
 *           properties:
 *             total_ingresos_historico:
 *               type: number
 *               example: 150
 *             total_egresos_historico:
 *               type: number
 *               example: 89
 *             total_depositos_historico:
 *               type: number
 *               example: 45
 *             ultima_actualizacion:
 *               type: string
 *               format: date-time
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     description: |
 *       Get a comprehensive dashboard summary including:
 *       - Current month totals for income, expenses, and deposits (by currency)
 *       - Recent activity (last 5 records of each type)
 *       - General statistics and counters
 *       - Transaction codes and relationships
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DashboardSummary'
 *       500:
 *         description: Server error
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
 *                   example: "Internal server error"
 */
router.route('/').get(getDashboardSummary);

module.exports = router;