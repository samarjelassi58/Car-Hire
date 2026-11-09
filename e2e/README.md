# Tests navigateur Selenium

Cette suite utilise Python, pytest et Chrome pour tester les parcours dans un vrai navigateur. Chrome est invisible par défaut ; utiliser `--headed` pour voir la fenêtre.

## Avant de lancer les tests

1. Démarrer MongoDB, le backend et le frontend ; vérifier `http://localhost:5000/api/health` et `http://localhost:5173`.
2. Créer un administrateur de test dans la base si nécessaire. Utiliser une base dédiée : les tests créent et suppriment des données et peuvent en laisser en cas d'interruption ou d'échec.
3. Installer Python 3 et Google Chrome. Depuis la racine du projet, créer et activer un environnement Python, puis installer les dépendances :

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m pip install -r e2e\requirements.txt
   ```

4. Copier `e2e\.env.example` vers `e2e\.env`. Dans la copie, renseigner `E2E_ADMIN_EMAIL` et `E2E_ADMIN_PASSWORD` avec les identifiants **existants** de l'administrateur de test. Adapter les URL si nécessaire. Ne partagez pas ce fichier.

## Lancer les tests

Depuis la racine, entrer dans `e2e` :

```powershell
cd e2e
```

Puis choisir une commande :

```powershell
python -m pytest -v                          # toute la suite
python -m pytest tests\test_admin.py -v      # administration uniquement
python -m pytest tests\test_auth.py -v       # authentification uniquement
python -m pytest tests\test_admin.py -v --headed  # avec Chrome visible
```

Autres fichiers : `test_cars.py`, `test_reservations.py` et `test_contact.py`. Ne pas lancer ces fichiers directement avec « Exécuter le fichier Python » : ils nécessitent pytest et ses fixtures.

### Depuis VS Code sans commande de test

Ouvrir le dossier `e2e` dans VS Code, sélectionner l'interpréteur Python de `.venv`, puis dans l'onglet **Tests** configurer Python avec **pytest** et le dossier `tests`. Utiliser le bouton de lecture à côté d'un fichier ou **Exécuter tous les tests**. Les services et la configuration ci-dessus restent nécessaires.

## Rapport et diagnostic

Après une exécution depuis `e2e`, le rapport est `reports\report.html` ; l'ouvrir dans le navigateur ou, sous PowerShell :

```powershell
Start-Process .\reports\report.html
```

Le rapport est remplacé à chaque exécution et ne contient que les tests lancés. En cas d'échec, des captures peuvent être enregistrées dans `reports\screenshots`. Les rapports peuvent contenir des informations sensibles : ne pas les partager sans vérification.

- **Passed** : résultat attendu obtenu, y compris lorsqu'un test vérifie qu'un mauvais mot de passe est refusé.
- **Failed** : le test s'exécute mais le résultat ne correspond pas à l'attendu.
- **Error** : problème lors de la préparation ou du nettoyage, par exemple des identifiants administrateur incorrects.
- **No tests ran** : aucun test n'a été exécuté ; lire le message d'interruption, même si un rapport a été créé.

Si les identifiants sont absents, renseigner `e2e\.env`. S'ils sont refusés, vérifier que le compte existe dans la base utilisée par l'API. Si une URL ne répond pas, démarrer le service correspondant. Pour les échecs Selenium, consulter le détail et les captures dans le rapport.
