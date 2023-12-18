/*
  Warnings:

  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `test`;

-- CreateTable
CREATE TABLE `user` (
    `user_id` VARCHAR(36) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `age` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bi-weekly` (
    `week_time` CHAR(7) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `height` DOUBLE NOT NULL,
    `weight` DOUBLE NOT NULL,

    PRIMARY KEY (`week_time`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food` (
    `food_id` VARCHAR(191) NOT NULL,
    `food_name` VARCHAR(100) NOT NULL,
    `calorie_amount` DOUBLE NOT NULL,

    PRIMARY KEY (`food_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diet` (
    `date_time` CHAR(10) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`date_time`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food_on_diet` (
    `user_id` VARCHAR(36) NOT NULL,
    `date_time` CHAR(10) NOT NULL,
    `food_id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,

    PRIMARY KEY (`user_id`, `date_time`, `food_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exercise` (
    `exercise_id` VARCHAR(191) NOT NULL,
    `exercise_name` VARCHAR(100) NOT NULL,
    `unit` VARCHAR(20) NOT NULL,
    `calorie_burned` DOUBLE NOT NULL,

    PRIMARY KEY (`exercise_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity` (
    `date_time` CHAR(10) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`date_time`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exercise_on_activity` (
    `user_id` VARCHAR(36) NOT NULL,
    `date_time` CHAR(10) NOT NULL,
    `exercise_id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,

    PRIMARY KEY (`user_id`, `date_time`, `exercise_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bi-weekly` ADD CONSTRAINT `bi-weekly_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `diet` ADD CONSTRAINT `diet_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `food_on_diet` ADD CONSTRAINT `food_on_diet_user_id_date_time_fkey` FOREIGN KEY (`user_id`, `date_time`) REFERENCES `diet`(`user_id`, `date_time`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `food_on_diet` ADD CONSTRAINT `food_on_diet_food_id_fkey` FOREIGN KEY (`food_id`) REFERENCES `food`(`food_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity` ADD CONSTRAINT `activity_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exercise_on_activity` ADD CONSTRAINT `exercise_on_activity_user_id_date_time_fkey` FOREIGN KEY (`user_id`, `date_time`) REFERENCES `activity`(`user_id`, `date_time`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exercise_on_activity` ADD CONSTRAINT `exercise_on_activity_exercise_id_fkey` FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`exercise_id`) ON DELETE NO ACTION ON UPDATE CASCADE;
