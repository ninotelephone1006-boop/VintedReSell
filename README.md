# Resell – Dashboard Vinted

Fichiers : `index.html` (app), `data.json` (données), `worker.js` (proxy sécurisé).

## Installation (≈10 min)
1. **Dépôt GitHub** : placez `index.html` et `data.json` à la racine, puis *Settings → Pages → Deploy from branch*.
2. **Token** : *Settings → Developer settings → Fine-grained tokens*, accès uniquement à votre dépôt, permission **Contents : Read and write**.
3. **Worker** : sur dash.cloudflare.com → Workers → créez un Worker, collez `worker.js`, puis ajoutez :
   - Secrets : `GITHUB_TOKEN` (le token), `APP_PASSWORD` (un mot de passe de votre choix)
   - Variables : `REPO` = `votre-user/votre-depot`, `BRANCH` = `main`, `ORIGIN` = `https://votre-user.github.io`
4. Ouvrez le dashboard → icône ⚙ → collez l’URL du Worker et le mot de passe.

## Confidentialité
`data.json` d’un dépôt public est lisible par tous (photos comprises). Pour garder vos données privées, mettez `REPO` sur un **second dépôt privé** contenant `data.json` : le dashboard reste sur GitHub Pages, les données restent privées.
