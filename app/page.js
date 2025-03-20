// app/page.js
import { PrismaClient } from "@prisma/client";
import FeaturedProductsCarousel from "./FeaturedProductsCarousel";
import HomeClient from "./HomeClient";


// Create a singleton Prisma instance
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const heroProduct = featuredProducts[0] || {
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800",
  };

  return (
    <>
      <HomeClient 
        heroProduct={heroProduct} 
        featuredProducts={featuredProducts} 
      />
      <div className="container-custom py-16">
        <FeaturedProductsCarousel products={featuredProducts} />
      </div>
    </>
  );
}