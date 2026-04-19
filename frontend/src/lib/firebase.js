import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3ACBDSrqgmls3LJ27vYR6sMGKAzzz6Vk",
  authDomain: "cicdhealingagent.firebaseapp.com",
  projectId: "cicdhealingagent",
  storageBucket: "cicdhealingagent.firebasestorage.app",
  messagingSenderId: "798172471983",
  appId: "1:798172471983:web:d623be5388ced07ca4ea5a",
  measurementId: "G-389EMP7ZH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const githubProvider = new GithubAuthProvider();
