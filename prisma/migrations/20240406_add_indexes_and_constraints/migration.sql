-- Ajout des index pour History
CREATE INDEX "History_marketCap_idx" ON "History"("marketCap");

-- Ajout des index pour PeerOfPeer
CREATE INDEX "PeerOfPeer_peerPubkey_idx" ON "PeerOfPeer"("peerPubkey");
CREATE INDEX "PeerOfPeer_platform_idx" ON "PeerOfPeer"("platform");
CREATE INDEX "PeerOfPeer_total_capacity_idx" ON "PeerOfPeer"("total_capacity");
CREATE INDEX "PeerOfPeer_active_channels_idx" ON "PeerOfPeer"("active_channels");

-- Ajout des index pour Node
CREATE INDEX "Node_platform_idx" ON "Node"("platform");
CREATE INDEX "Node_total_capacity_idx" ON "Node"("total_capacity");
CREATE INDEX "Node_active_channels_idx" ON "Node"("active_channels");
CREATE INDEX "Node_betweenness_rank_idx" ON "Node"("betweenness_rank");
CREATE INDEX "Node_eigenvector_rank_idx" ON "Node"("eigenvector_rank");
CREATE INDEX "Node_closeness_rank_idx" ON "Node"("closeness_rank");

-- Ajout des index pour NetworkSummary
CREATE INDEX "NetworkSummary_totalCapacity_idx" ON "NetworkSummary"("totalCapacity");
CREATE INDEX "NetworkSummary_avgChannelSize_idx" ON "NetworkSummary"("avgChannelSize");

-- Ajout des index pour NodeStats
CREATE INDEX "NodeStats_capacity_idx" ON "NodeStats"("capacity");
CREATE INDEX "NodeStats_channelCount_idx" ON "NodeStats"("channelCount");

-- Modification des colonnes pour utiliser Decimal
ALTER TABLE "History" 
  ALTER COLUMN "price" TYPE DECIMAL(20,8),
  ALTER COLUMN "volume" TYPE DECIMAL(20,8),
  ALTER COLUMN "marketCap" TYPE DECIMAL(20,8);

ALTER TABLE "PeerOfPeer"
  ALTER COLUMN "total_fees" TYPE DECIMAL(20,8),
  ALTER COLUMN "avg_fee_rate_ppm" TYPE DECIMAL(10,2),
  ALTER COLUMN "total_capacity" TYPE DECIMAL(20,8),
  ALTER COLUMN "total_volume" TYPE DECIMAL(20,8),
  ALTER COLUMN "uptime" TYPE DECIMAL(10,2),
  ALTER COLUMN "avg_capacity" TYPE DECIMAL(20,8),
  ALTER COLUMN "avg_fee_rate" TYPE DECIMAL(10,2),
  ALTER COLUMN "avg_base_fee_rate" TYPE DECIMAL(10,2);

ALTER TABLE "Node"
  ALTER COLUMN "total_fees" TYPE DECIMAL(20,8),
  ALTER COLUMN "avg_fee_rate_ppm" TYPE DECIMAL(10,2),
  ALTER COLUMN "total_capacity" TYPE DECIMAL(20,8),
  ALTER COLUMN "total_volume" TYPE DECIMAL(20,8),
  ALTER COLUMN "uptime" TYPE DECIMAL(10,2),
  ALTER COLUMN "avg_capacity" TYPE DECIMAL(20,8),
  ALTER COLUMN "avg_fee_rate" TYPE DECIMAL(10,2),
  ALTER COLUMN "avg_base_fee_rate" TYPE DECIMAL(10,2);

ALTER TABLE "NetworkSummary"
  ALTER COLUMN "totalCapacity" TYPE DECIMAL(20,8),
  ALTER COLUMN "avgChannelSize" TYPE DECIMAL(20,8),
  ALTER COLUMN "medianFeeRate" TYPE DECIMAL(10,2);

ALTER TABLE "NodeStats"
  ALTER COLUMN "capacity" TYPE DECIMAL(20,8),
  ALTER COLUMN "feeRate" TYPE DECIMAL(10,2),
  ALTER COLUMN "uptime" TYPE DECIMAL(10,2); 