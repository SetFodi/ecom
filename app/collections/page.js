// app/collections/page.js
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

async function getCategories() {
  return await prisma.category.findMany();
}

export default async function CollectionsPage() {
  const categories = await getCategories();

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Explore Our Collections
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${encodeURIComponent(category.name)}`}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 animate-fade-in"
          >
            <div className="relative w-full h-48 overflow-hidden">
              {/* Placeholder image for the category; replace with actual images if available */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-medium">{category.name}</span>
              </div>
            </div>
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                {category.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
