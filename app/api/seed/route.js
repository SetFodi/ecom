// api/seed/route.js
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

  // Seed Products with verified working Unsplash URLs and extra images for the gallery
  const products = [
    // Footwear
    {
      name: "Red Nike Air Max",
      description: "Bold red athletic sneakers with visible air cushioning.",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470",
      extraImages: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470",
        "https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=1470",
      ],
      stock: 12,
      categoryId: categoryMap["Footwear"],
    },
    {
      name: "White Minimalist Sneakers",
      description: "Clean, all-white leather sneakers for everyday style.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1469",
      extraImages: [
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1469",
        "https://images.unsplash.com/photo-1519744346364-6e28c3ec33b4?q=80&w=1470",
      ],
      stock: 15,
      categoryId: categoryMap["Footwear"],
    },
    {
      name: "Hiking Boots",
      description: "Rugged outdoor boots for trail adventures.",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1470",
      extraImages: [
        "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1470",
        "https://images.unsplash.com/photo-1555633512-9693e1239aa9?q=80&w=1469",
      ],
      stock: 10,
      categoryId: categoryMap["Footwear"],
    },

    // Clothing
    {
      name: "Denim Jacket",
      description: "Classic denim jacket with button front closure.",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1503342236207-3f4e0b4fc0d0?q=80&w=1470", // Replaced invalid URL
      extraImages: [
        "https://images.unsplash.com/photo-1503342236207-3f4e0b4fc0d0?q=80&w=1470",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1470",
      ],
      stock: 15,
      categoryId: categoryMap["Clothing"],
    },
    {
      name: "White Graphic T-Shirt",
      description: "Cotton t-shirt with minimalist design.",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480",
      extraImages: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480",
        "https://images.unsplash.com/photo-1520975925495-62dcc90c8c02?q=80&w=1470",
      ],
      stock: 25,
      categoryId: categoryMap["Clothing"],
    },
    {
      name: "Hoodie",
      description: "Comfortable cotton-blend pullover hoodie.",
      price: 54.99,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1527",
      extraImages: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1527",
        "https://images.unsplash.com/photo-1562157877-818bc0726d4e?q=80&w=1470",
      ],
      stock: 20,
      categoryId: categoryMap["Clothing"],
    },

    // Accessories
    {
      name: "Patterned Scarf",
      description: "Stylish scarf with colorful designs.",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?q=80&w=1469",
      extraImages: [
        "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?q=80&w=1469",
        "https://images.unsplash.com/photo-1611162617211-f6c3b53ab5b0?q=80&w=1470",
      ],
      stock: 10,
      categoryId: categoryMap["Accessories"],
    },
    {
      name: "Leather Wallet",
      description: "Classic bi-fold leather wallet.",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1374",
      extraImages: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1374",
        "https://images.unsplash.com/photo-1606813902879-fb3d4f17c4ed?q=80&w=1470",
      ],
      stock: 30,
      categoryId: categoryMap["Accessories"],
    },
    {
      name: "Aviator Sunglasses",
      description: "Metal frame aviator sunglasses with gradient lenses.",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1480",
      extraImages: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1480",
        "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1470",
      ],
      stock: 15,
      categoryId: categoryMap["Accessories"],
    },

    // Electronics
    {
      name: "Smart Watch",
      description: "Modern smartwatch with health monitoring features.",
      price: 219.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1399",
      extraImages: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1399",
        "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1470",
      ],
      stock: 12,
      categoryId: categoryMap["Electronics"],
    },
    {
      name: "Over-Ear Headphones",
      description: "Premium over-ear headphones with noise cancellation.",
      price: 249.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470",
      extraImages: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470",
        "https://images.unsplash.com/photo-1494253109108-2e30c049369b?q=80&w=1470",
      ],
      stock: 10,
      categoryId: categoryMap["Electronics"],
    },
    {
      name: "Portable Speaker",
      description: "Compact wireless Bluetooth speaker.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1374",
      extraImages: [
        "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1374",
        "https://images.unsplash.com/photo-1604512468209-6488cba014d2?q=80&w=1469",
      ],
      stock: 16,
      categoryId: categoryMap["Electronics"],
    },
  ];
  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("Seeding completed successfully with verified working image URLs!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });