import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

import { 
    getFirestore, doc, setDoc, getDoc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

import { 
    getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";

// Firebase-Instanzen abrufen
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// Registrierung
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

                // Benutzername in Firestore speichern
                await setDoc(doc(db, "users", user.uid), {
                    username: username,
                    email: email
                });

                alert("Registrierung erfolgreich!");
                window.location.href = "Profil.html";
            } catch (error) {
                alert("Fehler: " + error.message);
            }
        });
    }

    // Anmeldung
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

    // Benutzerstatus überwachen
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
                const profilePhoto = document.getElementById("profilePhoto").files[0];

                try {
                    await updateDoc(doc(db, "users", user.uid), { username: newUsername });

                    if (profilePhoto) {
                        const photoRef = ref(storage, `profilePhotos/${user.uid}`);
                        await uploadBytes(photoRef, profilePhoto);
                        const photoURL = await getDownloadURL(photoRef);
                        await updateProfile(user, { photoURL: photoURL });
                    }

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
