const Deposit = require('../models/Deposit');
const Transaction = require('../models/Transaction');

// @desc    Get all deposits
// @route   GET /api/deposits
// @access  Public
const getDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find().populate('gasto_referencia_id');
    res.status(200).json({
      success: true,
      count: deposits.length,
      data: deposits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single deposit
// @route   GET /api/deposits/:id
// @access  Public
const getDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findOne({ id_deposito: req.params.id }).populate('gasto_referencia_id');
    
    if (!deposit) {
      return res.status(404).json({
        success: false,
        error: 'Deposit not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deposit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get deposit by codigo
// @route   GET /api/deposits/codigo/:codigo
// @access  Public
const getDepositByCodigo = async (req, res) => {
  try {
    const deposit = await Deposit.findOne({ codigo: req.params.codigo }).populate('gasto_referencia_id');
    
    if (!deposit) {
      return res.status(404).json({
        success: false,
        error: `Deposit with codigo '${req.params.codigo}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: deposit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new deposit
// @route   POST /api/deposits
// @access  Public
const createDeposit = async (req, res) => {
  try {
    // Generate unique ID if not provided
    if (!req.body.id_deposito) {
      const { v4: uuidv4 } = await import('uuid');
      req.body.id_deposito = uuidv4();
    }

    // Generate codigo if not provided
    if (!req.body.codigo) {
      req.body.codigo = await Deposit.generateNextCode();
    }

    // Validate transaction reference if provided
    if (req.body.gasto_referencia_id) {
      const referencedTransaction = await Transaction.findById(req.body.gasto_referencia_id);
      if (!referencedTransaction) {
        return res.status(400).json({
          success: false,
          error: 'Referenced transaction not found'
        });
      }
    }

    // Handle file upload if present (comprobante de pago)
    let depositData = { ...req.body };

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
        
        depositData.archivo_adjunto = base64Data;
        depositData.archivo_tipo = mimeType;
        depositData.archivo_tamaño = fileSize;
        depositData.archivo_nombre = req.body.archivo_nombre || `comprobante_${Date.now()}`;
        
        // Remove the original archivo field
        delete depositData.archivo;
        
      } catch (fileError) {
        return res.status(400).json({ 
          success: false,
          error: 'Error procesando el archivo: ' + fileError.message 
        });
      }
    }

    const deposit = await Deposit.create(depositData);
    
    // Populate the reference before sending response
    await deposit.populate('gasto_referencia_id');
    
    res.status(201).json({
      success: true,
      data: deposit
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

// @desc    Update deposit
// @route   PUT /api/deposits/:id
// @access  Public
const updateDeposit = async (req, res) => {
  try {
    // Remove codigo from update data to prevent manual changes
    let updateData = { ...req.body };
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
        updateData.archivo_nombre = req.body.archivo_nombre || `comprobante_${Date.now()}`;
        
        // Remove the original archivo field
        delete updateData.archivo;
        
      } catch (fileError) {
        return res.status(400).json({ 
          success: false,
          error: 'Error procesando el archivo: ' + fileError.message 
        });
      }
    }
    
    const deposit = await Deposit.findOneAndUpdate(
      { id_deposito: req.params.id },
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('gasto_referencia_id');

    if (!deposit) {
      return res.status(404).json({
        success: false,
        error: 'Deposit not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deposit
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete deposit
// @route   DELETE /api/deposits/:id
// @access  Public
const deleteDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findOneAndDelete({ id_deposito: req.params.id });

    if (!deposit) {
      return res.status(404).json({
        success: false,
        error: 'Deposit not found'
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

module.exports = {
  getDeposits,
  getDeposit,
  getDepositByCodigo,
  createDeposit,
  updateDeposit,
  deleteDeposit
};