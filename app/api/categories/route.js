// app/api/categories/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    
    // Fetch an image for each category
    const categoriesWithImages = await Promise.all(
      categories.map(async (category) => {
        const product = await prisma.product.findFirst({
          where: { categoryId: category.id },
          select: { image: true },
        });
        
        return {
          ...category,
          image: product?.image || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800",
        };
      })
    );
    
    return NextResponse.json(categoriesWithImages);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
