import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const PublicLedger = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // --- FIX 1: Changed the URL to the correct server endpoint ---
        const res = await apiClient.get('/donations');
        setDonations(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading Public Ledger...</div>;
  }

  // --- FIX 2: Added Tailwind CSS classes to style the card and table ---
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-fintrust-dark mb-4">Public Transaction Ledger</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Donor</th>
              <th className="p-3">NGO</th>
              <th className="p-3">Amount (INR)</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? donations.map((donation) => (
              <tr key={donation._id} className="border-b">
                {/* Optional chaining ?. ensures it doesn't crash if donor is null */}
                <td className="p-3">{donation.user?.name || 'Anonymous'}</td>
                <td className="p-3">{donation.ngo?.name}</td>
                <td className="p-3">₹{donation.amount}</td>
                <td className="p-3">{new Date(donation.createdAt).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">No public donations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PublicLedger;