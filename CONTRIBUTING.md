# Guide de Contribution

## Structure du Projet

```
/
├── app/                    # Code de l'application Next.js
│   ├── api/               # Routes API
│   ├── components/        # Composants React réutilisables
│   ├── lib/              # Utilitaires et services
│   └── [locale]/         # Pages de l'application
├── config/                # Fichiers de configuration
├── public/               # Assets statiques
├── services/             # Services métier
├── scripts/              # Scripts utilitaires
└── __tests__/           # Tests
```

## Règles de Contribution

1. **Organisation des Fichiers**

   - Tout nouveau code doit être placé dans le dossier approprié selon sa fonction
   - Les composants React vont dans `app/components/`
   - Les services métier vont dans `services/`
   - Les tests vont dans `__tests__/`

2. **Configuration**

   - Tous les fichiers de configuration doivent être dans le dossier `config/`
   - Ne pas créer de nouveaux dossiers à la racine du projet

3. **Tests**

   - Chaque nouveau composant ou service doit avoir ses tests
   - Les tests doivent être placés dans `__tests__/` avec la même structure que le code source

4. **Documentation**
   - Documenter les nouvelles fonctionnalités
   - Mettre à jour ce guide si la structure du projet change
