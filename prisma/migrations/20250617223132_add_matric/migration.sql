/*
  Warnings:

  - You are about to drop the column `email` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the `MenuItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isMatricNo_23120112027` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_menuItemId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropIndex
DROP INDEX "Customer_email_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "email",
ADD COLUMN     "isMatricNo_23120112027" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "menuItems" TEXT[];

-- DropTable
DROP TABLE "MenuItem";

-- DropTable
DROP TABLE "OrderItem";
