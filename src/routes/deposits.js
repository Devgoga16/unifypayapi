const express = require('express');
const {
  getDeposits,
  getDeposit,
  getDepositByCodigo,
  createDeposit,
  updateDeposit,
  deleteDeposit
} = require('../controllers/depositController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Deposit:
 *       type: object
 *       required:
 *         - monto
 *         - moneda
 *         - destinatario
 *         - tipo_deposito
 *         - descripcion
 *       properties:
 *         id_deposito:
 *           type: string
 *           description: Unique deposit identifier (auto-generated if not provided)
 *         codigo:
 *           type: string
 *           description: Sequential code (DE001, DE002...) - auto-generated
 *           example: "DE001"
 *           readOnly: true
 *         monto:
 *           type: number
 *           minimum: 0
 *           description: Deposit amount
 *         moneda:
 *           type: string
 *           enum: [PEN, USD, EUR]
 *           description: Currency
 *         fecha_deposito:
 *           type: string
 *           format: date-time
 *           description: Deposit date in ISO 8601 format
 *         destinatario:
 *           type: string
 *           description: Recipient name
 *         banco:
 *           type: string
 *           description: Bank name for bank deposits
 *         numero_cuenta:
 *           type: string
 *           description: Account number for bank deposits
 *         tipo_deposito:
 *           type: string
 *           enum: [Transferencia, Efectivo, Cheque, Depósito en ventanilla]
 *           description: Deposit type
 *         estado:
 *           type: string
 *           enum: [confirmado, pendiente, rechazado]
 *           description: Deposit status
 *         descripcion:
 *           type: string
 *           description: Deposit description
 *         documento_respaldo:
 *           type: string
 *           description: Supporting document
 *         notas:
 *           type: string
 *           description: Optional notes
 *         gasto_referencia_id:
 *           type: string
 *           description: Reference to a Transaction ObjectId (will be populated with full transaction data in responses)
 *           example: "6507d1234567890abcdef123"
 */

/**
 * @swagger
 * /api/deposits:
 *   get:
 *     summary: Get all deposits
 *     tags: [Deposits]
 *     responses:
 *       200:
 *         description: List of all deposits
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
 *                     $ref: '#/components/schemas/Deposit'
 */
router.route('/').get(getDeposits);

/**
 * @swagger
 * /api/deposits/codigo/{codigo}:
 *   get:
 *     summary: Get deposit by codigo
 *     tags: [Deposits]
 *     description: Retrieve a specific deposit using its generated codigo (DE001, DE002, etc.)
 *     parameters:
 *       - in: path
 *         name: codigo
 *         schema:
 *           type: string
 *         required: true
 *         description: Deposit codigo (e.g., DE001)
 *         example: "DE001"
 *     responses:
 *       200:
 *         description: Deposit found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Deposit'
 *       404:
 *         description: Deposit not found
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
 *                   example: "Deposit with codigo 'DE001' not found"
 *       500:
 *         description: Server error
 */
router.route('/codigo/:codigo').get(getDepositByCodigo);

/**
 * @swagger
 * /api/deposits:
 *   post:
 *     summary: Create a new deposit
 *     tags: [Deposits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deposit'
 *     responses:
 *       201:
 *         description: Deposit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Deposit'
 *       400:
 *         description: Bad request
 */
router.route('/').post(createDeposit);

/**
 * @swagger
 * /api/deposits/{id}:
 *   get:
 *     summary: Get a deposit by ID
 *     tags: [Deposits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Deposit ID
 *     responses:
 *       200:
 *         description: Deposit found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Deposit'
 *       404:
 *         description: Deposit not found
 */
router.route('/:id').get(getDeposit);

/**
 * @swagger
 * /api/deposits/{id}:
 *   put:
 *     summary: Update a deposit
 *     tags: [Deposits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Deposit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deposit'
 *     responses:
 *       200:
 *         description: Deposit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Deposit'
 *       404:
 *         description: Deposit not found
 */
router.route('/:id').put(updateDeposit);

/**
 * @swagger
 * /api/deposits/{id}:
 *   delete:
 *     summary: Delete a deposit
 *     tags: [Deposits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Deposit ID
 *     responses:
 *       200:
 *         description: Deposit deleted successfully
 *       404:
 *         description: Deposit not found
 */
router.route('/:id').delete(deleteDeposit);

module.exports = router;