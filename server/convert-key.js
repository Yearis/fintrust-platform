const bs58 = require('bs58');

// --- STEP 1: Paste your private key string from Phantom in the quotes below ---
const privateKeyString = 'AHPGTMopmyc1UaYiTyrbKjqZmPD2kdpsgHsFW9sPmjpY';


// --- Don't change anything below this line ---
try {
  if (privateKeyString === 'YOUR_NEW_PRIVATE_KEY_STRING') {
    throw new Error("Please replace 'YOUR_NEW_PRIVATE_KEY_STRING' with your actual key from Phantom.");
  }
  const decoded = bs58.decode(privateKeyString);
  const keyArray = Array.from(decoded);
  console.log('--- COPY THE ARRAY BELOW ---');
  console.log(JSON.stringify(keyArray));
  console.log('--- END OF ARRAY ---');
} catch (error) {
  console.error("\n--- ERROR ---");
  console.error("Could not decode the private key. Please ensure you have copied the entire string from Phantom correctly.");
  console.error("Error details:", error.message);
  console.error("--- END ERROR ---\n");
}