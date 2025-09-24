const asyncHandler = require('express-async-handler');
const Donation = require('../models/DonationModel');
const NGO = require('../models/NGOModel');
const { recordDonation } = require('../services/solanaService');
const { checkForFraud } = require('../services/aiFraudService');

// This is our new "dummy" payment processor
const processDummyPayment = asyncHandler(async (req, res) => {
  const { amount, ngoId, cardNumber } = req.body;

  // --- 1. Simulate Payment Verification ---
  // For the demo, we accept any card number that is exactly 16 digits.
  // A real magic number check would be: if (cardNumber !== '4242424242424242')
  if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
    res.status(400);
    throw new Error('Invalid test card number. Please enter a 16-digit number.');
  }

  // --- 2. AI Fraud Check ---
  const fraudCheck = await checkForFraud(req.user, amount);
  if (fraudCheck.isFraudulent) {
    res.status(400);
    throw new Error(`Fraudulent activity detected: ${fraudCheck.reason}`);
  }

  const ngo = await NGO.findById(ngoId);
  if (!ngo || !ngo.walletAddress) {
      res.status(404);
      throw new Error('NGO not found or is missing a wallet address.');
  }

  // --- 3. Record on Solana and in Database ---
  try {
    const solanaResult = await recordDonation({
      amount,
      ngoWalletAddress: ngo.walletAddress,
      donorName: req.user.name,
    });

    if (!solanaResult.success) {
      throw new Error(solanaResult.error || 'Solana transaction failed.');
    }

    const donation = await Donation.create({
      user: req.user._id,
      ngo: ngoId,
      amount,
      transactionHash: solanaResult.transactionHash,
      status: 'completed',
    });

    const populatedDonation = await Donation.findById(donation._id).populate('ngo', 'name');

    res.status(201).json({
      success: true,
      message: 'Payment accepted and donation recorded successfully!',
      data: populatedDonation,
    });

  } catch (error) {
    res.status(500);
    throw new Error(`Failed to finalize donation after payment: ${error.message}`);
  }
});

module.exports = { processDummyPayment };