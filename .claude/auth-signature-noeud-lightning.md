# Authentification par nœud Lightning - Fonctionnalité en Roadmap

Cette fonctionnalité permettant aux utilisateurs de s'inscrire ou de se connecter en signant un message avec leur nœud Lightning n'est pas encore implémentée dans la version actuelle.

## État actuel

- La page d'authentification [app/auth/login/page.tsx] propose uniquement l'authentification par email/mot de passe
- Des tests pour l'intégration avec Alby existent dans [app/api/auth/alby.test.ts] mais ne sont pas implémentés dans le produit
- Le fichier [contexts/AuthContext.tsx] contient une fonction `loginWithAlby` non implémentée
- Dans [app/checkout/daznode/page.tsx], il existe une fonctionnalité pour signer avec un nœud, mais uniquement pour vérifier la propriété d'un nœud lors d'un achat

## Points d'implémentation future

1. Ajouter l'option de signature par nœud dans l'UI d'inscription/connexion
2. Implémenter l'authentification par signature Lightning dans le backend
3. Créer les endpoints API nécessaires pour l'authentification
4. Mettre à jour les providers d'authentification dans [lib/auth.ts]

## Référence technique

La méthode `handleNodeSign` dans [app/checkout/daznode/page.tsx] contient un exemple de simulation qui pourrait servir de base pour l'implémentation réelle de cette fonctionnalité.