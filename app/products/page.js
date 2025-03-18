// app/products/page.js
import { PrismaClient } from "@prisma/client";
import ProductList from "./ProductList";
import { Suspense } from "react";

const prisma = new PrismaClient();

async function getProducts(category) {
  const where = category ? { category: { name: category } } : {};
  return await prisma.product.findMany({
    where,
    include: { category: true },
  });
}

async function getCategories() {
  return await prisma.category.findMany();
}

export default async function Products({ searchParams }) {
  const selectedCategory = searchParams.category || null;
  
  return (
    <Suspense
      fallback={
        <div className="container-custom py-20 flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      }
    >
      <ProductsContent selectedCategory={selectedCategory} />
    </Suspense>
  );
}

async function ProductsContent({ selectedCategory }) {
  const products = await getProducts(selectedCategory);
  const categories = await getCategories();

  return (
    <ProductList
      products={products}
      categories={categories}
      initialCategory={selectedCategory || "All"}
    />
  );
}
