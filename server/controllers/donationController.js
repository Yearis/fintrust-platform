const asyncHandler = require('express-async-handler');
const Donation = require('../models/DonationModel');
const NGO = require('../models/NGOModel');
const { recordDonation } = require('../services/solanaService');

// @desc    Create new donation
// @route   POST /api/donations
// @access  Private
const createDonation = asyncHandler(async (req, res) => {
  const { ngoId, amount, message } = req.body;

  if (!ngoId || !amount) {
    res.status(400);
    throw new Error('Please provide NGO ID and donation amount');
  }

  const ngo = await NGO.findById(ngoId);
  if (!ngo) {
    res.status(404);
    throw new Error('NGO not found');
  }

  if (!ngo.walletAddress) {
    res.status(500);
    throw new Error('Selected NGO is missing a wallet address.');
  }

  const donation = await Donation.create({
    user: req.user._id,
    ngo: ngoId,
    amount: amount,
    message: message || '',
    status: 'pending',
    transactionHash: `PENDING-${req.user._id}-${Date.now()}`,
  });

  try {
    const solanaResult = await recordDonation({
      amount: amount,
      ngoWalletAddress: ngo.walletAddress,
      donorName: req.user.name,
    });

    if (solanaResult.success) {
      donation.transactionHash = solanaResult.transactionHash;
      donation.status = 'completed';
      await donation.save();
      const populatedDonation = await Donation.findById(donation._id).populate('user', 'name email').populate('ngo', 'name');
      res.status(201).json({ success: true, data: populatedDonation, blockchain: { transactionHash: solanaResult.transactionHash, explorerUrl: solanaResult.explorerUrl } });
    } else {
      donation.status = 'failed';
      await donation.save();
      res.status(500).json({ success: false, message: 'Blockchain transaction failed', error: solanaResult.error });
    }
  } catch (error) {
    donation.status = 'failed';
    await donation.save();
    res.status(500);
    throw new Error(`Blockchain transaction error: ${error.message}`);
  }
});

// @desc    Get user's donations
// @route   GET /api/donations/my-donations
// @access  Private
const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ user: req.user._id }).populate('ngo', 'name description').sort({ createdAt: -1 });
  res.json({ success: true, count: donations.length, data: donations });
});

// @desc    Get all donations (for admin/transparency)
// @route   GET /api/donations
// @access  Public
const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ status: 'completed' }).populate('user', 'name').populate('ngo', 'name').sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, count: donations.length, data: donations });
});

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Public
const getDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate('user', 'name').populate('ngo', 'name description walletAddress');
  if (!donation) {
    res.status(404);
    throw new Error('Donation not found');
  }
  res.json({ success: true, data: donation });
});

module.exports = {
  createDonation,
  getMyDonations,
  getAllDonations,
  getDonation,
};