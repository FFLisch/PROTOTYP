import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Access the environment variable
const appSecret = process.env.APP_SECRET;

const firebaseConfig = {
  apiKey: appSecret, // Use the environment variable here
  authDomain: "fflishscanner-7086b.firebaseapp.com",
  projectId: "fflishscanner-7086b",
  storageBucket: "fflishscanner-7086b.appspot.com",
  messagingSenderId: "978052678468",
  appId: "1:978052678468:web:5ad8fdf6b354a299bb8d11"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

let isLoggedIn = false;

// Überprüfen, ob ein Benutzer angemeldet ist
onAuthStateChanged(auth, async (user) => {
  const profileLink = document.getElementById("profileLink");
  const logoutButton = document.getElementById("logoutButton");
  if (user) {
    isLoggedIn = true;
    logoutButton.style.display = "block";
    profileLink.href = "Profil_eingelogt.html";

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      document.getElementById("profileUsername").value = userDoc.data().username;
      document.getElementById("profileEmailDisplay").textContent = `Email: ${user.email}`;
      document.getElementById("profileUsernameDisplay").textContent = user.displayName;
    }
  } else {
    isLoggedIn = false;
    logoutButton.style.display = "none";
    profileLink.href = "Profil.html";
  }
});

// Benutzer registrieren
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), { email: user.email, username: username });
      await updateProfile(user, { displayName: username });
      alert("Registrierung erfolgreich!");
      window.location.href = "Profil_eingelogt.html";
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert("Diese E-Mail-Adresse wird bereits verwendet.");
      } else {
        alert(`Fehler bei der Registrierung: ${error.message} (Code: ${error.code})`);
      }
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
      // Set the login status in localStorage when the user logs in
      localStorage.setItem('isLoggedIn', 'true');
      alert("Anmeldung erfolgreich!");
      window.location.href = "Profil_eingelogt.html";
    } catch (error) {
      alert(`Fehler bei der Anmeldung: ${error.message} (Code: ${error.code})`);
    }
  });
}

// Google Login
const googleLoginButton = document.getElementById("googleLoginButton");
if (googleLoginButton) {
  googleLoginButton.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      alert("Anmeldung mit Google erfolgreich!");
      // Set the login status in localStorage when the user logs in
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = "Profil_eingelogt.html";
    } catch (error) {
      alert(`Fehler bei der Google-Anmeldung: ${error.message} (Code: ${error.code})`);
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
        document.getElementById("profileUsernameDisplay").textContent = newUsername;
      } catch (error) {
        alert(`Fehler beim Aktualisieren des Profils: ${error.message} (Code: ${error.code})`);
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
      localStorage.removeItem('isLoggedIn'); // Remove login status from localStorage
      window.location.href = "Profil.html"; // Redirect to login page
    } catch (error) {
      alert(`Fehler beim Abmelden: ${error.message} (Code: ${error.code})`);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const auth = getAuth();
    const logoutButton = document.getElementById('logoutButton');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (logoutButton) {
                logoutButton.style.display = 'block';
            }
        } else {
            if (logoutButton) {
                logoutButton.style.display = 'none';
            }
        }
    });
});