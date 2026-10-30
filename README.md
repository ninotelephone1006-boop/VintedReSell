# Resell – Dashboard Vinted

Fichiers : `index.html` (application) et `data.json` (données).

## Toujours en ligne via `data.json`

L'application est **100% en ligne** : toutes les lectures et écritures passent par `data.json` (même dossier que `index.html`).

- **Lecture** : `fetch('data.json')` à chaque chargement, avec `cache: no-store` et rechargement auto toutes les 30s + au retour sur l'onglet.
- **Écriture** : `PUT data.json` avec le JSON complet. Aucun `localStorage` pour les données, aucun mode hors-ligne.

### Hébergement

**Option A — Serveur avec écriture (simple)**
Héberge `index.html` + `data.json` sur un serveur qui autorise `PUT` sur `data.json` (ex: petit serveur Node, Apache, Nginx, Vercel, etc.). Laisse l'URL du Worker vide dans Réglages. `node server.js` inclus pour tester en local.

**Option B — GitHub Pages + Cloudflare Worker (recommandé pour GitHub)**
1. Place `index.html` et `data.json` à la racine du dépôt, active *Settings → Pages → Deploy from branch*.
2. Déploie `worker.js` sur Cloudflare Workers avec les secrets :
   - `GITHUB_TOKEN` — token avec `Contents: Read and write` sur ce dépôt
   - `APP_PASSWORD` — mot de passe libre pour protéger le Worker
   - Variables : `REPO` (`user/repo`), `BRANCH` (`main`), `ORIGIN` (`https://user.github.io`)
3. Dans le dashboard → Réglages → saisis l'URL du Worker et le mot de passe → Enregistrer. L'app appelle alors `https://ton-worker.workers.dev/data`.

Dans les deux cas, le dashboard affiche **En ligne** / **Synchronisé** / **Hors ligne** et reste synchronisé entre appareils.

## Pages

- **Accueil** — chiffres d'affaires, bénéfices, stock, graphique performance
- **À vendre / Vendus** — gestion des articles
- **Commandes & Argent** — nouvelle page :
  - **Commandes à envoyer** : liste des articles vendus non expédiés (photo, nom, prix), bouton *Expédié* → bascule en *Envoyées*, compteur *colis restant*
  - **Argent en attente** : ventes non encaissées, bouton *Argent reçu* → bascule en *Encaissé*
  - **Statistiques financières** : Argent en attente, Argent reçu, Total des ventes, Bénéfices réellement encaissés (uniquement argent reçu)

Chaque vente enregistre `shipped` / `shippedAt` et `received` / `receivedAt` dans `data.json` — toujours en ligne, synchronisé entre appareils.

## Apparence
Réglages → Apparence : thème Auto / Clair / Sombre et couleur secondaire (palette ou couleur libre). Préférences mémorisées par appareil.

## Fichiers
- `index.html` — application (HTML/CSS/JS, aucun build)
- `data.json` — base de données : `{"settings":{"goal":0},"items":[]}` — chaque item vendu peut contenir `shipped`, `shippedAt`, `received`, `receivedAt`
- `worker.js` — proxy Cloudflare Worker pour GitHub Pages (optionnel si ton hébergement gère `PUT data.json`)
- `server.js` — serveur local `node server.js` avec support `GET/PUT data.json` et `/data`
