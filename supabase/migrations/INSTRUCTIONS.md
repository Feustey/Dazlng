# Instructions pour l'exécution des migrations de performance

## ⚠️ IMPORTANT

Ces migrations créent des index concurrents qui **NE PEUVENT PAS** être exécutées dans un bloc de transaction.
Chaque fichier doit être exécuté **SÉPARÉMENT** et **SANS TRANSACTION**.

## Ordre d'exécution

1. **Partie 1 - Profils et Commandes**
   ```sql
   \i 20250105_performance_indexes_part1.sql
   ```
   - Crée les index pour les tables `profiles` et `orders`
   - Temps estimé : 2-5 minutes selon la taille des tables

2. **Partie 2 - Abonnements et Logs**
   ```sql
   \i 20250105_performance_indexes_part2.sql
   ```
   - Crée les index pour `subscriptions`, `payment_logs`, `deliveries` et `network_stats`
   - Temps estimé : 2-5 minutes

3. **Partie 3 - Fonctions de maintenance**
   ```sql
   \i 20250105_performance_functions.sql
   ```
   - Crée les fonctions d'analyse et de maintenance des index
   - Temps estimé : < 1 minute

## Vérification

Après l'exécution, vérifiez la santé des index :

```sql
SELECT * FROM analyze_index_health();
```

## Maintenance

Pour identifier les index inutilisés :
```sql
SELECT * FROM analyze_index_usage();
```

Pour nettoyer les index inutilisés (dry run) :
```sql
SELECT * FROM cleanup_unused_indexes(30, true);
```

Pour supprimer effectivement les index inutilisés :
```sql
SELECT * FROM cleanup_unused_indexes(30, false);
```

## Notes importantes

- Ces migrations sont conçues pour être exécutées en production sans interruption de service
- Les index sont créés en arrière-plan avec `CREATE INDEX CONCURRENTLY`
- En cas d'erreur, l'index en cours de création sera automatiquement supprimé
- Surveillez la charge CPU pendant la création des index
- Exécutez pendant les heures creuses si possible 