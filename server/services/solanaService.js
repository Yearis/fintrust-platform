const { Connection, PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
require('dotenv').config();

let platformKeypair;

try {
  const secretKeyString = process.env.SOLANA_PLATFORM_SECRET_KEY;
  if (!secretKeyString) {
    throw new Error("SOLANA_PLATFORM_SECRET_KEY not found in .env file.");
  }
  
  const secretKeyBytes = bs58.decode(secretKeyString);
  platformKeypair = Keypair.fromSecretKey(secretKeyBytes);

  console.log(`✅ Solana platform wallet loaded successfully. Public Key: ${platformKeypair.publicKey.toBase58()}`);

} catch (error) {
  console.error("❌ FATAL ERROR: Could not load the platform's Solana keypair.", error.message);
  platformKeypair = null;
}

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

const recordDonation = async (donationData) => {
  if (!platformKeypair) {
    console.error("Cannot process Solana transaction because the platform keypair is invalid or missing.");
    return { success: false, error: "Platform wallet is not configured correctly on the server." };
  }
    
  try {
    const { amount, ngoWalletAddress } = donationData;
    const ngoPublicKey = new PublicKey(ngoWalletAddress);
    
    const amountInSol = Number(amount) * 0.00007;
    const lamports = Math.round(amountInSol * LAMPORTS_PER_SOL);

    if (lamports <= 0) {
      throw new Error("Donation amount is too small to process on the blockchain.");
    }
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: platformKeypair.publicKey,
        toPubkey: ngoPublicKey,
        lamports: lamports
      })
    );
    
    const signature = await sendAndConfirmTransaction(connection, transaction, [platformKeypair]);
    
    console.log(`SUCCESS! Donation recorded on Solana. Signature: ${signature}`);
    return { success: true, transactionHash: signature };
    
  } catch (error) {
    console.error('SOLANA TRANSACTION ERROR:', error.message);
    const friendlyError = error.message.includes("is invalid") ? "The recipient NGO's wallet address is invalid." : error.message;
    return { success: false, error: friendlyError };
  }
};

module.exports = { recordDonation };