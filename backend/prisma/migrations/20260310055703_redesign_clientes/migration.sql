-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pricePerColor" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "priceLinkType" TEXT NOT NULL DEFAULT 'Por estructura',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientTypeId" TEXT NOT NULL,
    "pricePerColor" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "priceLinkType" TEXT NOT NULL DEFAULT 'Por estructura',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarginConfig" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "clientTypeId" TEXT,
    "clientId" TEXT,
    "vol300" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "vol500" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "vol1T" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "vol3T" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "vol5T" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "vol10T" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "vol20T" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "vol30T" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "isOverride" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarginConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndirectCost" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndirectCost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plant_name_key" ON "Plant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_name_key" ON "Operation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ClientType_name_key" ON "ClientType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Client_name_clientTypeId_key" ON "Client"("name", "clientTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "MarginConfig_plantId_clientTypeId_clientId_key" ON "MarginConfig"("plantId", "clientTypeId", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "IndirectCost_plantId_name_key" ON "IndirectCost"("plantId", "name");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_clientTypeId_fkey" FOREIGN KEY ("clientTypeId") REFERENCES "ClientType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarginConfig" ADD CONSTRAINT "MarginConfig_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarginConfig" ADD CONSTRAINT "MarginConfig_clientTypeId_fkey" FOREIGN KEY ("clientTypeId") REFERENCES "ClientType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarginConfig" ADD CONSTRAINT "MarginConfig_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndirectCost" ADD CONSTRAINT "IndirectCost_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
