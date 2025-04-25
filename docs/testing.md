# Guide des Tests

Ce document explique comment écrire et exécuter les tests unitaires et dintégration pour lapplication.

tests/
├── components/ # Tests des composants
│ ├── ui/ # Tests des composants UI
│ └── ...
├── services/ # Tests des services
├── utils/ # Tests des utilitaires
└── setup.ts # Configuration globale des tests
// app/i18n/locales/fr.json
{
"common": {
"submit": "Soumettre",
"cancel": "Annuler",
"save": "Enregistrer"
},
"home": {
"title": "Bienvenue sur DazBox",
"description": "Gérez votre nœud Lightning facilement"
},
"auth": {
"login": "Connexion",
"register": "Inscription",
"logout": "Déconnexion"
}
}
