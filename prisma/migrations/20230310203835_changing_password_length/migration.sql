-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT;
