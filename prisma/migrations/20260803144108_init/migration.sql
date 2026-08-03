-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'STAFF');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "buyerPhone" TEXT,
    "recipientName" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "giftMessage" TEXT,
    "deliveryNotes" TEXT,
    "deliveryAddress" TEXT NOT NULL,
    "deliveryDateWanted" TIMESTAMP(3),
    "collectionSlug" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "totalCentavos" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "paymongoCheckoutSessionId" TEXT,
    "paymongoPaymentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "courierName" TEXT,
    "trackingNumber" TEXT,
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "guideToken" TEXT NOT NULL,
    "guideFirstScannedAt" TIMESTAMP(3),
    "guideScanCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_events" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'paymongo',
    "externalId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "raw" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_log" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "template" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "resendId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "email_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_applications" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "audience" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'STAFF',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "orders_paymongoCheckoutSessionId_key" ON "orders"("paymongoCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_guideToken_key" ON "orders"("guideToken");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "order_events_orderId_createdAt_idx" ON "order_events"("orderId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_externalId_key" ON "webhook_events"("externalId");

-- CreateIndex
CREATE INDEX "webhook_events_processedAt_idx" ON "webhook_events"("processedAt");

-- CreateIndex
CREATE INDEX "email_log_createdAt_idx" ON "email_log"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "email_log_orderId_template_key" ON "email_log"("orderId", "template");

-- CreateIndex
CREATE INDEX "affiliate_applications_createdAt_idx" ON "affiliate_applications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "order_events" ADD CONSTRAINT "order_events_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_log" ADD CONSTRAINT "email_log_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
