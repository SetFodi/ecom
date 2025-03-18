// app/products/[id]/page.js
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import ProductImageGallery from "./ProductImageGallery";
import { Tag, Truck, RotateCcw, Award } from "lucide-react";
import SafeImage from "../SafeImage";
import ProductPageLayout from "./ProductPageLayout";

const prisma = new PrismaClient();

async function getProduct(id) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });
  if (!product) {
    throw new Error(`Product with id ${id} not found`);
  }
  return product;
}

async function getRelatedProducts(categoryId, productId) {
  return await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: Number(productId) },
    },
    include: { category: true },
    take: 4,
  });
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, resolvedParams.id);

  return (
    <ProductPageLayout>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="relative">
            <ProductImageGallery 
              images={[product.image]} 
              productName={product.name} 
            />

            <div className="absolute top-4 left-4 z-10">
              {product.stock < 5 && product.stock > 0 && (
                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  Only {product.stock} left
                </span>
              )}
              {product.stock === 0 && (
                <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <div className="p-8 lg:p-12 flex flex-col h-full">
            <div>
              <div className="flex flex-col mb-3">
                <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm mb-2 w-fit">
                  {product.category.name}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
              </div>

              <p className="text-gray-600 mb-8">
                {product.description ||
                  "This premium product combines elegant design with exceptional functionality. Crafted with high-quality materials and attention to detail."}
              </p>
            </div>

            <div className="mb-8">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50">
                  <RotateCcw className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm">30-Day Returns</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <p className="text-3xl font-bold text-indigo-600">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">SKU: {product.id}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 mt-auto">
              <AddToCartButton product={product} />

              <p className="text-sm text-center text-gray-500">
                Free shipping on orders over $50
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">✓</span>
                <span>High-quality materials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">✓</span>
                <span>Durable construction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">✓</span>
                <span>Elegant design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">✓</span>
                <span>Versatile functionality</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Specifications</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-500">Material</span>
                <span>Premium quality</span>
              </div>
              <div className="border-t border-gray-100"></div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>2-5 business days</span>
              </div>
              <div className="border-t border-gray-100"></div>
              <div className="flex justify-between">
                <span className="text-gray-500">Returns</span>
                <span>30-day guarantee</span>
              </div>
              <div className="border-t border-gray-100"></div>
              <div className="flex justify-between">
                <span className="text-gray-500">Warranty</span>
                <span>1 year limited</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <a
                key={related.id}
                href={`/products/${related.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <SafeImage
                    src={related.image}
                    alt={related.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {related.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-semibold text-indigo-600">
                      ${related.price.toFixed(2)}
                    </p>
                    <span className="text-xs py-1 px-2 bg-indigo-50 text-indigo-700 rounded-full">
                      {related.category.name}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </ProductPageLayout>
  );
}