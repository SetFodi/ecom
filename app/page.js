import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import SafeImage from "./products/SafeImage";

const prisma = new PrismaClient();

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  // Use the first product's image as the hero background (e.g., Leather Sneakers)
  const heroProduct = featuredProducts[0] || {
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800",
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <SafeImage
            src={heroProduct.image}
            alt={`${heroProduct.name || "Featured Product"} Background`}
            fill
            className="object-cover"
            style={{ zIndex: -1 }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to ShopifyLite</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover amazing products with a seamless shopping experience tailored just for you.
          </p>
          <Link
            href="/products"
            className="inline-block bg-indigo-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container-custom py-16">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="card bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all hover:shadow-xl"
            >
              <div className="relative w-full h-64 bg-gray-100">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-muted text-sm mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <Link
                  href={`/products/${product.id}`}
                  className="btn-secondary w-full text-center py-2"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Categories Section */}
      <section className="container-custom py-16 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          Explore Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
            <SafeImage
              src={
                featuredProducts.find((p) => p.category.name === "Footwear")?.image ||
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800"
              }
              alt="Footwear"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Link
                href="/products?category=Footwear"
                className="text-white text-xl font-semibold hover:underline"
              >
                Footwear
              </Link>
            </div>
          </div>
          <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
            <SafeImage
              src={
                featuredProducts.find((p) => p.category.name === "Clothing")?.image ||
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800"
              }
              alt="Clothing"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Link
                href="/products?category=Clothing"
                className="text-white text-xl font-semibold hover:underline"
              >
                Clothing
              </Link>
            </div>
          </div>
          <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
            <SafeImage
              src={
                featuredProducts.find((p) => p.category.name === "Accessories")?.image ||
                "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?q=80&w=800"
              }
              alt="Accessories"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Link
                href="/products?category=Accessories"
                className="text-white text-xl font-semibold hover:underline"
              >
                Accessories
              </Link>
            </div>
          </div>
          <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
            <SafeImage
              src={
                featuredProducts.find((p) => p.category.name === "Electronics")?.image ||
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800"
              }
              alt="Electronics"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Link
                href="/products?category=Electronics"
                className="text-white text-xl font-semibold hover:underline"
              >
                Electronics
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}