const express = require('express');
const router = express.Router();
const {
  getNgos,
  getNgo,
  createNgo
} = require('../controllers/ngoController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getNgos)
  .post(protect, createNgo);

router.route('/:id')
  .get(getNgo);

module.exports = router;