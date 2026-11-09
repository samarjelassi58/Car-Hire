# Car Hire : API

API REST Node.js, Express et MongoDB pour l'authentification, les clients, les voitures, les réservations et les messages.

## Démarrage

Depuis `back-end` :

```powershell
npm install
Copy-Item .env.example .env
```

Modifier `.env` avec les variables ci-dessous et démarrer MongoDB. Créer l'administrateur une seule fois, puis démarrer l'API :

```powershell
npm run create-admin
npm run dev
```

Si l'administrateur existe déjà, ne pas relancer sa création. L'API écoute par défaut sur `http://localhost:5000` ; vérifier `http://localhost:5000/api/health`.

| Variable | Utilisation |
|---|---|
| `MONGO_URI` | Connexion MongoDB, par exemple `mongodb://127.0.0.1:27017/car-hire` |
| `JWT_SECRET` | Secret aléatoire d'au moins 32 caractères |
| `PORT` | Port de l'API ; 5000 par défaut |
| `CORS_ORIGINS` | Origines frontend autorisées, séparées par des virgules |
| `MONGO_AUTO_INDEX` | `true` pour créer les index au démarrage |
| `ADMIN_FIRST_NAME`, `ADMIN_LAST_NAME`, `ADMIN_PHONE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Utilisés pour créer le premier administrateur |

Ne pas partager ni versionner `.env` ou les identifiants.

## Scripts

| Commande | Fonction |
|---|---|
| `npm run dev` | Démarrage avec rechargement automatique |
| `npm start` | Démarrage de l'API |
| `npm run create-admin` | Création d'un administrateur |
| `npm run seed-cars` | Ajout des voitures de démonstration absentes par nom |
| `npm run normalize-cars` | Conversion des documents contenant des champs français et copie des images locales trouvées |
| `npm test` | Tests unitaires Node.js |

## Routes principales

Les routes protégées utilisent un jeton Bearer dans l'en-tête `Authorization`.

| Méthode | Route | Accès | Fonction |
|---|---|---|---|
| GET | `/api/health` | Public | Santé de l'API et de la base |
| POST | `/api/auth/login` | Public | Connexion |
| POST | `/api/auth/logout` | Authentifié | Révocation du jeton |
| GET | `/api/auth/verify` | Authentifié | Vérification de session |
| POST | `/api/user/createUser` | Public | Inscription d'un client |
| GET, GET/PUT/DELETE | `/api/user`, `/api/user/:id` | Admin | Liste et gestion des clients |
| GET | `/api/car/getCars`, `/api/car/getCar/:id` | Public | Catalogue, filtres et détail |
| POST, PUT, DELETE | `/api/car/createCar`, `/api/car/updateCar/:id`, `/api/car/deleteCar/:id` | Admin | Gestion des voitures |
| POST | `/api/car/uploadImage` | Admin | Upload d'image |
| POST | `/api/reservation` | Authentifié | Créer une réservation |
| GET | `/api/reservation/my` | Authentifié | Consulter ses réservations |
| GET | `/api/reservation` | Admin | Lister toutes les réservations |
| GET, DELETE | `/api/reservation/:id` | Propriétaire ou admin | Consulter ou annuler |
| PATCH | `/api/reservation/:id/status` | Admin | Confirmer ou annuler |
| POST | `/api/message/addMessage` | Public | Envoyer un message |
| GET | `/api/message/getMessages` | Admin | Lister les messages |
| PATCH, DELETE | `/api/message/:id/status`, `/api/message/:id` | Admin | Modifier le statut ou supprimer |

Une réservation commence en attente et bloque les dates choisies ; une annulation libère la période. Les dates se saisissent au format `YYYY-MM-DD`.

## Tests

### Tests unitaires

Depuis `back-end` : `npm test`.

### Tests d'API avec Postman

La [collection Postman](./CarHire.postman_collection.json) couvre santé, authentification, clients, voitures, réservations, messages, droits et nettoyage.

1. Démarrer MongoDB et l'API. Utiliser une base dédiée et un compte administrateur de test.
2. Dans Postman, cliquer sur **Import** et choisir `CarHire.postman_collection.json`.
3. Dans les variables de la collection, renseigner les valeurs locales de `adminEmail` et `adminPassword`. Ne pas partager les identifiants et vérifier avant toute synchronisation ou export.
4. Dans la requête **Upload car image**, onglet **Body**, sélectionner [test-car.png](./tests/fixtures/test-car.png) si nécessaire.
5. Cliquer sur **Run collection**, conserver l'ordre des requêtes, lancer l'exécution et consulter les assertions.

La collection crée puis tente de supprimer ses données ; une interruption ou un échec peut en laisser dans la base.

### Tests d'API avec Newman

Depuis `back-end` :

```powershell
npx newman run .\CarHire.postman_collection.json `
  --env-var "adminEmail=admin@example.com" `
  --env-var "adminPassword=votre-mot-de-passe-de-test" `
  --reporters cli,json `
  --reporter-json-export .\postman-results.json
```

Le chemin de l'image est relatif à `back-end`. Les arguments peuvent être visibles dans l'historique du terminal ou la liste des processus : utiliser un compte de test. Ne pas partager le JSON brut, qui peut contenir des données sensibles.

### Rapport HTML Newman

Après avoir généré `postman-results.json`, depuis `back-end` :

```powershell
python .\scripts\view_postman_results.py --open
```

Le script génère `postman-report.html`. Les corps et en-têtes ne sont pas inclus ; vérifier tout rapport avant de le partager. Tests du script : `python -m unittest discover -s tests -p "test_postman_results.py"`.

Pour les tests navigateur, consulter le [guide Selenium](../e2e/README.md).
