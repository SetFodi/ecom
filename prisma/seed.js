// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log("🌱 Starting database seeding process...");
  
  // 1. Clear existing data
  console.log("🧹 Cleaning existing data...");
  await cleanDatabase();
  
  // 2. Seed categories
  console.log("📁 Creating product categories...");
  const categoryMap = await seedCategories();
  
  // 3. Seed products
  console.log("🛍️ Creating products...");
  await seedProducts(categoryMap);
  
  // 4. Seed users with different roles
  console.log("👤 Creating test user accounts...");
  const users = await seedUsers();
  
  // 5. Create some test orders
  console.log("📦 Creating sample orders...");
  await seedOrders(users);
  
  console.log("✅ Database seeding completed successfully!");
}

async function cleanDatabase() {
  // Using transaction to ensure all deletions are atomic
  try {
    await prisma.$transaction([
      prisma.cartItem.deleteMany(),
      prisma.cart.deleteMany(),
      prisma.product.deleteMany(),
      prisma.category.deleteMany(),
      prisma.user?.deleteMany() || Promise.resolve(),
    ]);
  } catch (error) {
    console.log("Warning during cleanup:", error.message);
  }
}

async function seedCategories() {
  // Modified to match your schema (removed description field)
  const categories = [
    { name: "Footwear" },
    { name: "Clothing" },
    { name: "Accessories" },
    { name: "Electronics" },
    { name: "Home & Living" },
    { name: "Beauty" },
  ];

  const createdCategories = await Promise.all(
    categories.map(category => prisma.category.create({ data: category }))
  );

  const categoryMap = createdCategories.reduce((map, cat) => {
    map[cat.name] = cat.id;
    return map;
  }, {});

  console.log(`Created ${categories.length} categories`);
  return categoryMap;
}

async function seedProducts(categoryMap) {
  // Expanded product list with more variety
  const productsData = [
    // Footwear
    {
      name: "Red Nike Air Max",
      description: "Bold red athletic sneakers with visible air cushioning. Perfect for running or casual wear.",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470",
        "https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=1470",
      ]),
      stock: 12,
      categoryId: categoryMap["Footwear"],
    },
    {
      name: "White Minimalist Sneakers",
      description: "Clean, all-white leather sneakers for everyday style. Made with premium materials for comfort and durability.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1469",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1469",
        "https://images.unsplash.com/photo-1519744346364-6e28c3ec33b4?q=80&w=1470",
      ]),
      stock: 15,
      categoryId: categoryMap["Footwear"],
    },
    {
      name: "Hiking Boots",
      description: "Rugged outdoor boots for trail adventures. Waterproof construction with excellent traction for any terrain.",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1470",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1470",
        "https://images.unsplash.com/photo-1555633512-9693e1239aa9?q=80&w=1469",
      ]),
      stock: 10,
      categoryId: categoryMap["Footwear"],
    },

    // Clothing
    {
      name: "Denim Jacket",
      description: "Classic denim jacket with button front closure. A timeless piece for any wardrobe.",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1470",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1470",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1470",
      ]),
      stock: 15,
      categoryId: categoryMap["Clothing"],
    },
    {
      name: "White Graphic T-Shirt",
      description: "Cotton t-shirt with minimalist design. Soft fabric for everyday comfort.",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480",
        "https://images.unsplash.com/photo-1520975925495-62dcc90c8c02?q=80&w=1470",
      ]),
      stock: 25,
      categoryId: categoryMap["Clothing"],
    },
    {
      name: "Classic Hoodie",
      description: "Comfortable cotton-blend pullover hoodie. Features kangaroo pocket and adjustable drawstring hood.",
      price: 54.99,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1527",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1527",
        "https://images.unsplash.com/photo-1562157877-818bc0726d4e?q=80&w=1470",
      ]),
      stock: 20,
      categoryId: categoryMap["Clothing"],
    },

    // Accessories
    {
      name: "Patterned Scarf",
      description: "Stylish scarf with colorful designs. Soft fabric for comfort and warmth.",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?q=80&w=1469",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?q=80&w=1469",
        "https://images.unsplash.com/photo-1611162617211-f6c3b53ab5b0?q=80&w=1470",
      ]),
      stock: 10,
      categoryId: categoryMap["Accessories"],
    },
    {
      name: "Leather Wallet",
      description: "Classic bi-fold leather wallet. Features multiple card slots and a bill compartment.",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1374",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1374",
        "https://images.unsplash.com/photo-1606813902879-fb3d4f17c4ed?q=80&w=1470",
      ]),
      stock: 30,
      categoryId: categoryMap["Accessories"],
    },
    {
      name: "Aviator Sunglasses",
      description: "Metal frame aviator sunglasses with gradient lenses. UV protection included.",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1480",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1480",
        "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1470",
      ]),
      stock: 15,
      categoryId: categoryMap["Accessories"],
    },

    // Electronics
    {
      name: "Smart Watch",
      description: "Modern smartwatch with health monitoring features. Tracks steps, heart rate, and more.",
      price: 219.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1399",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1399",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1527",
      ]),
      stock: 12,
      categoryId: categoryMap["Electronics"],
    },
    {
      name: "Over-Ear Headphones",
      description: "Premium over-ear headphones with noise cancellation. Immersive sound experience for music and calls.",
      price: 249.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470",
        "https://images.unsplash.com/photo-1494253109108-2e30c049369b?q=80&w=1470",
      ]),
      stock: 10,
      categoryId: categoryMap["Electronics"],
    },
    {
      name: "Portable Bluetooth Speaker",
      description: "Compact wireless Bluetooth speaker with 10-hour battery life. Water-resistant design for outdoor use.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1374",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1374",
        "https://images.unsplash.com/photo-1604512468209-6488cba014d2?q=80&w=1469",
      ]),
      stock: 16,
      categoryId: categoryMap["Electronics"],
    },

    // Home & Living (only if you have this category in your schema)
    {
      name: "Ceramic Coffee Mug Set",
      description: "Set of 4 ceramic coffee mugs in assorted colors. Dishwasher and microwave safe.",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1470",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1470",
        "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=1470",
      ]),
      stock: 25,
      categoryId: categoryMap["Home & Living"] || categoryMap["Accessories"],
    },

    // Beauty (only if you have this category in your schema)
    {
      name: "Skincare Gift Set",
      description: "Complete skincare set including cleanser, toner, moisturizer, and face mask. Made with natural ingredients.",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1595205903532-e5f470d4a351?q=80&w=1470",
      extraImages: JSON.stringify([
        "https://images.unsplash.com/photo-1595205903532-e5f470d4a351?q=80&w=1470",
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1470",
      ]),
      stock: 20,
      categoryId: categoryMap["Beauty"] || categoryMap["Accessories"],
    },
  ];

  // Filter out products for categories that don't exist
  const validProducts = productsData.filter(product => product.categoryId !== undefined);

  // Create all products in a batch operation
  await Promise.all(
    validProducts.map(product => prisma.product.create({ data: product }))
  );
  
  console.log(`Created ${validProducts.length} products`);
}

