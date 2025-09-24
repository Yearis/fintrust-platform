const express = require('express');
const {
  getPublicLedger,
} = require('../controllers/publicController');

const router = express.Router();

router.route('/ledger').get(getPublicLedger);

module.exports = router;
