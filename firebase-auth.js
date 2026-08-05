import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
const firebaseConfig = window.ZEROFOCUS_FIREBASE_CONFIG;
const authOptions = window.ZEROFOCUS_AUTH_OPTIONS || { allowRegistration: false, persistence: "local" };

const gate = document.querySelector("#authGate");
const content = document.querySelector("#authContent");
let auth;

function configured() {
  return firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("DEIN_") &&
    firebaseConfig.authDomain &&
    !firebaseConfig.authDomain.includes("DEIN-") &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes("DEIN-") &&
    firebaseConfig.appId &&
    !firebaseConfig.appId.includes("DEINE_");
}

function message(text = "") {
  const target = document.querySelector("#authError");
  if (target) target.textContent = text;
}

function friendlyError(error) {
  const code = error?.code || "";
  if (code.includes("too-many-requests")) return "Zu viele Versuche. Bitte später erneut versuchen.";
  if (code.includes("weak-password")) return "Das Passwort erfüllt die Firebase-Anforderungen nicht.";
  if (code.includes("network-request-failed")) return "Keine Verbindung zu Firebase. Internetverbindung prüfen.";
  if (code.includes("invalid-email")) return "Bitte eine gültige E-Mail-Adresse eingeben.";
  return "Anmeldung nicht möglich. E-Mail und Passwort prüfen.";
}

function renderLogin(register = false) {
  content.innerHTML = `
    <h1>${register ? "Konto erstellen" : "Sicher anmelden"}</h1>
    <p>${register ? "Erstelle deinen persönlichen ZeroFocus-Zugang." : "ZeroFocus ist durch Firebase Authentication geschützt."}</p>
    <form class="auth-fields" id="authForm">
      <label class="field"><span>E-Mail</span><input id="authEmail" type="email" autocomplete="email" required></label>
      <label class="field"><span>Passwort</span><input id="authPassword" type="password" autocomplete="${register ? "new-password" : "current-password"}" minlength="6" required></label>
      ${register ? '<label class="field"><span>Passwort bestätigen</span><input id="authPasswordRepeat" type="password" autocomplete="new-password" minlength="6" required></label>' : ""}
      <button class="btn primary" id="authSubmit">${register ? "Konto erstellen" : "Anmelden"}</button>
    </form>
    <div class="auth-error" id="authError"></div>
    <div class="auth-links">
      <button class="auth-link" id="resetPassword" type="button">Passwort vergessen</button>
      ${authOptions.allowRegistration ? `<button class="auth-link" id="toggleRegister" type="button">${register ? "Zur Anmeldung" : "Registrieren"}</button>` : ""}
    </div>
    <p class="auth-note">Die Sitzung bleibt auf diesem Gerät angemeldet, bis du dich abmeldest. Auf gemeinsam genutzten Geräten nach Gebrauch immer abmelden.</p>`;

  document.querySelector("#authForm").addEventListener("submit", async event => {
    event.preventDefault();
    message("");
    const email = document.querySelector("#authEmail").value.trim();
    const password = document.querySelector("#authPassword").value;
    const button = document.querySelector("#authSubmit");
    if (register && password !== document.querySelector("#authPasswordRepeat").value) {
      message("Die Passwörter stimmen nicht überein.");
      return;
    }
    button.disabled = true;
    button.textContent = "Bitte warten …";
    try {
      if (register) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      message(friendlyError(error));
      button.disabled = false;
      button.textContent = register ? "Konto erstellen" : "Anmelden";
    }
  });

  document.querySelector("#resetPassword").addEventListener("click", async () => {
    const email = document.querySelector("#authEmail").value.trim();
    if (!email) return message("Zuerst die E-Mail-Adresse eintragen.");
    try {
      await sendPasswordResetEmail(auth, email);
      message("Falls ein Konto besteht, wurde eine Reset-E-Mail versendet.");
    } catch (error) {
      message(friendlyError(error));
    }
  });

  document.querySelector("#toggleRegister")?.addEventListener("click", () => renderLogin(!register));
}

function showApp(user) {
  gate.hidden = true;
  document.body.classList.add("auth-ready");
  window.dispatchEvent(new CustomEvent("zerofocus-authenticated", { detail: { uid: user.uid } }));
  const settings = document.querySelector('[data-view="settings"] .settings');
  if (settings && !document.querySelector("#authAccount")) {
    const row = document.createElement("div");
    row.className = "connection";
    row.id = "authAccount";
    row.innerHTML = '<span class="connection-icon">ID</span><div><b>Firebase-Konto</b><div class="auth-user"></div></div><button class="btn" id="signOutButton">Abmelden</button>';
    row.querySelector(".auth-user").textContent = user.email || user.uid;
    row.querySelector("#signOutButton").addEventListener("click", () => signOut(auth));
    settings.prepend(row);
  }
}

function lockApp() {
  const wasReady = document.body.classList.contains("auth-ready");
  document.body.classList.remove("auth-ready");
  gate.hidden = false;
  document.querySelector("#authAccount")?.remove();
  if (wasReady) {
    location.reload();
    return;
  }
  renderLogin(false);
}

if (!configured()) {
  content.innerHTML = `
    <h1>Firebase konfigurieren</h1>
    <p>Die App bleibt aus Sicherheitsgründen gesperrt, bis die Firebase-Webkonfiguration eingetragen ist.</p>
    <div class="auth-error">Prüfe die Firebase-Konfiguration in <strong>index.html</strong>. Aktiviere danach in Firebase Authentication den Anbieter E-Mail/Passwort.</div>
    <p class="auth-note">Verwende ausschliesslich die Web-App-Konfiguration. Niemals einen Service-Account-Schlüssel in die App eintragen.</p>`;
} else {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    await setPersistence(auth, authOptions.persistence === "session" ? browserSessionPersistence : browserLocalPersistence);
    onAuthStateChanged(auth, user => user ? showApp(user) : lockApp());
  } catch (error) {
    console.error(error);
    content.innerHTML = '<h1>Firebase nicht erreichbar</h1><p>Die App bleibt gesperrt. Konfiguration und Internetverbindung prüfen.</p>';
  }
}
