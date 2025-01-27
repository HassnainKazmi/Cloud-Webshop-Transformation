-- 1- User:
-- Stores customer/user data for authentication and profile management.
CREATE TABLE User (
    user_id INT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(MAX) NOT NULL,
    address VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE()
);

-- 2- Product:
-- Stores product details. Image URL stores links to images in Azure Blob Storage.
CREATE TABLE Product (
    product_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(MAX),
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category_id INT NOT NULL FOREIGN KEY REFERENCES Category(category_id)
);

-- 3- Category:
-- Stores product category information to normalize the Products table.
CREATE TABLE Category (
    category_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 4- Inventory:
-- Tracks stock levels and supplier information.
CREATE TABLE Inventory (
    inventory_id INT PRIMARY KEY,
    stock_quantity INT NOT NULL,
    stock_level VARCHAR(50) NOT NULL, -- High, Medium, Low, Out of Stock
    supplier VARCHAR(50),
    product_id INT NOT NULL FOREIGN KEY REFERENCES Product(product_id)
);

-- 5- Order:
-- Stores high-level information about user orders.
CREATE TABLE Order (
    order_id INT PRIMARY KEY,
    order_date DATETIME DEFAULT GETDATE(),
    total_price DECIMAL(10, 2) NOT NULL,
    item_count INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    user_id INT NOT NULL FOREIGN KEY REFERENCES User(user_id),
    payment_id INT UNIQUE FOREIGN KEY REFERENCES Payment(payment_id)
);

-- 6- Payment:
-- Tracks payment details (mock-up for integration with payment gateways).
CREATE TABLE Payment (
    payment_id INT PRIMARY KEY,
    payment_method VARCHAR(50), -- e.g., 'PayPal', 'Credit Card'
    payment_status VARCHAR(50) DEFAULT 'Pending',
    payment_date DATETIME DEFAULT GETDATE()
);
