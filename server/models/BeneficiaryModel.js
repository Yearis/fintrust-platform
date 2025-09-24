const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide beneficiary name'],
    trim: true,
    maxlength: [100, 'Beneficiary name cannot be more than 100 characters']
  },
  walletAddress: {
    type: String,
    required: [true, 'Please provide wallet address'],
    unique: true,
    match: [
      /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
      'Please provide a valid Solana wallet address'
    ]
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: [true, 'Please specify the associated NGO']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Beneficiary', beneficiarySchema);