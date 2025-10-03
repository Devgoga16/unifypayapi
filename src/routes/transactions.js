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
 *         archivo_adjunto:
 *           type: string
 *           description: Base64 encoded file attachment (without data URL prefix)
 *         archivo_nombre:
 *           type: string
 *           description: Original filename of the attached file
 *         archivo_tipo:
 *           type: string
 *           description: MIME type of the attached file (image/jpeg, application/pdf, etc.)
 *         archivo_tamaño:
 *           type: number
 *           description: File size in bytes
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
 *     summary: Create a new transaction with optional file upload
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Transaction'
 *               - type: object
 *                 properties:
 *                   archivo:
 *                     type: string
 *                     description: Base64 data URL for file upload (data:mime/type;base64,content)
 *                     example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
 *                   archivo_nombre:
 *                     type: string
 *                     description: Original filename for upload
 *                     example: "recibo.jpg"
 *           examples:
 *             with_file:
 *               summary: Transaction with file attachment
 *               value:
 *                 descripcion_transaccion: "Pago de servicios"
 *                 monto_transaccion: 150.00
 *                 tipo_transaccion: "egreso"
 *                 moneda: "USD"
 *                 medio_pago: "tarjeta"
 *                 estado: "confirmada"
 *                 archivo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
 *                 archivo_nombre: "recibo_pago.jpg"
 *             without_file:
 *               summary: Transaction without file
 *               value:
 *                 descripcion_transaccion: "Venta de producto"
 *                 monto_transaccion: 100.00
 *                 tipo_transaccion: "ingreso"
 *                 moneda: "USD"
 *                 medio_pago: "efectivo"
 *                 estado: "confirmada"
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
 *         description: Bad request - Invalid file format, size too large, or missing required fields
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
 *                   examples:
 *                     invalid_file: "Formato de archivo inválido. Debe ser base64."
 *                     file_too_large: "El archivo es muy grande. Máximo 5MB permitido."
 *                     invalid_type: "Tipo de archivo no permitido. Solo se permiten: JPG, PNG, PDF, TXT"
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