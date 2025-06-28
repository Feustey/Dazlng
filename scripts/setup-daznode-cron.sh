#!/bin/bash

# Vérifier qu'on est root
if [ "$EUID" -ne 0 ]; then
  echo "Ce script doit être exécuté en tant que root"
  exit 1
fi

# Créer le dossier pour les logs
mkdir -p /var/log/daznode

# Créer le script de log des performances
cat > /usr/local/bin/log-daznode-performance.js << 'EOL'
#!/usr/bin/env node

const { dazNodePerformanceService } = require('../lib/services/daznode-performance-service');
const { getSupabaseAdminClient } = require('../lib/supabase');

async function logAllNodesPerformance() {
  const supabase = getSupabaseAdminClient();
  
  try {
    // Récupérer tous les abonnements actifs
    const { data: subscriptions, error } = await supabase
      .from('daznode_subscriptions')
      .select('pubkey')
      .eq('payment_status', 'paid')
      .gte('end_date', new Date().toISOString());

    if (error) throw error;

    console.log(`📊 Logging performance pour ${subscriptions.length} nœuds...`);

    // Logger les performances pour chaque nœud
    for (const sub of subscriptions) {
      try {
        await dazNodePerformanceService.logNodePerformance(sub.pubkey);
        console.log(`✅ Performance loggée pour ${sub.pubkey}`);
      } catch (err) {
        console.error(`❌ Erreur pour ${sub.pubkey}:`, err);
      }
    }

  } catch (error) {
    console.error('❌ Erreur globale:', error);
    process.exit(1);
  }
}

logAllNodesPerformance();
EOL

# Rendre le script exécutable
chmod +x /usr/local/bin/log-daznode-performance.js

# Créer le service systemd
cat > /etc/systemd/system/daznode-performance.service << EOL
[Unit]
Description=DazNode Performance Logger
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/log-daznode-performance.js
User=daznode
Group=daznode
StandardOutput=append:/var/log/daznode/performance.log
StandardError=append:/var/log/daznode/performance.error.log

[Install]
WantedBy=multi-user.target
EOL

# Créer le timer systemd (toutes les 24h)
cat > /etc/systemd/system/daznode-performance.timer << EOL
[Unit]
Description=Run DazNode Performance Logger daily

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
EOL

# Recharger systemd
systemctl daemon-reload

# Activer et démarrer le timer
systemctl enable daznode-performance.timer
systemctl start daznode-performance.timer

# Créer la rotation des logs
cat > /etc/logrotate.d/daznode << EOL
/var/log/daznode/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0640 daznode daznode
}
EOL

echo "✅ Configuration du cron DazNode terminée !"
echo "📊 Les performances seront loggées quotidiennement"
echo "📝 Logs disponibles dans /var/log/daznode/" 