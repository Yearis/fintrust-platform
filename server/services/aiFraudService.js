const Donation = require('../models/DonationModel');

// --- AI Fraud Detection Simulation ---
const checkForFraud = async (user, amount) => {
  if (amount > 5000) {
    return { isFraudulent: true, reason: `Donation amount of ${amount} exceeds the typical limit.` };
  }
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const recentDonations = await Donation.countDocuments({
    user: user._id,
    createdAt: { $gte: fiveMinutesAgo }
  });
  if (recentDonations >= 3) {
    return { isFraudulent: true, reason: 'Multiple donations detected in a very short period.' };
  }
  return { isFraudulent: false, reason: null };
};

module.exports = { checkForFraud }; 
