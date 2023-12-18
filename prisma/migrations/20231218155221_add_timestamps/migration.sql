/*
  Warnings:

  - Added the required column `updated_at` to the `bi-weekly` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `exercise_on_activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `food_on_diet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `bi-weekly` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `diet` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `exercise` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `exercise_on_activity` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `food` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `food_on_diet` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
