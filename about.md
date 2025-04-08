# À propos de DazLng

DazLng est une application web qui permet de visualiser et d'analyser le réseau Lightning de Bitcoin.

## Technologies utilisées

- Next.js 14 avec App Router
- TypeScript
- Tailwind CSS
- PostgreSQL pour une gestion sécurisée des données
- API REST
- Tests unitaires avec Jest
- CI/CD avec GitHub Actions

## Fonctionnalités

- Visualisation du réseau Lightning en temps réel
- Analyse des métriques du réseau
- Interface utilisateur moderne et responsive
- Support multilingue (français, anglais)
- Authentification sécurisée
- API REST documentée

## Sécurité

DazLng accorde une importance primordiale à la sécurité de ses utilisateurs et de leurs données. Voici un aperçu détaillé des mesures de sécurité mises en place :

### 🔒 Protection des Données

- **Base de données** :

  - Utilisation de PostgreSQL pour une gestion sécurisée des données
  - Chiffrement des données sensibles
  - Sauvegardes régulières
  - Indexation optimisée pour les performances

- **Sessions** :
  - Durée de vie limitée à 24 heures
  - Régénération automatique des identifiants
  - Stockage sécurisé des tokens
  - Nettoyage automatique des sessions expirées

### 🛡️ Protection contre les Attaques

- **Rate Limiting** :

  - Protection contre les attaques par force brute
  - Limites personnalisées par route
  - Nettoyage automatique des entrées expirées
  - Gestion intelligente des tentatives

- **Validation des Entrées** :

  - Validation stricte des données utilisateur
  - Protection contre les injections SQL
  - Sanitization des entrées
  - Gestion des erreurs sécurisée

- **Headers de Sécurité** :
  - Content Security Policy (CSP) configuré
  - HTTP Strict Transport Security (HSTS)
  - Protection XSS et CSRF
  - Politique de permissions restrictive

### 🔐 Authentification

- **Méthodes d'Authentification** :

  - Support de Nostr Wallet Connect (NWC)
  - Intégration Alby Wallet
  - Authentification par email
  - Vérification en deux étapes

- **Gestion des Mots de Passe** :
  - Hachage sécurisé
  - Politique de mots de passe forte
  - Protection contre les attaques par dictionnaire
  - Réinitialisation sécurisée

### 📝 Journalisation

- **Événements de Sécurité** :

  - Connexions et déconnexions
  - Tentatives d'authentification échouées
  - Modifications de compte
  - Actions sensibles

- **Monitoring** :
  - Surveillance en temps réel
  - Détection des anomalies
  - Alertes automatiques
  - Rapports de sécurité

### 🔄 Mises à Jour

- **Maintenance** :
  - Mises à jour régulières des dépendances
  - Correctifs de sécurité
  - Tests de pénétration
  - Audits de code

### 🌐 Conformité

- **Standards** :
  - Respect des bonnes pratiques OWASP
  - Conformité RGPD
  - Standards de sécurité web
  - Protocoles de sécurité à jour

## Support

Pour toute question concernant la sécurité ou signaler une vulnérabilité, contactez-nous à :

- Email : security@dazlng.com
- Nostr : npub1...
- GitHub : [Issues](https://github.com/votre-username/DazLng/issues)
