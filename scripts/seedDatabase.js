const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, Timestamp } = require("firebase/firestore");
const path = require("path");
const fs = require("fs");

// Read .env file directly
const envPath = path.resolve(__dirname, "../.env");
let envConfig = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...values] = trimmed.split("=");
      envConfig[key.trim()] = values.join("=").trim();
    }
  });
}

const firebaseConfig = {
  apiKey: envConfig.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: envConfig.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: envConfig.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: envConfig.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envConfig.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: envConfig.EXPO_PUBLIC_FIREBASE_APP_ID,
};

console.log("Connecting to Firebase project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
  const sampleUserId = "sample_user_01";
  const sampleWalletId = "sample_wallet_01";
  const sampleTransactionId = "sample_transaction_01";

  try {
    // 1. Users collection
    console.log("Creating/updating 'users' collection document...");
    await setDoc(doc(db, "users", sampleUserId), {
      uid: sampleUserId,
      name: "Demo User",
      email: "demo@expensetracker.app",
      image: null,
      createdAt: Timestamp.now(),
    });
    console.log("✔ 'users' document created (users/" + sampleUserId + ")");

    // 2. Wallets collection
    console.log("Creating/updating 'wallets' collection document...");
    await setDoc(doc(db, "wallets", sampleWalletId), {
      id: sampleWalletId,
      name: "Main Cash Wallet",
      amount: 1500,
      totalIncome: 2000,
      totalExpenses: 500,
      image: null,
      uid: sampleUserId,
      created: Timestamp.now(),
    });
    console.log("✔ 'wallets' document created (wallets/" + sampleWalletId + ")");

    // 3. Transactions collection
    console.log("Creating/updating 'transactions' collection document...");
    await setDoc(doc(db, "transactions", sampleTransactionId), {
      id: sampleTransactionId,
      type: "expense",
      amount: 45.5,
      category: "groceries",
      description: "Weekly supermarket shopping",
      date: Timestamp.now(),
      image: null,
      uid: sampleUserId,
      walletId: sampleWalletId,
    });
    console.log("✔ 'transactions' document created (transactions/" + sampleTransactionId + ")");

    console.log("\n All database collections ('users', 'wallets', 'transactions') created successfully in Firestore!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating database objects:", error);
    process.exit(1);
  }
}

seedDatabase();

