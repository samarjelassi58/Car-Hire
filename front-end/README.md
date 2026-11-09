# Car Hire : frontend

Interface React avec Vite, Redux Toolkit et React Router. Elle communique avec l'API du dossier [back-end](../back-end/README.md).

## Démarrage

Depuis `front-end`, dans un terminal PowerShell :

```powershell
npm install
npm run dev
```

Ouvrir l'adresse affichée par Vite, généralement `http://localhost:5173`. Le backend et MongoDB doivent être démarrés pour les fonctions liées aux données.

L'API est par défaut `http://localhost:5000`. Pour utiliser une autre adresse, copier `.env.example` vers `.env` et modifier `VITE_API_URL`. Configurer aussi `CORS_ORIGINS` côté backend si l'origine du frontend change.

## Parcours

- Le visiteur peut consulter les voitures et envoyer un message.
- Le client connecté retrouve ses réservations et leur statut via **My Reservations** ; le bouton **Nouvelle réservation** permet d'en créer une.
- L'administrateur accède au tableau de bord pour gérer voitures, clients, réservations et messages.

## Vérifications

Depuis `front-end` :

```powershell
npm run lint
npm run build
```

Ces commandes vérifient le code et la compilation ; elles ne remplacent pas les tests navigateur. Pour exécuter les parcours avec Chrome, suivre le [guide Selenium](../e2e/README.md).
