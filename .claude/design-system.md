# Design System & Gestion des Styles

## Centralisation des couleurs et thèmes

- Les couleurs principales, secondaires, d'arrière-plan, etc. sont définies dans [constants/Colors.ts] et [styles/shared.ts].
- Ces fichiers servent de source unique pour la palette de couleurs et la typographie de l'application.

## Design System

- Le design system (espacements, typographies, styles de base) est défini dans [styles/shared.ts].
- On y trouve :  
  - `colors` : palette de couleurs  
  - `spacing` : espacements  
  - `typography` : tailles et poids de police  
  - `shared` : styles de base pour boutons, inputs, textes, etc.

## Composants UI partagés

- Les composants réutilisables (boutons, inputs, listes, etc.) sont dans [components/shared/ui/].
- Ils consomment les constantes du design system pour garantir la cohérence visuelle sur web et mobile.

## Gestion des styles

- Les styles sont définis avec `StyleSheet.create` (React Native) ou via des classes utilitaires (ex : Tailwind) pour le web.
- Les composants partagés utilisent des styles adaptatifs pour supporter à la fois web et mobile.

## Exemple d'utilisation

- Un composant comme [Button.tsx] applique dynamiquement les couleurs, tailles et variantes selon les props, en s'appuyant sur le design system.
- Les formulaires utilisent [FormInput.tsx] pour garantir une expérience utilisateur cohérente.

## Résumé

- **Centralisation** des styles et couleurs pour toute l'application.
- **Composants UI partagés** pour la cohérence et la réutilisabilité.
- **Adaptabilité** web/mobile assurée par la structure des styles et composants.