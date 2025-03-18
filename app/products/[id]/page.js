import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getProduct(id) {
  return await prisma.product.findUnique({ where: { id: Number(id) } });
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div className="text-center text-muted">Product not found</div>;
  }

  return (
    <div className="card grid grid-cols-1 md:grid-cols-2 gap-8">
      <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded-lg" />
      <div>
        <h2 className="text-3xl mb-4">{product.name}</h2>
        <p className="text-muted mb-4">{product.description}</p>
        <p className="text-2xl text-[var(--primary)] mb-6">${product.price.toFixed(2)}</p>
        <button className="btn-primary">Add to Cart</button>
      </div>
    </div>
  );
}