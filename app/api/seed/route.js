import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = [
    { name: "Clothing" },
    { name: "Footwear" },
    { name: "Electronics" },
    { name: "Accessories" },
  ];

  await prisma.category.createMany({ data: categories });

  const categoryMap = await prisma.category.findMany();
  const products = [
    {
      name: "Organic Cotton T-Shirt",
      description: "Soft, breathable, and eco-friendly cotton tee.",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
      stock: 15,
      categoryId: categoryMap.find((c) => c.name === "Clothing").id,
    },
    {
      name: "Leather Sneakers",
      description: "Premium leather sneakers with a minimalist design.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1606890658317-7d14490b76fd?q=80&w=800",
      stock: 8,
      categoryId: categoryMap.find((c) => c.name === "Footwear").id,
    },
    {
      name: "Smartwatch Pro",
      description: "Track your fitness with this sleek smartwatch.",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800",
      stock: 5,
      categoryId: categoryMap.find((c) => c.name === "Electronics").id,
    },
    {
      name: "Wireless Earbuds",
      description: "High-quality sound with noise cancellation.",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800",
      stock: 20,
      categoryId: categoryMap.find((c) => c.name === "Electronics").id,
    },
    {
      name: "Silk Scarf",
      description: "Elegant scarf for any occasion.",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1576179635662-9d19808950c2?q=80&w=800",
      stock: 12,
      categoryId: categoryMap.find((c) => c.name === "Accessories").id,
    },
  ];

  await prisma.product.createMany({ data: products });

  return NextResponse.json({ message: "Database seeded successfully" });
}