# Resell – Dashboard Vinted

Dashboard statique : `index.html`, données dans `data.json`. Les articles restent aussi enregistrés localement dans le navigateur.

## Installation et synchronisation directe
1. Placez `index.html` et `data.json` à la racine de votre dépôt GitHub **public** et activez GitHub Pages dans **Settings → Pages**.
2. Créez un token GitHub fine-grained limité à ce dépôt, avec la permission **Contents : Read and write**. Les règles de protection de branche doivent autoriser les commits de ce token.
3. Ouvrez le dashboard, puis ⚙ → **GitHub direct**. Indiquez `propriétaire/dépôt`, la branche (par exemple `main`) et le token, puis connectez-vous.
4. Les modifications sont sauvegardées dans `data.json`. Le bouton d'état permet de réessayer une synchronisation. Si le fichier distant a changé depuis son chargement, la sauvegarde est refusée pour éviter de l'écraser : les données locales restent dans le navigateur. Réconciliez les données avant de recharger la page ou de reconnecter le dépôt.

Le token est stocké dans le stockage local du navigateur, jamais dans `data.json`. Utilisez un appareil personnel, limitez les permissions et révoquez le token si nécessaire. Tout script exécuté sur cette origine peut accéder au token. **Dans un dépôt public, `data.json` et les photos sont lisibles par tous**, y compris dans l'historique Git.

## Personnalisation et mobile
Dans ⚙, choisissez le mode clair ou sombre et une couleur secondaire. Ces préférences sont conservées dans le navigateur, indépendamment des données synchronisées. Sur téléphone, la navigation se trouve en bas de l'écran.

## Proxy existant (facultatif)
Les installations utilisant déjà `worker.js` restent compatibles : sélectionnez **Proxy Cloudflare existant** dans les réglages. Le Worker utilise les secrets `GITHUB_TOKEN` et `APP_PASSWORD`, ainsi que les variables `REPO` (`user/repo`), `BRANCH` et `ORIGIN`. Il peut cibler un dépôt public ou privé ; aucun proxy n'est nécessaire pour la connexion directe.
