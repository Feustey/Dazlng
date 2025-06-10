# Guide de Configuration Lightning ⚡

## Configuration rapide pour DazNode v2.0

### 1. Variables d'environnement requises

```bash
# Configuration LND (OBLIGATOIRE)
export LND_TLS_CERT="$(base64 -w0 ~/.lnd/tls.cert)"
export LND_ADMIN_MACAROON="$(base64 -w0 ~/.lnd/data/chain/bitcoin/mainnet/admin.macaroon)"
export LND_SOCKET="127.0.0.1:10009"
```

### 2. Localisation des fichiers LND

#### Ubuntu/Linux :
```bash
# Certificat TLS
~/.lnd/tls.cert

# Macaroon admin
~/.lnd/data/chain/bitcoin/mainnet/admin.macaroon

# Ou pour testnet
~/.lnd/data/chain/bitcoin/testnet/admin.macaroon
```

#### macOS :
```bash
# Certificat TLS
~/Library/Application Support/Lnd/tls.cert

# Macaroon admin
~/Library/Application Support/Lnd/data/chain/bitcoin/mainnet/admin.macaroon
```

#### Windows :
```bash
# Certificat TLS
%APPDATA%\Lnd\tls.cert

# Macaroon admin
%APPDATA%\Lnd\data\chain\bitcoin\mainnet\admin.macaroon
```

### 3. Extraction et configuration

```bash
#!/bin/bash

# Script de configuration automatique
echo "🔧 Configuration Lightning DazNode v2.0..."

# Vérifier que LND est installé
if ! command -v lncli &> /dev/null; then
    echo "❌ LND n'est pas installé ou pas dans le PATH"
    exit 1
fi

# Vérifier que LND fonctionne
if ! lncli getinfo &> /dev/null; then
    echo "❌ LND n'est pas démarré ou inaccessible"
    echo "💡 Démarrez LND avec: lnd"
    exit 1
fi

# Extraire les configurations
echo "📄 Extraction du certificat TLS..."
export LND_TLS_CERT="$(base64 -w0 ~/.lnd/tls.cert)"

echo "🔑 Extraction du macaroon admin..."
export LND_ADMIN_MACAROON="$(base64 -w0 ~/.lnd/data/chain/bitcoin/mainnet/admin.macaroon)"

echo "🌐 Configuration du socket..."
export LND_SOCKET="127.0.0.1:10009"

# Ajouter au .env local
echo "💾 Sauvegarde dans .env.local..."
cat > .env.local << EOF
# Configuration Lightning Network v2.0
LND_TLS_CERT="$LND_TLS_CERT"
LND_ADMIN_MACAROON="$LND_ADMIN_MACAROON"
LND_SOCKET="$LND_SOCKET"
EOF

echo "✅ Configuration terminée !"
echo "🧪 Test de la configuration..."

# Tester la configuration
npm run test:lightning
```

### 4. Configuration pour différents environnements

#### Développement local
```bash
# .env.local
LND_TLS_CERT="$(base64 -w0 ~/.lnd/tls.cert)"
LND_ADMIN_MACAROON="$(base64 -w0 ~/.lnd/data/chain/bitcoin/mainnet/admin.macaroon)"
LND_SOCKET="127.0.0.1:10009"
```

#### Production (Vercel)
```bash
# Variables d'environnement Vercel
vercel env add LND_TLS_CERT production
vercel env add LND_ADMIN_MACAROON production
vercel env add LND_SOCKET production
```

#### Docker
```yaml
# docker-compose.yml
version: '3.8'
services:
  daznode:
    build: .
    environment:
      - LND_TLS_CERT=${LND_TLS_CERT}
      - LND_ADMIN_MACAROON=${LND_ADMIN_MACAROON}
      - LND_SOCKET=lnd:10009
    depends_on:
      - lnd
      
  lnd:
    image: lightninglabs/lnd:latest
    ports:
      - "10009:10009"
    volumes:
      - lnd_data:/root/.lnd
```

### 5. Validation de la configuration

```bash
# Test complet
npm run test:lightning

# Test manuel de connectivité
telnet 127.0.0.1 10009

# Test LND CLI
lncli getinfo

# Vérification des variables
echo "Cert length: ${#LND_TLS_CERT}"
echo "Macaroon length: ${#LND_ADMIN_MACAROON}"
echo "Socket: $LND_SOCKET"
```

### 6. Dépannage courant

#### Problème : "LND_TLS_CERT requis"
```bash
# Solution
export LND_TLS_CERT="$(base64 -w0 ~/.lnd/tls.cert)"
```

#### Problème : "Nœud Lightning hors ligne"
```bash
# Vérifier le statut
lncli getinfo

# Redémarrer LND si nécessaire
pkill lnd
lnd
```

#### Problème : "Permission denied"
```bash
# Corriger les permissions
chmod 600 ~/.lnd/tls.cert
chmod 600 ~/.lnd/data/chain/bitcoin/mainnet/admin.macaroon
```

#### Problème : "Connection refused"
```bash
# Vérifier le port
netstat -an | grep 10009

# Vérifier le firewall
sudo ufw allow 10009
```

### 7. Sécurité

#### Bonnes pratiques
- ✅ Ne jamais commiter les certificats/macaroons
- ✅ Utiliser des variables d'environnement
- ✅ Restreindre l'accès réseau
- ✅ Utiliser HTTPS en production
- ✅ Surveiller les logs

#### Rotation des certificats
```bash
# Générer un nouveau certificat TLS
lncli stop
rm ~/.lnd/tls.cert ~/.lnd/tls.key
lnd --tlsextradomain=yourdomain.com

# Mettre à jour la variable
export LND_TLS_CERT="$(base64 -w0 ~/.lnd/tls.cert)"
```

### 8. Configuration avancée

#### Multi-nœuds (Future)
```bash
# Nœud principal
LND_PRIMARY_TLS_CERT="..."
LND_PRIMARY_MACAROON="..."
LND_PRIMARY_SOCKET="node1.example.com:10009"

# Nœud de secours
LND_BACKUP_TLS_CERT="..."
LND_BACKUP_MACAROON="..."
LND_BACKUP_SOCKET="node2.example.com:10009"
```

#### Monitoring
```bash
# Métriques Prometheus
LND_PROMETHEUS_ENABLED=true
LND_PROMETHEUS_PORT=8989

# Logs structurés
LND_LOG_LEVEL=debug
LND_LOG_FORMAT=json
```

## ✅ Checklist de déploiement

- [ ] LND installé et démarré
- [ ] Variables d'environnement configurées
- [ ] Test de connectivité réussi
- [ ] `npm run test:lightning` passe
- [ ] Application démarre sans erreur
- [ ] Génération de facture fonctionne
- [ ] Vérification de statut fonctionne
- [ ] Logs sans erreur Lightning

🎉 **Configuration terminée ! Votre système Lightning v2.0 est prêt !** ⚡ 