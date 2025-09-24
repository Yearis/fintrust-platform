const Donation = require('../models/DonationModel');
const asyncHandler = require('../middleware/async');

// @desc      Get public ledger of donations
// @route     GET /api/v1/public/ledger
// @access    Public
exports.getPublicLedger = asyncHandler(async (req, res, next) => {
  const donations = await Donation.find().populate('donor', 'name').populate('ngo', 'name');

  res.status(200).json({
    success: true,
    count: donations.length,
    data: donations,
  });
});
