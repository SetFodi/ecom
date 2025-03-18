import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import SafeImage from "./SafeImage";

const prisma = new PrismaClient();

async function getProduct(id) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });
  return product;
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative">
          <SafeImage
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-[600px] object-cover rounded-xl shadow-lg product-img"
            priority
          />
          {product.stock < 5 && (
            <span className="badge badge-sale">Low Stock: {product.stock} left</span>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-4">{product.name}</h1>
            <p className="text-muted text-lg mb-6">{product.description}</p>
            <div className="flex items-center justify-between mb-6">
              <p className="text-3xl font-semibold text-indigo-600">${product.price.toFixed(2)}</p>
              <span className="text-sm text-muted">Category: {product.category.name}</span>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm text-green-600">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
              <span className="text-sm text-muted">SKU: {product.id}</span>
            </div>
          </div>
          <div className="space-y-4">
            <AddToCartButton product={product} />
            <p className="text-sm text-muted text-center">
              Free shipping on orders over $50
            </p>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <div className="card p-6">
          <p className="text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <ul className="mt-4 space-y-2 text-muted">
            <li>Material: High-quality cotton</li>
            <li>Shipping: 2-5 business days</li>
            <li>Returns: 30-day money-back guarantee</li>
          </ul>
        </div>
      </div>
    </div>
  );
}