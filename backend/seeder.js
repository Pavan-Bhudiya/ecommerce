const mongoose= require('mongoose');
const dotenv=  require('dotenv');
const connectDB = require('./config/db');
const Product= require('./models/Product');

dotenv.config();
connectDB();

const products = [
    {
        /*{Womens Wear}*/
        title: "Upto 50% off on all Women's Wear",
        image: "/images/women.jpg",
        price: 49.99,
        stock:100,
        category: "women-wear",
        description:
            "A stylish women’s outfit with a soft, comfortable feel and a modern look. Perfect for casual outings or everyday wear, featuring a flattering fit and simple elegant details.",
    },
    {
        title: "Elegant Women's Casual Outfit",
        image: "/images/female_cloth.jpg",
        price: 54.99,
        stock:50,
        category: "women-wear",
        description:
            "A stylish women’s casual outfit with a modern fit and comfortable fabric, perfect for daily wear, outings, and creating a clean fashionable look.",
    },

    {
        title: "Women's Fashion Sneakers",
        image: "/images/female_shoe_1.jpg",
        price: 74.99,
        stock:50,
        category: "women-wear",
        description:
            "Comfortable and trendy women’s sneakers designed with a lightweight feel, durable sole, and fashionable appearance suitable for casual and active lifestyles.",
    },

    {
        title: "Classic Women's Running Shoes",
        image: "/images/female_shoe.jpg",
        price: 74.99,
        stock:50,
        category: "women-wear",
        description:
            "Lightweight women’s running shoes built for comfort and everyday movement, featuring breathable materials and a supportive sole for extended wear.",
    },

    {
        title: "Premium Women's Business Suit",
        image: "/images/female_suit_1.jpg",
        price: 129.99,
        stock:50,
        category: "women-wear",
        description:
            "A professional women’s suit tailored with a sleek modern fit, ideal for office wear, formal occasions, and elegant styling.",
    },

    {
        title: "Premium Women's Business Suit",
        image: "/images/female_suit.jpg",
        price: 129.99,
        stock:50,
        category: "women-wear",
        description:
            "A professional women’s suit tailored with a sleek modern fit, ideal for office wear, formal occasions, and elegant styling.",
    },

            /*{Mens Wear}*/
    {
        title: "Upto 50% off on all Men's Wear",
        image: "/images/malet.jpg",
        price: 59.99,
        stock:100,
        category: "mens-wear",
        description:
            "A comfortable and stylish men’s outfit with a clean modern design, suitable for everyday wear or casual occasions. Made for a relaxed fit and easy styling.",
    },

    {
        title: "Men's Urban Sneakers",
        image: "/images/male_shoe_1.jpg",
        price: 79.99,
        stock:50,
        category: "mens-wear",
        description:
            "Stylish men’s sneakers designed for comfort and durability, featuring a modern urban look ideal for casual wear and everyday movement.",
    },

    {
        title: "Men's Athletic Running Shoes",
        image: "/images/male_shoe.jpg",
        price: 89.99,
        stock:50,
        category: "mens-wear",
        description:
            "A sleek high-performance laptop built for productivity, entertainment, and multitasking, featuring fast processing speeds and a modern lightweight design.",
    },
    {
        title: "Men's Executive Formal Suit",
        image: "/images/male_suit-2.jpg",
        price: 149.99,
        stock:50,
        category: "mens-wear",
        description:
            "A premium men’s formal suit tailored for elegance and professionalism, suitable for office wear, formal occasions, and business events.",
    },
    {
        title: "Classic Men's Business Suit",
        image: "/images/male_suit.jpg",
        price: 149.99,
        stock:50,
        category: "mens-wear",
        description:
            "A modern men’s business suit designed with clean lines and a comfortable fit, offering a polished appearance for meetings and formal gatherings.",
    },

                /*{Kids Wear}*/
    {
        title: "Upto 50% off on all Kids' Wear",
        image: "/images/kids.jpg",
        price: 29.99,
        stock:50,
        category: "kids-wear",
        description:
            "A cute and comfortable kids’ outfit designed for everyday activity and play, featuring a soft feel, simple style, and a fun youthful look.",
    },
    {
        title: "Kids' Colorful Casual Wear",
        image: "/images/kid_cloth_2.jpg",
        price: 39.99,
        stock:50,
        category: "kids-wear",
        description:
            "A fun and comfortable kids’ outfit made with soft fabric and playful styling, perfect for active days, school, and casual family outings.",
    },

    {
        title: "Kids' Everyday Fashion Outfit",
        image: "/images/kid_cloth.jpg",
        price: 39.99,
        stock:50,
        category: "kids-wear",
        description:
            "A comfortable kids’ clothing set designed for daily use, featuring lightweight materials, vibrant colors, and a flexible fit for easy movement.",
    },


            /*{Trending Products}*/
    {
        title: "Canon Professional DSLR Camera",
        image: "/images/camera_trending.jpg",
        price: 899.99,
        stock:50,
        category: "trending-products",
        description:
            "A high-quality DSLR camera designed for photography enthusiasts and professionals, featuring sharp image capture, advanced controls, and reliable performance for both indoor and outdoor shoots.",
    },
    {
        title: "Nintendo Gaming Graphics Card",
        image: "/images/card_chip_game.jpg",
        price: 649.99,
        stock:50,
        category: "trending-products",
        description:
            "A powerful gaming graphics card with advanced cooling, vibrant RGB lighting, and smooth rendering performance for modern games, creative workloads, and high-resolution displays.",
    },
    {
        title: "Minimalist Ceramic Coffee Mug",
        image: "/images/mug_trending.jpg",
        price: 19.99,
        stock:50,
        category: "trending-products",
        description:
            "A minimalist ceramic coffee mug with a sleek design, perfect for daily use and adding a touch of elegance to your morning routine.",
    },


            /*{Books}*/
    {
        title: "Outliers by Malcolm Gladwell",
        image: "/images/outliers_book.jpg",
        price: 29.99,
        stock:50,
        category: "books",
        description:
            "A minimalist ceramic coffee mug with a sleek design, perfect for daily use and adding a touch of elegance to your morning routine.",
    },

    {
        title: "Who Moved My Cheese?",
        image: "/images/who_moved_my_cheese_book.jpg",
        price: 29.99,
        stock:50,
        category: "books",
        description:
            "A motivational book about adapting to change, embracing new opportunities, and developing resilience in both personal and professional life.",
    },
    {
        title: "Think and Grow Rich by Napoleon Hill",
        image: "/images/think_grow_rich_book.jpg",
        price: 29.99,
        stock:50,
        category: "books",
        description:
            "A classic personal development and financial success book that explores mindset, ambition, discipline, and the principles of achieving wealth and success.",
    },


            /*{Electronic}*/
    {
        title: "Nintendo Switch Console",
        image: "/images/electronic.jpg",
        price: 299.99,
        stock:50,
        category: "electronics",
        description:
            "A versatile gaming console that lets you enjoy immersive gameplay at home or on the go, featuring a portable design, responsive controls, and support for popular multiplayer titles.",
    },

    {
        title: "Smartphone Pro Max Edition",
        image: "/images/phone_1.jpg",
        price: 499.99,
        stock:50,
        category: "electronics",
        description:
            "A modern Android smartphone designed for speed, photography, and multitasking, featuring long battery life and a smooth user experience.",
    },

    {
        title: "Next Generation Android Smartphone",
        image: "/images/phone_2.jpg",
        price: 499.99,
        stock:50,
        category: "electronics",
        description:
            "A modern Android smartphone designed for speed, photography, and multitasking, featuring long battery life and a smooth user experience.",
    },
    

    {
        title: "Universal Laptop Charger",
        image: "/images/laptop_charger_electronic.jpg",
        price: 49.99,
        stock:50,
        category: "electronics",
        description:
            "A reliable universal laptop charger compatible with multiple laptop brands, offering stable power delivery, fast charging, and durable cable protection.",
    },

    {
        title: "Ultra Slim Performance Laptop",
        image: "/images/laptop_electronic.jpg",
        price: 1199.99,
        stock:50,
        category: "electronics",
        description:
            "A sleek high-performance laptop built for productivity, entertainment, and multitasking, featuring fast processing speeds and a modern lightweight design.",
    },


];
const importData = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log("Products seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("Seed error", error);
        process.exit(1);
    }
};
importData();