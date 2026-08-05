# ZeroFocus Neural OS – Production v1.0.0

ZeroFocus ist eine installierbare Local-first-PWA für Aufgaben, Captures, Projekte und Deep-Focus-Sessions. Sie läuft ohne Build-Prozess, Server, Login oder kostenpflichtige API direkt auf GitHub Pages.

## Enthalten

- Command Center mit Obsidian-artigem, dynamischem SVG Focus Graph
- Aufgaben-, Projekt- und System-Nodes mit automatisch berechneten Verbindungen
- Nodes verschieben, Graph zoomen und verschieben; Doppelklick öffnet den Bereich
- kompakte Jarvis-HUD-Optik mit kleinen Nodes, feinen Cyan-Verbindungen und Scan-Ringen
- Aufgaben mit Priorität, Termin, Notizen und Projekt
- maximal drei Tagesaufgaben
- Capture Stream mit Umwandlung in Aufgaben
- Projekte mit Fortschritt
- 25-/50-Minuten-Fokus und 5-Minuten-Pause
- IndexedDB, JSON-Export/Import und Offline-App-Shell
- optionale Firebase-Architektur und sichere Firestore Rules
- responsive Desktop-/Mobile-Oberfläche, Maus-Parallax und Reduced-Motion-Fallback
- Spracheingabe für Captures und Aufgabentitel mit editierbarer Vorschau
- Monatskalender, Erinnerungszeit und ICS-Export
- lokaler Zero Assistant mit optionalem, nur lokal gespeichertem Groq-Key
- Aufwandsschätzung und kontextbasierte Fokusvorschläge
- manueller ZeroBrain Context Bridge Export ohne automatischen Datentransfer
- gehärteter Export: sensible lokale Einstellungen werden nie gesichert

## Dateien

```text
index.html
manifest.webmanifest
service-worker.js
firestore.rules
firebase-config.example.json
FIREBASE_SETUP.md
CODEX_MASTERPROMPT.md
SPRINT_ROADMAP.md
START_HERE.md
README.md
icons/icon-192.png
icons/icon-512.png
icons/icon-source.svg
DEPLOY_GITHUB_PAGES.md
PRIVACY.md
IMPRINT_TEMPLATE.md
RELEASE_CHECKLIST.md
robots.txt
.nojekyll
```

## GitHub Pages

Repository erstellen, alle Dateien in den Repository-Stamm hochladen und unter **Settings → Pages** `main` und `/(root)` aktivieren. Alle Laufzeitpfade sind relativ und funktionieren daher auch unter einer Projekt-Unteradresse.

Die vollständige Veröffentlichungskontrolle steht in `DEPLOY_GITHUB_PAGES.md` und `RELEASE_CHECKLIST.md`.

## Daten und Datenschutz

Primärspeicher ist die IndexedDB `zerofocus-db`, Version 3. Die Stores sind `tasks`, `projects`, `inbox`, `sessions` und `settings`. Neue Felder werden rückwärtskompatibel ergänzt. Es gibt keine Tracking-Skripte. Firebase, Groq und ZeroBrain Bridge sind optional.

## Lokaler Test

Für einen vollständigen PWA-Test muss die App über HTTPS oder `localhost` ausgeliefert werden. Direktes Öffnen der HTML-Datei reicht für die Oberfläche, aber nicht für Service Worker und Installation.

## Release-Regel

Bei Änderungen an App-Shell-Dateien den Wert `CACHE` in `service-worker.js` erhöhen. Bei Datenmodelländerungen die IndexedDB-Version erhöhen und eine verlustfreie Migration ergänzen.
