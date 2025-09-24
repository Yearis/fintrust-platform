const asyncHandler = require('express-async-handler');
const NGO = require('../models/NGOModel');

// @desc    Get all NGOs
// @route   GET /api/ngos
// @access  Public
const getNgos = asyncHandler(async (req, res) => {
  const ngos = await NGO.find({}).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: ngos.length,
    data: ngos
  });
});

// @desc    Get single NGO
// @route   GET /api/ngos/:id
// @access  Public
const getNgo = asyncHandler(async (req, res) => {
  const ngo = await NGO.findById(req.params.id);

  if (!ngo) {
    res.status(404);
    throw new Error('NGO not found');
  }

  res.json({
    success: true,
    data: ngo
  });
});

// @desc    Create new NGO
// @route   POST /api/ngos
// @access  Private (Admin only - simplified for demo)
const createNgo = asyncHandler(async (req, res) => {
  const { name, description, walletAddress } = req.body;

  if (!name || !description || !walletAddress) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const ngo = await NGO.create({
    name,
    description,
    walletAddress
  });

  res.status(201).json({
    success: true,
    data: ngo
  });
});

module.exports = {
  getNgos,
  getNgo,
  createNgo
};