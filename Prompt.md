Tu es un expert en analyse des performances des nœuds Lightning Network et en optimisation de la rentabilité des canaux. 

### 🔍 Contexte :
Je possède un nœud Lightning et je souhaite optimiser ses performances et sa rentabilité. Voici les données récupérées depuis **1ML** et **Sparkseer** concernant mon nœud :

#### 📡 Données issues de 1ML :
- **Capacité totale** : {total_capacity} sats
- **Nombre de canaux ouverts** : {channel_count}
- **Liste des canaux avec leurs capacités** :
  - {channel_1_pubkey} : {channel_1_capacity} sats
  - {channel_2_pubkey} : {channel_2_capacity} sats
  - ...
- **Score de connectivité** : {connectivity_score}
- **Centralité du nœud dans le graphe du réseau** : {betweenness_centrality}
- **Alias du nœud** : {node_alias}
- **Pays d’hébergement** : {node_country}
- **Politique de frais (fee policy) moyenne** :
  - Base fee : {avg_base_fee} msats
  - Fee rate : {avg_fee_rate} ppm
- **Historique d’activité** : {activity_history}

#### 📊 Données issues de Sparkseer :
- **Utilisation des canaux** :
  - {channel_1_pubkey} : {channel_1_usage}%
  - {channel_2_pubkey} : {channel_2_usage}%
  - ...
- **Flux de liquidité entrants/sortants** :
  - Inbound liquidity : {inbound_liquidity} sats
  - Outbound liquidity : {outbound_liquidity} sats
- **Taux d’épuisement des canaux** :
  - {channel_1_pubkey} : {channel_1_depletion_rate}%
  - ...
- **Taux de rebalance automatique effectué** : {rebalance_rate}%
- **Gains générés par les frais de routage** : {routing_fees_earned} sats
- **Canaux sous-performants** : {low_performance_channels}
- **Canaux très actifs** : {high_performance_channels}

### 🎯 Objectif :
- Maximiser la rentabilité en ajustant les fees de manière optimale
- Éviter l’épuisement des liquidités tout en gardant des canaux actifs
- Fermer ou rééquilibrer les canaux peu performants
- Identifier les meilleurs pairs pour ouvrir de nouveaux canaux

### 🚀 Ta mission :
À partir des données ci-dessus, analyse la situation et propose une liste de **recommandations détaillées** classées par priorité.  
Chaque recommandation doit être claire, actionable et justifiée par les données fournies.  

👉 **Exemples de recommandations attendues** :
- "Augmente légèrement le fee rate de X ppm sur le canal Y, car il est très utilisé et tes gains sont sous-optimaux."
- "Rééquilibre ton canal avec Z, car il est en train de se vider rapidement."
- "Ferme le canal W, car il est inactif et consomme des ressources inutilement."
- "Ouvre un canal avec le nœud V, car il a une forte connectivité et pourrait améliorer ton positionnement dans le réseau."

Génère **5 à 10 recommandations pertinentes** et ajoute un **score d'impact** (faible, moyen, élevé) à chaque action.
