# Guide de migration Next.js + Tailwind (Mise à jour 2024)

## Structure du projet

- Les pages principales web sont dans le dossier [`app/`], avec une **page d'accueil unique** centralisant tous les contenus.
- Les composants réutilisables sont dans [`components/`], avec des sous-dossiers pour `shared/`, `mobile/`, `web/`, etc.
- Les pages et composants mobiles (React Native) sont dans [`mobile/`] et [`screens/`].
- Les styles natifs (modules CSS) sont dans [`components/shared/layout/`] et certains fichiers de [`app/`], mais doivent être supprimés côté web.
- Les styles inline ou objets JS (`StyleSheet.create`) doivent être migrés vers des classes Tailwind.

## Règles de migration

- **Aucun style natif ou objet JS** ne doit subsister dans les pages Next.js ou les composants web : tout doit être en classes Tailwind.
- Les fichiers utilisant `StyleSheet.create` ou `style={{ ... }}` doivent être refactorés pour n'utiliser que des classes Tailwind.
- Les imports de fichiers `.module.css` doivent être supprimés et remplacés par des classes Tailwind.
- Les classes custom (ex : `card`, `gradient-title`) doivent être remplacées par des utilitaires Tailwind ou redéfinies en Tailwind si besoin.
- Les composants et pages mobiles (`mobile/`, `screens/`) ne sont à migrer que si une version web responsive est souhaitée.
- **Tous les contenus web sont désormais centralisés sur la home** (`app/page.tsx`).

## Points d'attention

- Vérifier les fichiers dans [`app/`], [`components/`], [`mobile/`], [`screens/`] pour la présence de styles à migrer.
- Les fichiers déjà en Tailwind (utilisant `className="..."` avec des utilitaires) n'ont pas besoin de migration.
- Les modules CSS globaux (ex : `globals.css`) peuvent rester pour les resets ou variables, mais pas pour le style des composants.

---

**Pour toute migration, se référer à cette règle pour identifier les fichiers et les conventions à respecter.**