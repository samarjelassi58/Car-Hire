# Car Hire

Application de location de voitures avec un catalogue, des réservations, un formulaire de contact et un espace administrateur.

Le projet est un **monolithe modulaire** : un frontend React et une API Express partagent une base MongoDB.

## Fonctionnalités

- Visiteur : consulter et filtrer les voitures, créer un compte et envoyer un message.
- Client connecté : réserver une voiture, consulter le statut de ses réservations et les annuler.
- Administrateur : gérer les voitures, les clients, les réservations et les messages.

## Prérequis

- Node.js et npm, MongoDB local ou Atlas.
- Pour les tests Selenium : Python 3, Google Chrome et les dépendances indiquées dans le [guide des tests E2E](./e2e/README.md).
- Postman, facultatif, pour exécuter la collection API depuis une interface graphique.

## Installation et démarrage sous Windows

Ouvrir le dossier du projet dans VS Code, puis utiliser deux terminaux PowerShell.

### 1. Backend

Depuis la racine du projet :

```powershell
cd back-end
npm install
Copy-Item .env.example .env
```

Modifier `back-end\.env` : renseigner notamment `MONGO_URI`, `JWT_SECRET` et les variables `ADMIN_*`. Consulter le [guide backend](./back-end/README.md) pour leur signification. Démarrer MongoDB, puis créer l'administrateur **une seule fois** :

```powershell
npm run create-admin
npm run dev
```

Si l'administrateur existe déjà, ne pas relancer sa création. Laisser ce terminal ouvert. L'API est disponible par défaut sur `http://localhost:5000` ; vérifier `http://localhost:5000/api/health`.

### 2. Frontend

Dans un nouveau terminal, depuis la racine du projet :

```powershell
cd front-end
npm install
npm run dev
```

Ouvrir l'adresse affichée par Vite, généralement `http://localhost:5173`, et laisser ce terminal ouvert. Voir le [guide frontend](./front-end/README.md).

## Tests

| Vérification | Comment la lancer |
|---|---|
| Parcours navigateur Selenium | [Guide pas à pas E2E](./e2e/README.md), tous les tests ou un fichier |
| API avec Postman | [Guide backend : tests API](./back-end/README.md#tests-dapi-avec-postman) |
| Tests unitaires backend | `npm test` depuis `back-end` |
| Vérification et compilation frontend | `npm run lint` et `npm run build` depuis `front-end` |

Les tests E2E et API écrivent dans la base et tentent de nettoyer leurs données ; utiliser une **base de test dédiée**, jamais une base de production. Une interruption ou un échec peut laisser des données de test.

## Structure

```text
Car-Hire/
├── back-end/     API, modèles MongoDB, scripts et collection Postman
├── front-end/    Interface React
└── e2e/          Tests Selenium, objets de page et configuration pytest
```

## Sécurité

Ne partagez ni ne versionnez les fichiers `.env`, les jetons ou les rapports contenant des données sensibles. Utilisez un `JWT_SECRET` aléatoire d'au moins 32 caractères et des identifiants propres à votre environnement. Ne publiez pas les identifiants de test.
