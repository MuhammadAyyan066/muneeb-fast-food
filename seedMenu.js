const mongoose = require('mongoose');
require('dotenv').config();

// Load the MenuItem model
const MenuItem = require('./models/MenuItem');

const menuItems = [
  // --- DEALS ---
  { name: "Deal.1", category: "Deals", price: "800/-", time: "15 min", rating: "4.8 (45)", desc: "1 Small Pizza, 5 Hot Wings, Half Liter Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.2", category: "Deals", price: "850/-", time: "15 min", rating: "4.7 (50)", desc: "2 Zinger Burger, Small Fries, Half Liter Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.3", category: "Deals", price: "450/-", time: "12 min", rating: "4.6 (38)", desc: "1 Zinger Burger, 1 Regular Fries, 1 Regular Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.4", category: "Deals", price: "1200/-", time: "18 min", rating: "4.9 (62)", desc: "1 Small Pizza, 2 Peti Burger, 1 Small Fries, Half Liter Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.5", category: "Deals", price: "1750/-", time: "20 min", rating: "4.8 (55)", desc: "1 Medium Pizza, 2 Zinger Burger, 2 Regular Fries, 1 Liter Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.6", category: "Deals", price: "1850/-", time: "20 min", rating: "4.9 (70)", desc: "1 Medium Pizza, 12 Hot Wings, 2 Regular Fries, 1 Liter Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.7", category: "Deals", price: "2200/-", time: "22 min", rating: "5.0 (40)", desc: "6 Zinger Burger, 1 Liter Drink, 2 Regular Fries", tag: "Deal", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.8", category: "Deals", price: "2250/-", time: "25 min", rating: "4.9 (82)", desc: "1 Large Pizza, 10 Nuggets, 1 Medium Fries, 1.5 Liter Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.9", category: "Deals", price: "1600/-", time: "18 min", rating: "4.7 (44)", desc: "5 Peti Burger, 2 Regular Fries, 1.5 Liter Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.10", category: "Deals", price: "3200/-", time: "25 min", rating: "4.9 (90)", desc: "1 Large Pizza, 2 Zinger Burger, 10 Hot Wings, Mayo Garlic Fries Large, 1.5 Liter Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.11", category: "Deals", price: "2900/-", time: "25 min", rating: "4.8 (65)", desc: "2 Medium Pizza, 2 Zinger Burger, 5 Hot Wings, 2 Regular Fries, 1.5 Liter Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=450&auto=format&fit=crop&q=80" },
  { name: "Birthday Deal", category: "Deals", price: "6500/-", time: "35 min", rating: "5.0 (120)", desc: "2 Family Pizza, 5 Grill Burger, 20 Grill Wings, 1 Pound Cake, 4 Regular Fries, 2 Drink 1.5 Ltr", tag: "Party", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.16", category: "Deals", price: "550/-", time: "12 min", rating: "4.7 (33)", desc: "1 Malai Boti Shawarma, 5p Nuggets, 1 Regular Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.17", category: "Deals", price: "750/-", time: "14 min", rating: "4.8 (48)", desc: "2 Special Peti Burger, 2 Regular Drink, 2 Regular Fries", tag: "Deal", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.18", category: "Deals", price: "600/-", time: "12 min", rating: "4.6 (39)", desc: "14 Nuggets, 1 Regular Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.19", category: "Deals", price: "700/-", time: "12 min", rating: "4.8 (51)", desc: "2 Tikka Pratha, 2 Regular Fries, 2 Regular Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.20", category: "Deals", price: "750/-", time: "14 min", rating: "4.7 (44)", desc: "2 Special Peti Burger, 2 Regular Drink, 2 Regular Fries", tag: "Deal", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=450&auto=format&fit=crop&q=80" },
  { name: "Deal.21", category: "Deals", price: "1000/-", time: "15 min", rating: "4.9 (67)", desc: "20p Grill Wings, 1 Half Ltr Drink", tag: "Deal", image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=450&auto=format&fit=crop&q=80" },
  { name: "Limousine Pizza", category: "Deals", price: "3500/-", time: "30 min", rating: "5.0 (85)", desc: "Giant Limousine Pizza + 2 Ltr Drink", tag: "Special", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80" },
  { name: "Muneeb Special Plater", category: "Deals", price: "3000/-", time: "25 min", rating: "4.9 (78)", desc: "10 Nuggets, 10 Hot wings, 10 Grill wings, 1 Large Pizza, 1 Drink 1.5 Ltr", tag: "Plater", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=450&auto=format&fit=crop&q=80" },

  // --- PIZZA'S ---
  { name: "Chicken Tikka Pizza", category: "Pizza", price: "550/- (S)", time: "20 min", rating: "4.7 (80)", desc: "Flavours: Chicken Tikka, Creamy Tikka, Fajita, Hot & Spice", tag: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&auto=format&fit=crop&q=80" },
  { name: "Hot & Spicy Pizza", category: "Pizza", price: "1150/- (M)", time: "20 min", rating: "4.8 (90)", desc: "Medium size spicy chicken pizza", tag: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80" },
  { name: "Creamy Tikka Pizza", category: "Pizza", price: "1600/- (L)", time: "22 min", rating: "4.8 (110)", desc: "Large creamy tikka pizza", tag: "Pizza", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=450&auto=format&fit=crop&q=80" },
  { name: "Cheese Lover Pizza", category: "Pizza", price: "1900/- (F)", time: "25 min", rating: "4.9 (130)", desc: "Family size heavily loaded with cheese", tag: "Pizza", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=450&auto=format&fit=crop&q=80" },

  // --- MUNEEB SPECIAL PIZZA'S ---
  { name: "Muneeb Special Pizza", category: "Muneeb Special Pizza", price: "700/- (S)", time: "25 min", rating: "4.9 (150)", desc: "Special Chef recipe pizza with extra toppings", tag: "Special", image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=450&auto=format&fit=crop&q=80" },
  { name: "Crown Crust Pizza", category: "Muneeb Special Pizza", price: "1350/- (M)", time: "25 min", rating: "4.8 (95)", desc: "Stuffed crust with delicious kebab fillings", tag: "Special", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=450&auto=format&fit=crop&q=80" },
  { name: "B.B.Q Pizza", category: "Muneeb Special Pizza", price: "1750/- (L)", time: "25 min", rating: "4.9 (88)", desc: "Smoky BBQ flavor with grilled chicken chunks", tag: "Special", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=450&auto=format&fit=crop&q=80" },
  { name: "Lazania Pizza", category: "Muneeb Special Pizza", price: "2200/- (F)", time: "30 min", rating: "5.0 (64)", desc: "Fusion of lasagna and pizza loaded with cheese", tag: "Special", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&auto=format&fit=crop&q=80" },

  // --- SHAWARMA ---
  { name: "Chicken Shwarma", category: "Shawarma", price: "250/-", time: "10 min", rating: "4.6 (200)", desc: "Classic shredded chicken with garlic sauce", tag: "Shawarma", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=450&auto=format&fit=crop&q=80" },
  { name: "Cheese Chicken Shwarma", category: "Shawarma", price: "300/-", time: "10 min", rating: "4.7 (180)", desc: "Loaded with melted cheddar cheese", tag: "Shawarma", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=450&auto=format&fit=crop&q=80" },
  { name: "Zinger Shwarma", category: "Shawarma", price: "300/-", time: "12 min", rating: "4.8 (220)", desc: "Crispy zinger fillet inside soft shwarma bread", tag: "Shawarma", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=450&auto=format&fit=crop&q=80" },
  { name: "Plater Shwarma", category: "Shawarma", price: "590/-", time: "15 min", rating: "4.9 (112)", desc: "Open platter shwarma with fries and sauces", tag: "Shawarma", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=450&auto=format&fit=crop&q=80" },

  // --- PRATHA ROLL ---
  { name: "Twister Pratha", category: "Pratha Roll", price: "300/-", time: "12 min", rating: "4.7 (90)", desc: "Crispy flaky pratha wrapped around spicy chicken", tag: "Roll", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=450&auto=format&fit=crop&q=80" },
  { name: "Zinger Pratha", category: "Pratha Roll", price: "350/-", time: "12 min", rating: "4.8 (140)", desc: "Zinger fillet wrapped in crunchy pratha", tag: "Roll", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=450&auto=format&fit=crop&q=80" },
  { name: "Malai Boti Pratha", category: "Pratha Roll", price: "300/-", time: "12 min", rating: "4.6 (75)", desc: "Creamy malai boti pieces in pratha roll", tag: "Roll", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=450&auto=format&fit=crop&q=80" },

  // --- HOT WINGS ---
  { name: "Hot Wings (6p / 12p)", category: "Wings", price: "300/-", time: "10 min", rating: "4.8 (210)", desc: "Spicy crispy fried chicken hot wings", tag: "Wings", image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=450&auto=format&fit=crop&q=80" },
  { name: "Bar BQ Honey Wings", category: "Wings", price: "300/-", time: "10 min", rating: "4.7 (130)", desc: "Glazed in sweet and smoky BBQ sauce", tag: "Wings", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=450&auto=format&fit=crop&q=80" },
  { name: "Buffalo Wings", category: "Wings", price: "300/-", time: "10 min", rating: "4.9 (165)", desc: "Tossed in tangy buffalo hot sauce", tag: "Wings", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=450&auto=format&fit=crop&q=80" },

  // --- GRILL LEG PIECE ---
  { name: "Grill Leg Piece", category: "Grill Leg Piece", price: "350/-", time: "15 min", rating: "4.7 (80)", desc: "Juicy charred grilled chicken leg piece", tag: "Grill", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=450&auto=format&fit=crop&q=80" },
  { name: "Fry Leg Piece", category: "Grill Leg Piece", price: "320/-", time: "12 min", rating: "4.6 (95)", desc: "Crispy golden fried chicken leg piece", tag: "Fry", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=450&auto=format&fit=crop&q=80" },

  // --- PASTA ---
  { name: "White Sauce Pasta", category: "Pasta", price: "400/-", time: "15 min", rating: "4.8 (140)", desc: "Creamy white sauce with tender chicken pieces", tag: "Pasta", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=450&auto=format&fit=crop&q=80" },
  { name: "Red Sauce Pasta", category: "Pasta", price: "400/-", time: "15 min", rating: "4.7 (110)", desc: "Tangy tomato Italian red sauce pasta", tag: "Pasta", image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281298?w=450&auto=format&fit=crop&q=80" },
  { name: "Chicken Creami Pasta", category: "Pasta", price: "400/-", time: "15 min", rating: "4.9 (175)", desc: "Extra creamy cheese sauce macaroni pasta", tag: "Pasta", image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=450&auto=format&fit=crop&q=80" },

  // --- BURGERS ---
  { name: "Zinger Burger", category: "Burgers", price: "350/-", time: "10 min", rating: "4.8 (450)", desc: "Crispy chicken fillet with mayo and lettuce", tag: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=450&auto=format&fit=crop&q=80" },
  { name: "Beef Lover Burger", category: "Burgers", price: "500/-", time: "12 min", rating: "4.9 (210)", desc: "Double beef patty with special burger sauce", tag: "Burger", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=450&auto=format&fit=crop&q=80" },
  { name: "Tower Burger", category: "Burgers", price: "460/-", time: "15 min", rating: "4.9 (310)", desc: "Double zinger patty with cheese slice and hashbrown", tag: "Burger", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=450&auto=format&fit=crop&q=80" },
  { name: "Pizza Burger", category: "Burgers", price: "500/-", time: "15 min", rating: "4.7 (125)", desc: "Unique fusion of pizza toppings inside a burger bun", tag: "Burger", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=450&auto=format&fit=crop&q=80" },

  // --- WRAPS ---
  { name: "Arabic Roll", category: "Wraps", price: "450/-", time: "10 min", rating: "4.7 (85)", desc: "Authentic Arabic style chicken wrap with garlic dip", tag: "Wrap", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=450&auto=format&fit=crop&q=80" },
  { name: "Smoky Grill Wrap", category: "Wraps", price: "450/-", time: "12 min", rating: "4.8 (90)", desc: "Smoky flavored grilled chicken wrap", tag: "Wrap", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=450&auto=format&fit=crop&q=80" },

  // --- SANDWICH ---
  { name: "Panini Grill Sandwich", category: "Sandwich", price: "400/-", time: "10 min", rating: "4.7 (110)", desc: "Pressed panini bread filled with seasoned chicken", tag: "Sandwich", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=450&auto=format&fit=crop&q=80" },
  { name: "House & Club Sandwich", category: "Sandwich", price: "400/-", time: "12 min", rating: "4.8 (160)", desc: "Triple layered classic club sandwich with fries", tag: "Sandwich", image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=450&auto=format&fit=crop&q=80" },

  // --- FRIES ---
  { name: "Plain Fries", category: "Fries", price: "200/- (S)", time: "8 min", rating: "4.6 (300)", desc: "Crispy golden french fries", tag: "Fries", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=450&auto=format&fit=crop&q=80" },
  { name: "Cheese Fries", category: "Fries", price: "250/- (S)", time: "8 min", rating: "4.8 (240)", desc: "Fries smothered in warm melted cheese sauce", tag: "Fries", image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=450&auto=format&fit=crop&q=80" },
  { name: "Loaded Fries", category: "Fries", price: "360/- (S)", time: "10 min", rating: "4.9 (290)", desc: "Fries topped with cheese, jalapenos and chicken bits", tag: "Fries", image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=450&auto=format&fit=crop&q=80" }
];

async function seedDatabase() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/muneeb_fast_food';

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Database connected successfully.');

    // 1. Clear any previously existing items to prevent duplicates
    const clearResult = await MenuItem.deleteMany({});
    console.log(`Cleared ${clearResult.deletedCount} previous items from menu collection.`);

    // 2. Insert all static menu items
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`Successfully seeded ${inserted.length} menu items into MongoDB!`);

    // 3. Clean disconnect
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