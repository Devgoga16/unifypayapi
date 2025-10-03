const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Public
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ id_transaccion: req.params.id });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get transaction by codigo
// @route   GET /api/transactions/codigo/:codigo
// @access  Public
const getTransactionByCodigo = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ codigo: req.params.codigo });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: `Transaction with codigo '${req.params.codigo}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Public
const createTransaction = async (req, res) => {
  try {
    // Generate unique ID if not provided
    if (!req.body.id_transaccion) {
      const { v4: uuidv4 } = await import('uuid');
      req.body.id_transaccion = uuidv4();
    }

    // Generate codigo based on tipo_transaccion
    if (!req.body.codigo && req.body.tipo_transaccion) {
      req.body.codigo = await Transaction.generateNextCode(req.body.tipo_transaccion);
    }

    // Handle file upload if present
    let transactionData = { ...req.body };

    // Process file if included in request
    if (req.body.archivo) {
      // Validate file format
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/plain'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      try {
        // Extract file info from base64 data URL
        const matches = req.body.archivo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return res.status(400).json({ 
            success: false,
            error: 'Formato de archivo inválido. Debe ser base64.' 
          });
        }
        
        const mimeType = matches[1];
        const base64Data = matches[2];
        
        // Validate MIME type
        if (!allowedTypes.includes(mimeType)) {
          return res.status(400).json({ 
            success: false,
            error: 'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, PDF, TXT' 
          });
        }
        
        // Calculate file size
        const fileSize = Buffer.from(base64Data, 'base64').length;
        if (fileSize > maxSize) {
          return res.status(400).json({ 
            success: false,
            error: 'El archivo es muy grande. Máximo 5MB permitido.' 
          });
        }
        
        transactionData.archivo_adjunto = base64Data;
        transactionData.archivo_tipo = mimeType;
        transactionData.archivo_tamaño = fileSize;
        transactionData.archivo_nombre = req.body.archivo_nombre || `archivo_${Date.now()}`;
        
        // Remove the original archivo field
        delete transactionData.archivo;
        
      } catch (fileError) {
        return res.status(400).json({ 
          success: false,
          error: 'Error procesando el archivo: ' + fileError.message 
        });
      }
    }

    const transaction = await Transaction.create(transactionData);
    
    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${duplicateField} already exists`
      });
    }
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Public
const updateTransaction = async (req, res) => {
  try {
    // Remove codigo from update data to prevent manual changes
    const updateData = { ...req.body };
    delete updateData.codigo;
    
    // Handle file upload if present
    if (req.body.archivo) {
      // Validate file format
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/plain'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      try {
        // Extract file info from base64 data URL
        const matches = req.body.archivo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return res.status(400).json({ 
            success: false,
            error: 'Formato de archivo inválido. Debe ser base64.' 
          });
        }
        
        const mimeType = matches[1];
        const base64Data = matches[2];
        
        // Validate MIME type
        if (!allowedTypes.includes(mimeType)) {
          return res.status(400).json({ 
            success: false,
            error: 'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, PDF, TXT' 
          });
        }
        
        // Calculate file size
        const fileSize = Buffer.from(base64Data, 'base64').length;
        if (fileSize > maxSize) {
          return res.status(400).json({ 
            success: false,
            error: 'El archivo es muy grande. Máximo 5MB permitido.' 
          });
        }
        
        updateData.archivo_adjunto = base64Data;
        updateData.archivo_tipo = mimeType;
        updateData.archivo_tamaño = fileSize;
        updateData.archivo_nombre = req.body.archivo_nombre || `archivo_${Date.now()}`;
        
        // Remove the original archivo field
        delete updateData.archivo;
        
      } catch (fileError) {
        return res.status(400).json({ 
          success: false,
          error: 'Error procesando el archivo: ' + fileError.message 
        });
      }
    }
    
    const transaction = await Transaction.findOneAndUpdate(
      { id_transaccion: req.params.id },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Public
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ id_transaccion: req.params.id });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get income transactions
// @route   GET /api/transactions/ingresos
// @access  Public
const getIncomeTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ tipo_transaccion: 'ingreso' });
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get expense transactions
// @route   GET /api/transactions/egresos
// @access  Public
const getExpenseTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ tipo_transaccion: 'egreso' });
    console.log(transactions);
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  getTransactionByCodigo,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getIncomeTransactions,
  getExpenseTransactions
};