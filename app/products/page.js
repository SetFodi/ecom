import { PrismaClient } from "@prisma/client";
import ProductList from "./ProductList";
import { Suspense } from "react";

const prisma = new PrismaClient();

async function getProducts() {
  return await prisma.product.findMany({ include: { category: true } });
}

async function getCategories() {
  return await prisma.category.findMany();
}

export default async function Products() {
  const products = await getProducts();
  const categories = await getCategories();
  return (
    <Suspense fallback={<div className="loading-spinner mx-auto" />}>
      <ProductList products={products} categories={categories} />
    </Suspense>
  );
}