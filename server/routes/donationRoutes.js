const express = require('express');
const router = express.Router();
const {
  createDonation,
  getMyDonations,
  getAllDonations,
  getDonation
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllDonations)
  .post(protect, createDonation);

router.get('/my-donations', protect, getMyDonations);

router.route('/:id')
  .get(getDonation);

module.exports = router;