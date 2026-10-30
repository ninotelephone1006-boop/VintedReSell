# Resell – Dashboard Vinted

Fichiers : `index.html` (application) et `data.json` (données).

## Sauvegarde automatique — zéro configuration

Ouvre `index.html` (en ligne ou en local) : **tout fonctionne tout de suite**. Chaque ajout, modification ou suppression est enregistré immédiatement sur l'appareil.

- **Stockage** : IndexedDB (photos incluses, grosse capacité), avec miroir `localStorage`. Aucun compte, aucun serveur, aucun réglage à faire.
- **Pastille d'état** : `Enregistré` = tes données sont sur l'appareil. `Synchronisé` = en plus, elles sont poussées vers le cloud (optionnel).
- **Aucune erreur bloquante** : si l'hébergement refuse l'écriture (GitHub Pages renvoie `405` sur `PUT`), la sauvegarde locale continue et l'application reste pleinement utilisable.
- **Rien n'est jamais écrasé** : une lecture distante est fusionnée avec les données locales (article le plus récent gagnant, suppressions mémorisées), donc pas de perte de données.

### Sauvegarde / transfert manuel
Réglages → **Exporter data.json** et **Importer un data.json** : pratique pour sauvegarder ou passer d'un appareil à l'autre sans rien configurer.

### Synchronisation multi-appareils (optionnelle)
1. Place `index.html` et `data.json` à la racine du dépôt, active *Settings → Pages → Deploy from branch*.
2. Déploie `worker.js` sur Cloudflare Workers avec les secrets :
   - `GITHUB_TOKEN` — token avec `Contents: Read and write` sur ce dépôt
   - `APP_PASSWORD` — mot de passe libre pour protéger le Worker
   - Variables : `REPO` (`user/repo`), `BRANCH` (`main`), `ORIGIN` (`https://user.github.io`)
3. Dashboard → Réglages → section **Sauvegarde** → *Synchroniser entre plusieurs appareils* → saisis l'URL du Worker et le mot de passe → Enregistrer.

Sans cette étape, l'application marche exactement pareil sur chaque appareil, simplement sans partage automatique.

### Serveur local avec écriture
`node server.js` sert `index.html` + `data.json` avec `GET/PUT` (et `/data` pour la compatibilité Worker). La pastille passe alors sur `Synchronisé`.

## Pages

- **Accueil** — chiffres d'affaires, bénéfices, stock, graphique performance
- **À vendre / Vendus** — gestion des articles
- **Commandes & Argent** — nouvelle page :
  - **Commandes à envoyer** : liste des articles vendus non expédiés (photo, nom, prix), bouton *Expédié* → bascule en *Envoyées*, compteur *colis restant*
  - **Argent en attente** : ventes non encaissées, bouton *Argent reçu* → bascule en *Encaissé*
  - **Statistiques financières** : Argent en attente, Argent reçu, Total des ventes, Bénéfices réellement encaissés (uniquement argent reçu)

Chaque vente enregistre `shipped` / `shippedAt` et `received` / `receivedAt`. Ces informations sont sauvegardées automatiquement sur l'appareil (et synchronisées si un Worker est configuré).

## Apparence
Réglages → Apparence : thème Auto / Clair / Sombre et couleur secondaire (palette ou couleur libre). Préférences mémorisées par appareil.

## Fichiers
- `index.html` — application (HTML/CSS/JS, aucun build)
- `data.json` — copie/export de la base : `{"settings":{"goal":0},"items":[]}` — chaque item peut contenir `upd` (horodatage), `shipped`, `shippedAt`, `received`, `receivedAt`
- `worker.js` — proxy Cloudflare Worker pour GitHub Pages (optionnel si ton hébergement gère `PUT data.json`)
- `server.js` — serveur local `node server.js` avec support `GET/PUT data.json` et `/data`
