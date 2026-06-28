-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "bestseller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "colors" INTEGER,
ADD COLUMN     "premiumCents" INTEGER,
ADD COLUMN     "printProviders" INTEGER,
ADD COLUMN     "sizes" INTEGER,
ADD COLUMN     "styleNo" TEXT;
