const express = require('express');
const {
  getTransactions,
  getTransaction,
  getTransactionByCodigo,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getIncomeTransactions,
  getExpenseTransactions
} = require('../controllers/transactionController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - descripcion_transaccion
 *         - monto_transaccion
 *         - tipo_transaccion
 *         - moneda
 *         - medio_pago
 *       properties:
 *         id_transaccion:
 *           type: string
 *           description: Unique transaction identifier (auto-generated if not provided)
 *         codigo:
 *           type: string
 *           description: Sequential code (IN001, IN002... for ingresos; EX001, EX002... for egresos) - auto-generated
 *           example: "IN001"
 *           readOnly: true
 *         descripcion_transaccion:
 *           type: string
 *           description: Transaction description
 *         monto_transaccion:
 *           type: number
 *           minimum: 0
 *           description: Transaction amount
 *         tipo_transaccion:
 *           type: string
 *           enum: [ingreso, egreso]
 *           description: Transaction type
 *         fecha_transaccion:
 *           type: string
 *           format: date-time
 *           description: Transaction date in ISO 8601 format
 *         moneda:
 *           type: string
 *           enum: [PEN, USD, EUR]
 *           description: Currency
 *         estado:
 *           type: string
 *           enum: [confirmada, pendiente, cancelada]
 *           description: Transaction status
 *         medio_pago:
 *           type: string
 *           description: Payment method
 *         referencia:
 *           type: string
 *           description: Optional reference
 *         notas:
 *           type: string
 *           description: Optional notes
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of all transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 */
router.route('/').get(getTransactions);

/**
 * @swagger
 * /api/transactions/ingresos:
 *   get:
 *     summary: Get all income transactions
 *     tags: [Transactions]
 *     description: Retrieve all transactions with tipo_transaccion = 'ingreso'
 *     responses:
 *       200:
 *         description: List of income transactions
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
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/ingresos').get(getIncomeTransactions);

/**
 * @swagger
 * /api/transactions/egresos:
 *   get:
 *     summary: Get all expense transactions
 *     tags: [Transactions]
 *     description: Retrieve all transactions with tipo_transaccion = 'egreso'
 *     responses:
 *       200:
 *         description: List of expense transactions
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
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/egresos').get(getExpenseTransactions);

/**
 * @swagger
 * /api/transactions/codigo/{codigo}:
 *   get:
 *     summary: Get transaction by codigo
 *     tags: [Transactions]
 *     description: Retrieve a specific transaction using its generated codigo (IN001, EX001, etc.)
 *     parameters:
 *       - in: path
 *         name: codigo
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction codigo (e.g., IN001, EX001)
 *         example: "IN001"
 *     responses:
 *       200:
 *         description: Transaction found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
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
 *                   example: "Transaction with codigo 'IN001' not found"
 *       500:
 *         description: Server error
 */
router.route('/codigo/:codigo').get(getTransactionByCodigo);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request
 */
router.route('/').post(createTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 */
router.route('/:id').get(getTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 */
router.route('/:id').put(updateTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 */
router.route('/:id').delete(deleteTransaction);

module.exports = router;