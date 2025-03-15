// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAykc3w17REc1AP4WgpzM6EjzY2SNGoI0g",
  authDomain: "test-814ea.firebaseapp.com",
  projectId: "test-814ea",
  storageBucket: "test-814ea.firebasestorage.app",
  messagingSenderId: "155120414415",
  appId: "1:155120414415:web:1d36017a02c0cb6fc9d1ba",
  measurementId: "G-KGV69FMLJ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

// Registration
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const profileForm = document.getElementById("profileForm");
  const profileContainer = document.getElementById("profileContainer");
  const registerContainer = document.getElementById("registerContainer");
  const loginContainer = document.getElementById("loginContainer");

  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("registerUsername").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save username in Firestore
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          usercode: user.uid
        });

        alert("Registrierung erfolgreich!");
        window.location.href = "Profil.html";
      } catch (error) {
        alert("Fehler: " + error.message);
      }
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Anmeldung erfolgreich!");
        window.location.href = "Profil.html";
      } catch (error) {
        alert("Fehler: " + error.message);
      }
    });
  }

  // Monitor user status
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("Benutzer angemeldet:", user.email);
      registerContainer.style.display = "none";
      loginContainer.style.display = "none";
      profileContainer.style.display = "block";

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        document.getElementById("profileUsername").value = userDoc.data().username;
      }

      profileForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const newUsername = document.getElementById("profileUsername").value;

        try {
          await updateDoc(doc(db, "users", user.uid), { username: newUsername });
          alert("Profil aktualisiert!");
        } catch (error) {
          alert("Fehler: " + error.message);
        }
      });
    } else {
      console.log("Kein Benutzer angemeldet.");
      registerContainer.style.display = "block";
      loginContainer.style.display = "block";
      profileContainer.style.display = "none";
    }
  });
});