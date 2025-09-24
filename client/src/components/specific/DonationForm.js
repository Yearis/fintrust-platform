import React, { useState } from 'react';
import Button from '../common/Button';

const DonationForm = ({ ngos, handleDonate }) => {
  const [selectedNgo, setSelectedNgo] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    console.log('Submit button clicked!'); // Add this line for debugging
    e.preventDefault();
    if (selectedNgo && amount) {
      handleDonate({ ngoId: selectedNgo, amount: Number(amount) });
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="donation-form">
      <div className="form-group">
        <label htmlFor="ngo-select">Select NGO</label>
        <select
          id="ngo-select"
          className="form-input"
          value={selectedNgo}
          onChange={(e) => setSelectedNgo(e.target.value)}
        >
          <option value="" disabled>
            Choose an NGO
          </option>
          {ngos.map((ngo) => (
            <option key={ngo._id} value={ngo._id}>
              {ngo.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="amount-input">Amount</label>
        <input
          id="amount-input"
          type="number"
          className="form-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>
      <Button type="submit">Donate</Button>
    </form>
  );
};

export default DonationForm;