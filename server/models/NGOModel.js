const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide NGO name'],
    trim: true,
    maxlength: [100, 'NGO name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide NGO description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  walletAddress: {
    type: String,
    required: [true, 'Please provide wallet address'],
    unique: true,
    match: [
      /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
      'Please provide a valid Solana wallet address'
    ]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NGO', ngoSchema);