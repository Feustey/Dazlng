-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "marketCap" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeerOfPeer" (
    "id" TEXT NOT NULL,
    "nodePubkey" TEXT NOT NULL,
    "peerPubkey" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "total_fees" DOUBLE PRECISION NOT NULL,
    "avg_fee_rate_ppm" DOUBLE PRECISION NOT NULL,
    "total_capacity" DOUBLE PRECISION NOT NULL,
    "active_channels" INTEGER NOT NULL,
    "total_volume" DOUBLE PRECISION NOT NULL,
    "total_peers" INTEGER NOT NULL,
    "uptime" DOUBLE PRECISION NOT NULL,
    "opened_channel_count" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "closed_channel_count" INTEGER NOT NULL,
    "pending_channel_count" INTEGER NOT NULL,
    "avg_capacity" DOUBLE PRECISION NOT NULL,
    "avg_fee_rate" DOUBLE PRECISION NOT NULL,
    "avg_base_fee_rate" DOUBLE PRECISION NOT NULL,
    "betweenness_rank" INTEGER NOT NULL,
    "eigenvector_rank" INTEGER NOT NULL,
    "closeness_rank" INTEGER NOT NULL,
    "weighted_betweenness_rank" INTEGER NOT NULL,
    "weighted_closeness_rank" INTEGER NOT NULL,
    "weighted_eigenvector_rank" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeerOfPeer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL,
    "pubkey" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "total_fees" DOUBLE PRECISION NOT NULL,
    "avg_fee_rate_ppm" DOUBLE PRECISION NOT NULL,
    "total_capacity" DOUBLE PRECISION NOT NULL,
    "active_channels" INTEGER NOT NULL,
    "total_volume" DOUBLE PRECISION NOT NULL,
    "total_peers" INTEGER NOT NULL,
    "uptime" DOUBLE PRECISION NOT NULL,
    "opened_channel_count" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "closed_channel_count" INTEGER NOT NULL,
    "pending_channel_count" INTEGER NOT NULL,
    "avg_capacity" DOUBLE PRECISION NOT NULL,
    "avg_fee_rate" DOUBLE PRECISION NOT NULL,
    "avg_base_fee_rate" DOUBLE PRECISION NOT NULL,
    "betweenness_rank" INTEGER NOT NULL,
    "eigenvector_rank" INTEGER NOT NULL,
    "closeness_rank" INTEGER NOT NULL,
    "weighted_betweenness_rank" INTEGER NOT NULL,
    "weighted_closeness_rank" INTEGER NOT NULL,
    "weighted_eigenvector_rank" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "subscriptionStatus" TEXT,
    "subscriptionTier" TEXT,
    "subscriptionStartDate" TIMESTAMP(3),
    "subscriptionEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CentralityData" (
    "id" TEXT NOT NULL,
    "nodePubkey" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CentralityData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "nodePubkey" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkSummary" (
    "id" TEXT NOT NULL,
    "totalNodes" INTEGER NOT NULL,
    "totalChannels" INTEGER NOT NULL,
    "totalCapacity" DOUBLE PRECISION NOT NULL,
    "avgChannelSize" DOUBLE PRECISION NOT NULL,
    "medianFeeRate" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NetworkSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodeStats" (
    "id" TEXT NOT NULL,
    "nodePubkey" TEXT NOT NULL,
    "channelCount" INTEGER NOT NULL,
    "capacity" DOUBLE PRECISION NOT NULL,
    "feeRate" DOUBLE PRECISION NOT NULL,
    "uptime" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NodeStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "resetAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "History_date_idx" ON "History"("date");

-- CreateIndex
CREATE INDEX "PeerOfPeer_nodePubkey_idx" ON "PeerOfPeer"("nodePubkey");

-- CreateIndex
CREATE INDEX "PeerOfPeer_timestamp_idx" ON "PeerOfPeer"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Node_pubkey_key" ON "Node"("pubkey");

-- CreateIndex
CREATE INDEX "Node_timestamp_idx" ON "Node"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionId_key" ON "Session"("sessionId");

-- CreateIndex
CREATE INDEX "Session_sessionId_idx" ON "Session"("sessionId");

-- CreateIndex
CREATE INDEX "Session_email_idx" ON "Session"("email");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "VerificationCode_email_idx" ON "VerificationCode"("email");

-- CreateIndex
CREATE INDEX "VerificationCode_expiresAt_idx" ON "VerificationCode"("expiresAt");

-- CreateIndex
CREATE INDEX "CentralityData_nodePubkey_idx" ON "CentralityData"("nodePubkey");

-- CreateIndex
CREATE INDEX "CentralityData_metric_idx" ON "CentralityData"("metric");

-- CreateIndex
CREATE INDEX "CentralityData_timestamp_idx" ON "CentralityData"("timestamp");

-- CreateIndex
CREATE INDEX "Recommendation_nodePubkey_idx" ON "Recommendation"("nodePubkey");

-- CreateIndex
CREATE INDEX "Recommendation_type_idx" ON "Recommendation"("type");

-- CreateIndex
CREATE INDEX "Recommendation_status_idx" ON "Recommendation"("status");

-- CreateIndex
CREATE INDEX "NetworkSummary_timestamp_idx" ON "NetworkSummary"("timestamp");

-- CreateIndex
CREATE INDEX "NodeStats_nodePubkey_idx" ON "NodeStats"("nodePubkey");

-- CreateIndex
CREATE INDEX "NodeStats_timestamp_idx" ON "NodeStats"("timestamp");

-- CreateIndex
CREATE INDEX "RateLimit_ip_route_idx" ON "RateLimit"("ip", "route");

-- CreateIndex
CREATE INDEX "RateLimit_resetAt_idx" ON "RateLimit"("resetAt");

-- AddForeignKey
ALTER TABLE "PeerOfPeer" ADD CONSTRAINT "PeerOfPeer_nodePubkey_fkey" FOREIGN KEY ("nodePubkey") REFERENCES "Node"("pubkey") ON DELETE RESTRICT ON UPDATE CASCADE;
