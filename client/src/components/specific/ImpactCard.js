import React from 'react';

const ImpactCard = ({ donation }) => {
  // Destructure the donation object correctly
  const { amount, ngo, createdAt, transactionHash } = donation;

  return (
    <div className="card" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div className="card-body">
        {/* Access the nested ngo.name property */}
        <h5 className="card-title">Donation to {ngo?.name || 'an NGO'}</h5>
        <p className="card-text">Amount: {amount}</p>
        {/* Use the createdAt property from the database */}
        <p className="card-text">Date: {new Date(createdAt).toLocaleDateString()}</p>
        
        {/* The explorer link is already correct */}
        <a
          href={`https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Solana Explorer
        </a>
      </div>
    </div>
  );
};

export default ImpactCard;