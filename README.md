# Resell – Dashboard Vinted

Fichiers : `index.html` (application) et `data.json` (données).

## Installation (≈5 min)
1. **Dépôt public** : placez `index.html` et `data.json` à la racine, puis *Settings → Pages → Deploy from branch*.
2. **Token** (uniquement pour *enregistrer*) : *Settings → Developer settings → Fine-grained tokens*, accès limité à ce dépôt, permission **Contents : Read and write**.
3. Ouvrez le dashboard → **Réglages** (⚙ ou onglet « Réglages » sur mobile) → saisissez `utilisateur/dépôt`, la branche et le token → *Enregistrer et connecter*.

Sur `https://utilisateur.github.io/depot/`, le dépôt est détecté automatiquement : la lecture fonctionne sans rien configurer.

## Fonctionnement
- Lecture : directe depuis `data.json` (aucun token requis, dépôt public).
- Écriture : chaque modification est envoyée à `data.json` via l’API GitHub (commit « Mise à jour data.json »).
- Sans token : lecture seule. Le token n’est stocké que dans le navigateur de l’appareil (localStorage) : à saisir sur chaque appareil, et à ne jamais committer.
- `data.json` d’un dépôt public (photos comprises) est lisible par tous.

## Apparence
Réglages → Apparence : thème Auto / Clair / Sombre et couleur secondaire (palette ou couleur libre). Préférences mémorisées par appareil.
