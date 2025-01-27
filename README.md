# Database Schema: Table Creation Script

This repository contains an SQL script for creating the core tables for the **Cloud Webshop Transformation** project. The script sets up tables to manage User, Product, Inventory, Order, Payment, Category and OrderItems.

## **Tables Included**
1. **User**: Stores  customer information, including authentication credentials and personal details.
2. **Product**: Stores details such as the name, description, pricing, and category of the product. It also contains a link to the product's image hosted externally in Azure Blob Storage.
3. **Category**: Stores product category information. Each category can be associated with multiple products.
4. **Inventory**: The inventory table is used for managing stock quantity and its availability status. It includes details like the supplier's information and stock level categorization (high, medium, low, out of stock).
5. **Order**: This table manages the core details of the order, such as the total price, order status (e.g., Pending, Shipped), the user who placed the order, and the associated payment information.
6. **Payment**: The Payment table handles the details of the payment transaction, including the payment method used (e.g., PayPal, Credit Card), its current status, and the payment date.
7. **OrderItems**: This table acts as a junction between orders and the products in those orders, storing details such as product quantity and individual product price.
