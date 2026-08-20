# FOOD DELIVERY APPLICATION

A full-stack food delivery application built using:

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- HTML
- CSS
- JavaScript

## Features

### Guest Users

- View home page
- View restaurants
- View restaurant menu
- View food details
- Login to order
- Register account

Guest users cannot:

- Add food to cart
- Access cart
- Checkout
- Place orders
- View orders

### Logged-in Users

- View restaurants
- View menus
- Add food to cart
- View cart
- Remove food
- Checkout
- Place orders
- View order history
- Logout

## Installation

Install dependencies:

npm install

## Environment

Create `.env`:

PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/food_delivery

SESSION_SECRET=food_delivery_secret_123456

## Seed Database

Run:

node seed.js

## Start Application

Run:

npm start

Open:

http://localhost:5000

## Application Flow

Guest:

Home
→ Restaurants
→ Restaurant Menu
→ Login to Order
→ Login

Logged In:

Home
→ Restaurants
→ Restaurant Menu
→ Add to Cart
→ Cart
→ Checkout
→ Place Order
→ My Orders