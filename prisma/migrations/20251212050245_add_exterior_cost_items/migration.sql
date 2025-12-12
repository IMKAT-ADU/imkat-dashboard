-- CreateTable
CREATE TABLE "ExteriorCostItem" (
    "id" TEXT NOT NULL,
    "btName" TEXT NOT NULL,
    "costGroup" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "exteriorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExteriorCostItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExteriorCostItem_exteriorId_btName_key" ON "ExteriorCostItem"("exteriorId", "btName");

-- AddForeignKey
ALTER TABLE "ExteriorCostItem" ADD CONSTRAINT "ExteriorCostItem_exteriorId_fkey" FOREIGN KEY ("exteriorId") REFERENCES "Exterior"("id") ON DELETE CASCADE ON UPDATE CASCADE;
