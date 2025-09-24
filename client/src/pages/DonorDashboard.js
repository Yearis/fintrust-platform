import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/apiClient';

const DonorDashboard = () => {
  const { user } = useAuth(); // We don't need logout here anymore
  const [ngos, setNgos] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({ totalDonated: 0, donationCount: 0 });
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [donationDetails, setDonationDetails] = useState(null);

  const fetchDonationsAndStats = useCallback(async () => {
    try {
      const res = await apiClient.get('/donations/my-donations');
      setDonations(res.data.data);
      const total = res.data.data.reduce((sum, d) => sum + d.amount, 0);
      const count = res.data.data.length;
      setStats({ totalDonated: total, donationCount: count });
    } catch (err) { 
      setError('Could not fetch donation history.'); 
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const ngosRes = await apiClient.get('/ngos');
        setNgos(ngosRes.data.data);
        await fetchDonationsAndStats();
      } catch (err) { 
        setError('Failed to load dashboard data.'); 
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [fetchDonationsAndStats]);

  const handleProceedToPayment = (event) => {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.currentTarget);
    const ngoId = formData.get("ngoId");
    const amount = formData.get("amount");

    if (!ngoId || !amount || amount <= 0) {
      return setError('Please select an NGO and enter a valid amount.');
    }
    setDonationDetails({ ngoId, amount });
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('Processing payment and recording on blockchain...');
    const formData = new FormData(event.currentTarget);
    const cardNumber = formData.get("cardNumber");

    try {
      const response = await apiClient.post('/payments/process-dummy', {
        ...donationDetails,
        cardNumber: cardNumber,
      });

      setStatusMessage(response.data.message);
      await fetchDonationsAndStats();
      
      setTimeout(() => {
        setShowPaymentForm(false);
        setDonationDetails(null);
        setStatusMessage('');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setStatusMessage('');
    } finally {
      setLoading(false);
    }
  };

  if (loading && donations.length === 0) {
    return <div className="text-center p-10">Loading Your Dashboard...</div>;
  }

  if (showPaymentForm) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <button onClick={() => { setShowPaymentForm(false); setError(''); }} className="text-indigo-600 hover:underline mb-4">
          &larr; Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold mb-2">Confirm Your Donation</h2>
        <p className="mb-1">To: <span className="font-semibold">{ngos.find(n => n._id === donationDetails.ngoId)?.name}</span></p>
        <p className="mb-4">Amount: <span className="font-semibold">₹{donationDetails.amount}</span></p>
        
        <form onSubmit={handlePaymentSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Test Card Number</label>
              <input type="text" name="cardNumber" placeholder="Enter any 16-digit number" required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full mt-6 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Processing...' : `Confirm Donation of ₹${donationDetails.amount}`}
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {statusMessage && <p className="mt-4 text-sm text-green-600">{statusMessage}</p>}
      </div>
    );
  }

  // --- THIS IS THE FIX ---
  // We wrap everything in a React Fragment: <> and </>
  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-indigo-600">₹{stats.totalDonated.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Total Donated</div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-indigo-600">{stats.donationCount}</div>
          <div className="text-sm text-gray-500 mt-1">Donations Made</div>
        </div>
      </div>

      {/* New Donation Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Make a New Donation</h2>
        <form onSubmit={handleProceedToPayment} className="space-y-4">
          <div>
            <label htmlFor="ngoId" className="block text-sm font-medium text-gray-700">Choose an NGO</label>
            <select name="ngoId" required defaultValue="" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="" disabled>Select an option</option>
              {ngos.map(ngo => <option key={ngo._id} value={ngo._id}>{ngo.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (INR)</label>
            <input type="number" name="amount" placeholder="e.g., 500" step="1" required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Proceed to Payment
          </button>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>
      </div>

      {/* Donation History Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Your Donation History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">NGO</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Blockchain Receipt</th>
              </tr>
            </thead>
            <tbody>
              {donations.length > 0 ? donations.map(d => (
                <tr key={d._id} className="border-b">
                  <td className="p-3">{d.ngo?.name}</td>
                  <td className="p-3">₹{d.amount}</td>
                  <td className="p-3">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 capitalize text-green-600 font-semibold">{d.status}</td>
                  <td className="p-3">
                    {d.transactionHash.startsWith('PENDING') ? 'Processing...' : 
                      <a href={`https://explorer.solana.com/tx/${d.transactionHash}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        View on Explorer
                      </a>
                    }
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">You have not made any donations yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DonorDashboard;