async function seedUsers() {
  try {
    // Check if User model exists in schema
    try {
      await prisma.user.findFirst();
    } catch (e) {
      console.log("User model not found in schema, skipping user creation");
      return [];
    }

    // Create some test users with hashed passwords
    const password = await bcrypt.hash("Password123", 10);
    
    const usersData = [
      {
        name: "Test User",
        email: "user@example.com",
        password,
      },
      {
        name: "John Smith",
        email: "john@example.com",
        password,
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        password,
      }
    ];

    // Create users
    const users = [];
    for (const userData of usersData) {
      const user = await prisma.user.create({ 
        data: userData 
      });
      
      // Create cart for user
      await prisma.cart.create({
        data: { userId: user.id }
      });
      
      users.push(user);
    }
    
    console.log(`Created ${users.length} user accounts with carts`);
    return users;
  } catch (error) {
    console.error("Error creating users:", error.message);
    return [];
  }
}

async function seedOrders(users) {
  try {
    // Check if Order model exists in schema
    try {
      await prisma.order.findFirst();
    } catch (e) {
      console.log("Order model not found in schema, skipping order creation");
      return;
    }

    if (!users || users.length === 0) {
      console.log("No users available, skipping order creation");
      return;
    }
    
    // Get some products to create orders with
    const products = await prisma.product.findMany({ take: 10 });
    if (products.length === 0) {
      console.log("No products available, skipping order creation");
      return;
    }
    
    // Create sample orders for the first user
    const testUser = users[0];
    
    // Create orders with different statuses
    const ordersData = [
      {
        userId: testUser.id,
        status: "delivered",
        total: 199.98,
        address: "123 Main St",
        city: "Anytown",
        postalCode: "12345",
        country: "United States",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
      {
        userId: testUser.id,
        status: "shipped",
        total: 149.99,
        address: "123 Main St",
        city: "Anytown",
        postalCode: "12345",
        country: "United States",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        userId: testUser.id,
        status: "processing",
        total: 89.99,
        address: "123 Main St",
        city: "Anytown",
        postalCode: "12345",
        country: "United States",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    ];

    // Create orders
    for (const orderData of ordersData) {
      const order = await prisma.order.create({ 
        data: orderData 
      });
      
      // Add order items (only if OrderItem model exists)
      try {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: products[0].id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
          }
        });
      } catch (e) {
        console.log("OrderItem model might not exist, skipping item creation");
      }
    }
    
    console.log(`Created ${ordersData.length} orders`);
  } catch (error) {
    console.error("Error creating orders:", error.message);
    console.log("Skipping order creation - Order model might not be available yet");
  }
}

// Run the seed function
seedDatabase()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Closing Prisma client");
    await prisma.$disconnect();
  });