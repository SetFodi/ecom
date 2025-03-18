const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Seed Categories
  const categories = [
    { name: "Footwear" },
    { name: "Clothing" },
    { name: "Accessories" },
    { name: "Electronics" },
    { name: "Jewelry" },
    { name: "Bags" },
    { name: "Home Decor" },
    { name: "Sports" },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const createdCategory = await prisma.category.create({ data: category });
    createdCategories.push(createdCategory);
  }

  const categoryMap = createdCategories.reduce((map, cat) => {
    map[cat.name] = cat.id;
    return map;
  }, {});

  // Seed Products with Valid Unsplash Images
  const products = [
    // Footwear
    {
      name: "Leather Sneakers",
      description: "Stylish and durable leather sneakers for everyday wear.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800",
      stock: 15,
      categoryId: categoryMap["Footwear"],
    },
    {
      name: "Running Shoes",
      description: "Lightweight shoes for running enthusiasts.",
      price: 65.99,
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800",
      stock: 20,
      categoryId: categoryMap["Footwear"],
    },
    {
      name: "Canvas Sneakers",
      description: "Casual canvas sneakers with rubber soles.",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800",
      stock: 25,
      categoryId: categoryMap["Footwear"],
    },
    {
      name: "Hiking Boots",
      description: "Rugged boots designed for hiking trails.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1545334279-7c7b2d3e4b83?q=80&w=800",
      stock: 12,
      categoryId: categoryMap["Footwear"],
    },

    // Clothing
    {
      name: "Organic Cotton T-Shirt",
      description: "Comfortable and eco-friendly cotton tee.",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
      stock: 25,
      categoryId: categoryMap["Clothing"],
    },
    {
      name: "Denim Jacket",
      description: "Classic denim jacket with a modern fit.",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1551537482-7cb7b327aecf?q=80&w=800",
      stock: 15,
      categoryId: categoryMap["Clothing"],
    },
    {
      name: "Wool Sweater",
      description: "Cozy wool sweater for cold weather.",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1605487903301-9a72a3e5955f?q=80&w=800",
      stock: 12,
      categoryId: categoryMap["Clothing"],
    },
    {
      name: "Hoodie",
      description: "Soft and warm hoodie for casual wear.",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1571945153237-7b6b25661c99?q=80&w=800",
      stock: 20,
      categoryId: categoryMap["Clothing"],
    },

    // Accessories
    {
      name: "Silk Scarf",
      description: "Elegant silk scarf with vibrant patterns.",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?q=80&w=800",
      stock: 10,
      categoryId: categoryMap["Accessories"],
    },
    {
      name: "Leather Belt",
      description: "Premium leather belt with a sleek buckle.",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1593410871656-68d0b7a1a2f3?q=80&w=800",
      stock: 30,
      categoryId: categoryMap["Accessories"],
    },
    {
      name: "Sunglasses",
      description: "Stylish sunglasses with UV protection.",
      price: 25.99,
      image: "https://images.unsplash.com/photo-1502764613149-7f1d229e230d?q=80&w=800",
      stock: 20,
      categoryId: categoryMap["Accessories"],
    },
    {
      name: "Summer Hat",
      description: "Lightweight hat for sun protection.",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1506059858951-9d0d47b729a1?q=80&w=800",
      stock: 30,
      categoryId: categoryMap["Accessories"],
    },

    // Electronics
    {
      name: "Smartwatch Pro",
      description: "Advanced fitness and notification smartwatch.",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800",
      stock: 8,
      categoryId: categoryMap["Electronics"],
    },
    {
      name: "Wireless Earbuds",
      description: "High-quality noise-canceling earbuds.",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1572569511254-1e9e96f679b0?q=80&w=800",
      stock: 12,
      categoryId: categoryMap["Electronics"],
    },
    {
      name: "Bluetooth Speaker",
      description: "Portable speaker with rich sound quality.",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
      stock: 18,
      categoryId: categoryMap["Electronics"],
    },
    {
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse for productivity.",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800",
      stock: 25,
      categoryId: categoryMap["Electronics"],
    },

    // Jewelry
    {
      name: "Silver Necklace",
      description: "Delicate silver necklace with a pendant.",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1605487903301-9a72a3e5955f?q=80&w=800",
      stock: 15,
      categoryId: categoryMap["Jewelry"],
    },
    {
      name: "Gold Earrings",
      description: "Elegant gold hoop earrings.",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1605487903301-9a72a3e5955f?q=80&w=800",
      stock: 10,
      categoryId: categoryMap["Jewelry"],
    },
    {
      name: "Bracelet Set",
      description: "Set of three minimalist bracelets.",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1605487903301-9a72a3e5955f?q=80&w=800",
      stock: 20,
      categoryId: categoryMap["Jewelry"],
    },

    // Bags
    {
      name: "Backpack",
      description: "Durable backpack for daily use.",
      price: 54.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800",
      stock: 20,
      categoryId: categoryMap["Bags"],
    },
    {
      name: "Tote Bag",
      description: "Stylish tote bag for shopping or work.",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800",
      stock: 15,
      categoryId: categoryMap["Bags"],
    },
    {
      name: "Crossbody Bag",
      description: "Compact crossbody bag for essentials.",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1598532213897-2e0e463252c6?q=80&w=800",
      stock: 25,
      categoryId: categoryMap["Bags"],
    },

    // Home Decor
    {
      name: "Ceramic Vase",
      description: "Handcrafted ceramic vase for home decor.",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
      stock: 15,
      categoryId: categoryMap["Home Decor"],
    },
    {
      name: "Wall Art Print",
      description: "Abstract wall art print for modern spaces.",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
      stock: 20,
      categoryId: categoryMap["Home Decor"],
    },
    {
      name: "Throw Pillow",
      description: "Soft throw pillow with geometric patterns.",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
      stock: 30,
      categoryId: categoryMap["Home Decor"],
    },

    // Sports
    {
      name: "Yoga Mat",
      description: "Non-slip yoga mat for daily practice.",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
      stock: 25,
      categoryId: categoryMap["Sports"],
    },
    {
      name: "Dumbbell Set",
      description: "Adjustable dumbbell set for home workouts.",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
      stock: 10,
      categoryId: categoryMap["Sports"],
    },
    {
      name: "Sports Water Bottle",
      description: "Insulated water bottle for outdoor activities.",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
      stock: 30,
      categoryId: categoryMap["Sports"],
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });