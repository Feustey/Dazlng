-- CreateEnum
CREATE TYPE "CheckoutSessionStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "categories" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- Création ou modification de la table checkout_sessions si elle n'existe pas déjà
CREATE TABLE IF NOT EXISTS "checkout_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "plan" TEXT,
    "status" "CheckoutSessionStatus" NOT NULL DEFAULT 'pending',
    "payment_url" TEXT,
    "payment_hash" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'sat',
    "products" JSONB,
    "delivery_info" JSONB,
    "payment_info" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkout_sessions_pkey" PRIMARY KEY ("id")
); 