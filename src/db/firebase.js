// Hybrid database layer: supports Firebase Firestore & LocalStorage fallbacks.
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { projectsData } from '../data/projectsData';

// Configurable Firebase settings
// In Vite, these can be set via import.meta.env.VITE_FIREBASE_API_KEY etc.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let db = null;
let isFirebaseActive = false;

// Check if we have complete Firebase credentials
const hasFirebaseConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "" &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId;

if (hasFirebaseConfig) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseActive = true;
    console.log("🔥 Connected to Firebase Firestore successfully!");
  } catch (err) {
    console.warn("⚠️ Failed to initialize Firebase. Falling back to LocalStorage mode.", err);
  }
} else {
  console.log("ℹ️ No Firebase credentials found. Running in LocalStorage offline-simulation mode.");
}

// Default mock appreciations if LocalStorage is empty
const getMockAppreciations = () => {
  const defaultData = {};
  projectsData.forEach(p => {
    defaultData[p.id] = [
      {
        id: `mock-1-${p.id}`,
        name: "Dev Team Lead",
        message: "Amazing eye for details! The UX transitions are incredibly fluid.",
        badge: "🎨 Beautiful UI",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
      },
      {
        id: `mock-2-${p.id}`,
        name: "Uni Professor",
        message: "Excellent implementation of functional components and responsive layouts.",
        badge: "💻 Brilliant Code",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
      }
    ];
  });
  return defaultData;
};

// Initialize LocalStorage with mock data if needed
if (!localStorage.getItem('portfolio_appreciations')) {
  localStorage.setItem('portfolio_appreciations', JSON.stringify(getMockAppreciations()));
}

// Add/Listen functions
export const getAppreciations = (projectId, callback) => {
  if (isFirebaseActive && db) {
    try {
      const q = query(
        collection(db, "appreciations"),
        where("projectId", "==", projectId),
        orderBy("timestamp", "desc")
      );
      
      // onSnapshot returns an unsubscribe function synchronously
      return onSnapshot(q, (snapshot) => {
        const appreciations = [];
        snapshot.forEach((doc) => {
          appreciations.push({ id: doc.id, ...doc.data() });
        });
        callback(appreciations);
      }, (error) => {
        console.error("Firestore read error: ", error);
        fallbackGet(projectId, callback);
      });
    } catch (err) {
      console.error("Error setting up Firestore listener: ", err);
      return fallbackGet(projectId, callback);
    }
  } else {
    return fallbackGet(projectId, callback);
  }
};

const fallbackGet = (projectId, callback) => {
  const data = JSON.parse(localStorage.getItem('portfolio_appreciations') || '{}');
  const projectData = data[projectId] || [];
  // Sort by timestamp descending
  const sorted = [...projectData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  callback(sorted);
  
  // Return dummy unsubscribe function for offline mode
  return () => {};
};

export const addAppreciation = async (projectId, name, message, badge) => {
  const newAppreciation = {
    projectId,
    name: name.trim() || "Anonymous",
    message: message.trim(),
    badge: badge || "✨ Awesome",
    timestamp: new Date().toISOString()
  };

  if (isFirebaseActive && db) {
    try {
      const docRef = await addDoc(collection(db, "appreciations"), newAppreciation);
      return { id: docRef.id, ...newAppreciation };
    } catch (e) {
      console.error("Error adding to Firestore: ", e);
      return fallbackAdd(projectId, newAppreciation);
    }
  } else {
    return fallbackAdd(projectId, newAppreciation);
  }
};

const fallbackAdd = (projectId, item) => {
  const data = JSON.parse(localStorage.getItem('portfolio_appreciations') || '{}');
  if (!data[projectId]) data[projectId] = [];
  
  const newItem = {
    id: `local-${Date.now()}`,
    ...item
  };
  
  data[projectId].push(newItem);
  localStorage.setItem('portfolio_appreciations', JSON.stringify(data));
  return newItem;
};
