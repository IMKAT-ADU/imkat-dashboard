-- CreateTable
CREATE TABLE "IFPMapping" (
    "id" TEXT NOT NULL,
    "ifpKey" TEXT NOT NULL,
    "btName" TEXT NOT NULL,
    "costGroup" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IFPMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationMarkup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "markup" DOUBLE PRECISION NOT NULL,
    "mappingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationMarkup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IFPMapping_ifpKey_key" ON "IFPMapping"("ifpKey");

-- CreateIndex
CREATE UNIQUE INDEX "LocationMarkup_mappingId_name_key" ON "LocationMarkup"("mappingId", "name");

-- AddForeignKey
ALTER TABLE "LocationMarkup" ADD CONSTRAINT "LocationMarkup_mappingId_fkey" FOREIGN KEY ("mappingId") REFERENCES "IFPMapping"("id") ON DELETE CASCADE ON UPDATE CASCADE;
