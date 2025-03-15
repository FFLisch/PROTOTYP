import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "fflishscanner-7086b.firebaseapp.com",
  projectId: "fflishscanner-7086b",
  storageBucket: "fflishscanner-7086b.appspot.com",
  messagingSenderId: "978052678468",
  appId: "1:978052678468:web:5ad8fdf6b354a299bb8d11"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Überprüfen, ob ein Benutzer angemeldet ist
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("profileContainer").style.display = "block";
    document.getElementById("registerContainer").style.display = "none";
    document.getElementById("loginContainer").style.display = "none";

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      document.getElementById("profileUsername").value = userDoc.data().username;
    }
  } else {
    document.getElementById("profileContainer").style.display = "none";
    document.getElementById("registerContainer").style.display = "block";
    document.getElementById("loginContainer").style.display = "block";
  }
});

// Benutzer registrieren
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), { email: user.email });
      alert("Registrierung erfolgreich!");
    } catch (error) {
      alert("Fehler: " + error.message);
    }
  });
}

// Benutzer anmelden
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Anmeldung erfolgreich!");
    } catch (error) {
      alert("Fehler: " + error.message);
    }
  });
}

// Benutzername aktualisieren
const profileForm = document.getElementById("profileForm");
if (profileForm) {
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newUsername = document.getElementById("profileUsername").value;
    const user = auth.currentUser;

    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), { username: newUsername });
        await updateProfile(user, { displayName: newUsername });
        alert("Profil aktualisiert!");
      } catch (error) {
        alert("Fehler: " + error.message);
      }
    }
  });
}

// Logout-Funktion
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "Home.html";
    } catch (error) {
      alert("Fehler: " + error.message);
    }
  });
}
