-- Create User table
CREATE TABLE `user` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(30) NOT NULL,
    `email` VARCHAR(70) NOT NULL,
    `address` VARCHAR(200) DEFAULT NULL,
    `is_admin` BOOLEAN DEFAULT FALSE
);

-- Create Category table
CREATE TABLE `category` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(80) NOT NULL UNIQUE
);

-- Create Product table
CREATE TABLE `product` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(80) NOT NULL,
    `price` FLOAT NOT NULL,
    `category_id` INT NOT NULL,
    FOREIGN KEY (`category_id`) REFERENCES `category`(`id`)
);

-- Create Inventory table
CREATE TABLE `inventory` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL UNIQUE,
    `stock_quantity` INT NOT NULL,
    `stock_level` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
);

-- Create Order table
CREATE TABLE `order` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `order_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `total_price` FLOAT NOT NULL,
    `items_count` INT NOT NULL,
    `status` ENUM('IN_PROCESS', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'IN_PROCESS',
    `user_id` INT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Create OrderItem table
CREATE TABLE `order_item` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    FOREIGN KEY (`order_id`) REFERENCES `order`(`id`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
);

-- Create Payment table
CREATE TABLE `payment` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `order_id` INT NOT NULL,
    `amount` FLOAT NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `payment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`order_id`) REFERENCES `order`(`id`)
);
