const express = require('express');
const router = express.Router();
const { processDummyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/process-dummy', protect, processDummyPayment);

module.exports = router;