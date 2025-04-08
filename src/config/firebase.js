// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCasuddqxqOEuCfaG1GwfN39ISgZx5yZGE",
    authDomain: "campus-guide-d83d4.firebaseapp.com",
    databaseURL: "https://campus-guide-d83d4-default-rtdb.firebaseio.com",
    projectId: "campus-guide-d83d4",
    storageBucket: "campus-guide-d83d4.firebasestorage.app",
    messagingSenderId: "285046305362",
    appId: "1:285046305362:web:059f103f16919d97f1e58b",
    measurementId: "G-VKJN2C970Q"
  };

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);