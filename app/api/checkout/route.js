import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const userId = 1; // Hardcoded for now
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Simulate order creation
  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  await prisma.cart.update({
    where: { id: cart.id },
    data: { items: { deleteMany: {} } },
  });

  return NextResponse.json({ message: "Checkout successful", total });
}
