import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const BeneficiaryWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // NOTE: You will need to create this endpoint on your server
        const res = await apiClient.get('/beneficiary/wallet/me'); 
        setWallet(res.data.data);
      } catch (err) {
        console.error("Could not fetch beneficiary wallet", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading Your Wallet...</div>;
  }
  
  if (!wallet) {
    return <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">Could not load wallet data. Please ensure you are logged in as a beneficiary.</div>
  }

  return (
    <div className="space-y-8">
      {/* Wallet Balance Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-fintrust-dark mb-4">Your Digital Wallet</h2>
        <div className="text-center">
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-4xl font-bold text-fintrust-green mt-1">₹{wallet.balance?.toLocaleString() || 0}</p>
        </div>
      </div>
      
      {/* Transaction History Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-fintrust-dark mb-4">Transaction History</h2>
        <div className="space-y-4">
          {wallet.transactions?.length > 0 ? wallet.transactions.map(tx => (
            <div key={tx._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Funds Received from {tx.user?.name}</p>
                <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
              </div>
              <p className="font-bold text-green-600">+ ₹{tx.amount}</p>
            </div>
          )) : (
            <p className="text-center p-6 text-gray-500">You have no transactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryWallet;