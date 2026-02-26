-- CreateEnum
CREATE TYPE "AgentSpecialty" AS ENUM ('LUXURY', 'RESIDENTIAL', 'COMMERCIAL', 'NEW_CONSTRUCTION');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "agentBio" TEXT,
ADD COLUMN     "agentPhone" TEXT,
ADD COLUMN     "agentPhoto" TEXT,
ADD COLUMN     "isAgent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specialty" "AgentSpecialty";
