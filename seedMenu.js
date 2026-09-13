const mongoose = require('mongoose');
require('dotenv').config();

// Sahi Model import karein jo server.js mein use ho raha hai
const Product = require('./models/Product');

const standardPizzaSizes = [
  { size: 'Small', price: 550 },
  { size: 'Medium', price: 1150 },
  { size: 'Large', price: 1600 },
  { size: 'Family', price: 1900 }
];

const specialPizzaSizes = [
  { size: 'Small', price: 700 },
  { size: 'Medium', price: 1350 },
  { size: 'Large', price: 1750 },
  { size: 'Family', price: 2200 }
];

const menuItems = [
  // ==========================================
  // --- PIZZAS (Standard 4 Sizes) ---
  // ==========================================
  { name: "Chicken Tikah Pizza", category: "Pizzas", description: "Spiced chicken tikka chunks with onions and herbs.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: standardPizzaSizes },
  { name: "Hot & Spicy Pizza", category: "Pizzas", description: "Spicy Mexican chicken chunks, jalapenos & hot sauce.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: standardPizzaSizes },
  { name: "Creamy Tikah Pizza", category: "Pizzas", description: "Creamy chicken tikka chunks with rich white sauce.", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: standardPizzaSizes },
  { name: "Chicken Fajita Pizza", category: "Pizzas", description: "Marinated fajita chicken, onions, bell peppers & mozzarella.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: standardPizzaSizes },
  { name: "Cheese Stick Pizza", category: "Pizzas", description: "Cheesy garlic base topped with extra mozzarella.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: standardPizzaSizes },
  { name: "Cheese Lover Pizza", category: "Pizzas", description: "Loaded with mozzarella and cheddar cheese blend.", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: standardPizzaSizes },
  { name: "Chicken Italian Pizza", category: "Pizzas", description: "Italian herbs, sausages, mushrooms & savory sauce.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: standardPizzaSizes },
  { name: "Chicken Achari Pizza", category: "Pizzas", description: "Tangy pickled achari chicken chunks with onions.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: standardPizzaSizes },
  { name: "Vegetarian Pizza", category: "Pizzas", description: "Mushrooms, black olives, sweet corn, bell peppers & onions.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: standardPizzaSizes },
  { name: "Extra Topping Pizza", category: "Pizzas", description: "Loaded with double chicken chunks, extra cheese & toppings.", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: standardPizzaSizes },

  // ==========================================
  // --- MUNEEB SPECIAL PIZZAS (Special 4 Sizes) ---
  // ==========================================
  { name: "Muneeb Special Pizza", category: "Muneeb Special Pizzas", description: "Chef secret recipe pizza with extra sausages & toppings.", image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: specialPizzaSizes },
  { name: "Chicken Cheese Crust Pizza", category: "Muneeb Special Pizzas", description: "Crust stuffed fully with cheese and chicken fillings.", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: specialPizzaSizes },
  { name: "Crown Crust Pizza", category: "Muneeb Special Pizzas", description: "Royal crown shaped crust stuffed with seekh kebab pockets.", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: specialPizzaSizes },
  { name: "Special Chicken Tikka Pizza", category: "Muneeb Special Pizzas", description: "Extra grilled chicken tikka cubes & loaded mozzarella.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: specialPizzaSizes },
  { name: "B.B.Q Pizza", category: "Muneeb Special Pizzas", description: "Smoky BBQ flavor with grilled chicken, olives & capsicum.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: specialPizzaSizes },
  { name: "Malai Botti Pizza", category: "Muneeb Special Pizzas", description: "Tender creamy malai boti pieces with premium white cheese.", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: specialPizzaSizes },
  { name: "Four Season Pizza", category: "Muneeb Special Pizzas", description: "Four quarters with four distinct flavors in one pizza.", image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: specialPizzaSizes },
  { name: "Kabab Crust Pizza", category: "Muneeb Special Pizzas", description: "Seekh kababs baked directly into the outer crust ring.", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: specialPizzaSizes },
  { name: "Lazania Pizza", category: "Muneeb Special Pizzas", description: "Fusion of lasagna sauce, pasta sheets & mozzarella.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: specialPizzaSizes },
  { name: "Chicken Cheese Stuff Pizza", category: "Muneeb Special Pizzas", description: "Filled base stuffed with rich melted cheese and chicken.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: specialPizzaSizes },
  { name: "Zinger Cheese Alfredo Pizza", category: "Muneeb Special Pizzas", description: "Crispy zinger bites on creamy Alfredo garlic cheese sauce.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&auto=format&fit=crop&q=80", hasSizes: true, sizes: specialPizzaSizes },

  // ==========================================
  // --- DEALS ---
  // ==========================================
  { name: "Deal.1", category: "Deals", price: 800, description: "1 Small Pizza, 5 Hot Wings, Half Liter Drink", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.2", category: "Deals", price: 850, description: "2 Zinger Burger, Small Fries, Half Liter Drink", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.3", category: "Deals", price: 450, description: "1 Zinger Burger, 1 Regular Fries, 1 Regular Drink", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.4", category: "Deals", price: 1200, description: "1 Small Pizza, 2 Peti Burger, 1 Small Fries, Half Liter Drink", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.5", category: "Deals", price: 1750, description: "1 Medium Pizza, 2 Zinger Burger, 2 Regular Fries, 1 Liter Drink", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.6", category: "Deals", price: 1850, description: "1 Medium Pizza, 12 Hot Wings, 2 Regular Fries, 1 Liter Drink", image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.7", category: "Deals", price: 2200, description: "6 Zinger Burger, 1 Liter Drink, 2 Regular Fries", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.8", category: "Deals", price: 2250, description: "1 Large Pizza, 10 Nuggets, 1 Medium Fries, 1.5 Liter Drink", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.9", category: "Deals", price: 1600, description: "5 Peti Burger, 2 Regular Fries, 1.5 Liter Drink", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.10", category: "Deals", price: 3200, description: "1 Large Pizza, 2 Zinger Burger, 10 Hot Wings, Mayo Garlic Fries, 1.5 Liter Drink", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80" },
  { name: "Birthday Deal", category: "Deals", price: 6500, description: "2 Family Pizza, 5 Grill Burger, 20 Grill Wings, 1 Pound Cake, 4 Fries, 2 Drink 1.5 Ltr", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=450&auto=format&fit=crop&q=80" },
  { name: "Limousine Pizza", category: "Deals", price: 3500, description: "Giant Limousine Pizza + 2 Ltr Drink", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80" },
  { name: "Muneeb Special Plater", category: "Deals", price: 3000, description: "10 Nuggets, 10 Hot wings, 10 Grill wings, 1 Large Pizza, 1 Drink 1.5 Ltr", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=450&auto=format&fit=crop&q=80" },

  // ==========================================
  // --- BURGERS ---
  // ==========================================
  { name: "Zinger Burger", category: "Burgers", price: 350, description: "Crispy chicken fillet with signature mayo and fresh lettuce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=450&auto=format&fit=crop&q=80" },
  { name: "Beef Lover Burger", category: "Burgers", price: 500, description: "Juicy beef patty grilled to perfection with special burger sauce.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=450&auto=format&fit=crop&q=80" },
  { name: "Cheese Zinger Burger", category: "Burgers", price: 400, description: "Crispy zinger fillet topped with melted cheddar cheese slice.", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=450&auto=format&fit=crop&q=80" },
  { name: "Chicken Patty Burger", category: "Burgers", price: 300, description: "Tender seasoned chicken patty with fresh coleslaw and sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=450&auto=format&fit=crop&q=80" },
  { name: "Cheese Chicken Patty Burger", category: "Burgers", price: 350, description: "Chicken patty burger loaded with melted cheese slice.", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=450&auto=format&fit=crop&q=80" },
  { name: "Student Burger", category: "Burgers", price: 280, description: "Classic pocket-friendly crispy chicken burger.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=450&auto=format&fit=crop&q=80" },
  { name: "Grill Burger", category: "Burgers", price: 400, description: "Charred and juicy grilled chicken breast with smoky sauce.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=450&auto=format&fit=crop&q=80" },
  { name: "Tower Burger", category: "Burgers", price: 460, description: "Double crispy fillet with hashbrown and cheese slice.", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=450&auto=format&fit=crop&q=80" },
  { name: "Lava Burger", category: "Burgers", price: 400, description: "Loaded with flowing cheese lava and spicy dressing.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=450&auto=format&fit=crop&q=80" },
  { name: "Pizza Burger", category: "Burgers", price: 500, description: "Fusion burger stuffed with pizza sauce, toppings and mozzarella.", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=450&auto=format&fit=crop&q=80" },
  { name: "Club Burger", category: "Burgers", price: 300, description: "Multi-layered classic club style chicken burger.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=450&auto=format&fit=crop&q=80" },
  { name: "American Delight Burger", category: "Burgers", price: 700, description: "Heavy double patty gourmet burger with premium toppings.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=450&auto=format&fit=crop&q=80" },
  { name: "Chicken Achari Burger", category: "Burgers", price: 300, description: "Desi achari flavored crispy chicken patty with tangy sauces.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=450&auto=format&fit=crop&q=80" },

  // ==========================================
  // --- SHAWARMA ---
  // ==========================================
  { name: "Chicken Shawarma", category: "Shawarma", price: 250, description: "Classic shredded chicken with garlic mayo sauce.", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=450&auto=format&fit=crop&q=80" },
  { name: "Cheese Chicken Shawarma", category: "Shawarma", price: 300, description: "Loaded with melted cheddar cheese slice.", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=450&auto=format&fit=crop&q=80" },
  { name: "Grill Shawarma", category: "Shawarma", price: 300, description: "Juicy charred grilled chicken with special sauce.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=450&auto=format&fit=crop&q=80" },
  { name: "Cheese Grill Shawarma", category: "Shawarma", price: 350, description: "Grilled chicken loaded with melted cheddar cheese.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=450&auto=format&fit=crop&q=80" },
  { name: "Zinger Shawarma", category: "Shawarma", price: 300, description: "Crispy zinger fillet strips inside soft shawarma pita.", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=450&auto=format&fit=crop&q=80" },
  { name: "Cheese Zinger Shawarma", category: "Shawarma", price: 350, description: "Crispy zinger strips topped with rich melted cheese.", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=450&auto=format&fit=crop&q=80" },
  { name: "Plater Shawarma", category: "Shawarma", price: 590, description: "Open platter chicken shawarma served with fries and dips.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=450&auto=format&fit=crop&q=80" },
  { name: "Chicken Achari Shawarma", category: "Shawarma", price: 250, description: "Tangy pickled achari chicken chunks with onions.", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=450&auto=format&fit=crop&q=80" },
  { name: "Malai Boti Shawarma", category: "Shawarma", price: 300, description: "Creamy tender malai boti pieces inside shawarma bread.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=450&auto=format&fit=crop&q=80" },

  // ==========================================
  // --- HOT WINGS & SNACKS (6p / 12p Variants) ---
  // ==========================================
  {
    name: "Hot Wings",
    category: "Wings",
    description: "Spicy crispy fried chicken hot wings.",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "6 pcs", price: 300 },
      { size: "12 pcs", price: 600 }
    ]
  },
  {
    name: "Nuggets",
    category: "Wings",
    description: "Crispy golden tender chicken nuggets.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "6 pcs", price: 250 },
      { size: "12 pcs", price: 500 }
    ]
  },
  {
    name: "Bar BQ Honey Wings",
    category: "Wings",
    description: "Glazed in sweet honey and smoky BBQ sauce.",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "6 pcs", price: 300 },
      { size: "12 pcs", price: 600 }
    ]
  },
  {
    name: "Buffalo Wings",
    category: "Wings",
    description: "Tossed in tangy and spicy buffalo hot sauce.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "6 pcs", price: 300 },
      { size: "12 pcs", price: 600 }
    ]
  },
  {
    name: "Grill Wings",
    category: "Wings",
    description: "Charred and seasoned juicy grilled chicken wings.",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "6 pcs", price: 300 },
      { size: "12 pcs", price: 600 }
    ]
  },
  {
    name: "Hot Shots",
    category: "Wings",
    description: "Bite-sized crispy and spicy boneless chicken shots.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "6 pcs", price: 300 },
      { size: "12 pcs", price: 600 }
    ]
  },

  // ==========================================
  // --- PASTA (Small: 400 / Large: 700) ---
  // ==========================================
  {
    name: "White Sauce Pasta",
    category: "Pasta",
    description: "Rich creamy white sauce pasta with tender chicken chunks and mushrooms.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "Small", price: 400 },
      { size: "Large", price: 700 }
    ]
  },
  {
    name: "Red Sauce Pasta",
    category: "Pasta",
    description: "Tangy tomato Italian red herb sauce pasta with chicken bits.",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281298?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "Small", price: 400 },
      { size: "Large", price: 700 }
    ]
  },
  {
    name: "Crunchi Pasta",
    category: "Pasta",
    description: "Creamy cheesy pasta topped with crispy crunchy zinger bits.",
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "Small", price: 400 },
      { size: "Large", price: 700 }
    ]
  },
  {
    name: "Macaroni Pasta",
    category: "Pasta",
    description: "Classic elbow macaroni seasoned with desi herbs and chicken cubes.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "Small", price: 400 },
      { size: "Large", price: 700 }
    ]
  },
  {
    name: "Chicken Creamy Pasta",
    category: "Pasta",
    description: "Extra loaded white cream and melted mozzarella cheese pasta.",
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "Small", price: 400 },
      { size: "Large", price: 700 }
    ]
  },

  // ==========================================
  // --- PRATHA ROLLS ---
  // ==========================================
  { name: "Twister Pratha", category: "Pratha Roll", price: 300, description: "Crispy flaky pratha wrapped around spicy tender chicken chunks.", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=450&auto=format&fit=crop&q=80" },
  { name: "Twister Cheese Paratha", category: "Pratha Roll", price: 350, description: "Crispy twister pratha loaded with melted cheddar cheese slice.", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=450&auto=format&fit=crop&q=80" },
  { name: "Zinger Paratha", category: "Pratha Roll", price: 350, description: "Crisp golden pratha stuffed with crispy zinger fillet strips.", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=450&auto=format&fit=crop&q=80" },
  { name: "Zinger Cheese Paratha", category: "Pratha Roll", price: 400, description: "Crunchy zinger fillet strips wrapped with warm melted cheese.", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=450&auto=format&fit=crop&q=80" },
  { name: "Grill Pratha", category: "Pratha Roll", price: 300, description: "Juicy charred grilled chicken chunks seasoned with herbs.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=450&auto=format&fit=crop&q=80" },
  { name: "Grill Cheese Pratha", category: "Pratha Roll", price: 400, description: "Charred grilled chicken chunks paired with extra cheese in crispy pratha.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=450&auto=format&fit=crop&q=80" },
  { name: "Malai Boti Pratha", category: "Pratha Roll", price: 300, description: "Tender, melt-in-mouth creamy malai boti rolled in flaky desi pratha.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=450&auto=format&fit=crop&q=80" },

  // ==========================================
  // --- WRAPS ---
  // ==========================================
  { name: "Arabic Roll", category: "Wraps", price: 450, description: "Authentic Arabic style shredded chicken wrap with garlic dip sauce.", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=450&auto=format&fit=crop&q=80" },
  { name: "Smoky Grill Wrap", category: "Wraps", price: 450, description: "Smoky flavored grilled chicken strips wrapped with fresh salad & sauce.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=450&auto=format&fit=crop&q=80" },
  { name: "Grill Cheese Wrap", category: "Wraps", price: 450, description: "Charred grilled chicken chunks paired with warm melted cheddar cheese.", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=450&auto=format&fit=crop&q=80" },
  { name: "Atalian Grill Cheez Wrap", category: "Wraps", price: 450, description: "Italian herbs seasoned grilled chicken wrap loaded with melted mozzarella.", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=450&auto=format&fit=crop&q=80" },

  // ==========================================
  // --- FRIES (S / M / L Variants) ---
  // ==========================================
  {
    name: "Plain Fries",
    category: "Fries",
    description: "Crispy golden salted french fries served fresh.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "Small", price: 200 },
      { size: "Medium", price: 300 },
      { size: "Large", price: 400 }
    ]
  },
  {
    name: "Cheese Fries",
    category: "Fries",
    description: "Golden fries smothered in rich warm melted cheddar cheese sauce.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "Small", price: 250 },
      { size: "Medium", price: 400 },
      { size: "Large", price: 600 }
    ]
  },
  {
    name: "Garlic Mayo Fries",
    category: "Fries",
    description: "Crispy fries drizzled generously with thick garlic mayonnaise sauce.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "Small", price: 220 },
      { size: "Medium", price: 350 },
      { size: "Large", price: 520 }
    ]
  },
  {
    name: "Loaded Fries",
    category: "Fries",
    description: "Fries fully loaded with cheese sauce, crispy chicken bits & jalapenos.",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=450&auto=format&fit=crop&q=80",
    hasSizes: true,
    sizes: [
      { size: "Small", price: 360 },
      { size: "Large", price: 590 }
    ]
  },

  // ==========================================
  // --- SANDWICHES ---
  // ==========================================
  { name: "Panini Grill Sandwich", category: "Sandwich", price: 450, description: "Crisp pressed panini bread stuffed with seasoned chicken shreds.", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=450&auto=format&fit=crop&q=80" },
  { name: "Panini Grill Cheese Sandwich", category: "Sandwich", price: 400, description: "Pressed panini stuffed with savory chicken and melted cheese.", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=450&auto=format&fit=crop&q=80" },
  { name: "House & Club Sandwich", category: "Sandwich", price: 400, description: "Classic triple-decker toasted club sandwich served with fries.", image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=450&auto=format&fit=crop&q=80" },
  { name: "House & Club Cheese Sandwich", category: "Sandwich", price: 400, description: "Triple-layered toasted club sandwich layered with cheese.", image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=450&auto=format&fit=crop&q=80" },
  { name: "Grill Sandwich", category: "Sandwich", price: 400, description: "Golden toasted bread filled with juicy grilled chicken shreds.", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=450&auto=format&fit=crop&q=80" },
  { name: "Grill Cheese Sandwich", category: "Sandwich", price: 450, description: "Toasted sandwich filled with grilled chicken and loaded melted cheddar.", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=450&auto=format&fit=crop&q=80" }
];

async function seedDatabase() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/muneeb_fast_food';

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Database connected successfully.');

    // Purane items ko clear karein taake duplicates na hon
    const clearResult = await Product.deleteMany({});
    console.log(`Cleared ${clearResult.deletedCount} previous items from Product collection.`);

    // Tamam new menu items insert karein
    const inserted = await Product.insertMany(menuItems);
    console.log(`Successfully seeded ${inserted.length} menu items into MongoDB!`);

    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding process failed:', err.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedDatabase();