// app/products/[id]/page.js
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Star, Tag, Truck, RotateCcw, Award, ShieldCheck, Package, Clock } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import ProductImageGallery from "./ProductImageGallery";
import SafeImage from "../SafeImage";
import ProductPageLayout from "./ProductPageLayout";

const prisma = new PrismaClient();

async function getProduct(id) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });
    
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts(categoryId, productId) {
  try {
    return await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: Number(productId) },
      },
      include: { category: true },
      take: 4,
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, resolvedParams.id);
  
  // Try to parse extraImages if it exists
  let extraImages = [];
  try {
    if (product.extraImages) {
      extraImages = JSON.parse(product.extraImages);
    }
  } catch (e) {
    console.error("Error parsing extraImages:", e);
  }

  const allImages = [product.image, ...extraImages].filter(Boolean);

  return (
    <ProductPageLayout>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Product Gallery - 3 columns on desktop */}
          <div className="lg:col-span-3 relative">
            <ProductImageGallery 
              images={allImages} 
              productName={product.name}
            />

            <div className="absolute top-4 left-4 z-10">
              {product.stock < 5 && product.stock > 0 && (
                <div className="bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-pulse"></span>
                  Only {product.stock} left
                </div>
              )}
              {product.stock === 0 && (
                <div className="bg-gray-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-md">
                  Out of Stock
                </div>
              )}
            </div>
          </div>

          {/* Product Info - 2 columns on desktop */}
          <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col h-full">
            <div>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                    {product.category.name}
                  </span>
                  <div className="ml-auto flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1.5">(25 reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
                
                <p className="text-2xl font-bold text-indigo-600 mb-2">
                  ${product.price.toFixed(2)}
                </p>
                
                <div className="text-sm text-gray-500 flex items-center gap-1.5 mb-5">
                  <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>
                    {product.stock > 5 ? "In Stock" : 
                     product.stock > 0 ? `Only ${product.stock} left in stock` :
                     "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-gray-900 font-medium mb-2">Description</h2>
                <p className="text-gray-600">
                  {product.description ||
                    "This premium product combines elegant design with exceptional functionality. Crafted with high-quality materials and attention to detail, it's designed to enhance your everyday experience with its versatile features and timeless aesthetic."}
                </p>
              </div>

              <div className="mb-8">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-800">Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <Truck className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-800">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <RotateCcw className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-800">30-Day Returns</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <Package className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-800">Secure Packaging</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm text-gray-700">Delivery: 2-5 business days</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">SKU: {product.id}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 inline-block relative">
          Product Details
          <span className="absolute left-0 bottom-0 w-full h-1 bg-indigo-100 rounded-full"></span>
          <span className="absolute left-0 bottom-0 w-1/3 h-1 bg-indigo-500 rounded-full"></span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transform transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">Description</h3>
              <p className="text-gray-600">
                {product.description || "This premium product combines elegant design with exceptional functionality. Crafted with high-quality materials for durability and everyday use."}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transform transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">Features</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">✓</span>
                  <span>Premium quality materials for durability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">✓</span>
                  <span>Ergonomic design for comfortable use</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">✓</span>
                  <span>Sleek aesthetic that complements any setting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">✓</span>
                  <span>Versatile functionality for multiple uses</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transform transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">Specifications</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Material</span>
                  <span>Premium quality</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Shipping</span>
                  <span>2-5 business days</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Returns</span>
                  <span>30-day guarantee</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 font-medium">Warranty</span>
                  <span>1 year limited</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 inline-block relative">
            You Might Also Like
            <span className="absolute left-0 bottom-0 w-full h-1 bg-indigo-100 rounded-full"></span>
            <span className="absolute left-0 bottom-0 w-1/3 h-1 bg-indigo-500 rounded-full"></span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <a
                key={related.id}
                href={`/products/${related.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 group flex flex-col h-full transform hover:-translate-y-2 duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-gray-50 flex items-center justify-center">
                  <SafeImage
                    src={related.image}
                    alt={related.name}
                    fill
                    className="object-contain scale-80 group-hover:scale-90 transition-transform duration-500"
                  />
                  
                  {/* Add a subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-2">
                    <span className="text-xs py-1 px-2 bg-indigo-50 text-indigo-700 rounded-full inline-block">
                      {related.category.name}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                    {related.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                    {related.description || "High-quality product designed for premium performance and style."}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <p className="font-bold text-indigo-600">
                      ${related.price.toFixed(2)}
                    </p>
                    
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${related.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>{related.stock > 0 ? 'In stock' : 'Out of stock'}</span>
                    </div>
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