import { NextResponse } from "next/server";

let serverCart = []; // In-memory for demo; use a database in production

export async function GET() {
  return NextResponse.json(serverCart);
}

export async function POST(request) {
  const { productId, quantity } = await request.json();
  const existing = serverCart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    serverCart.push({ productId, quantity });
  }
  return NextResponse.json(serverCart);
}

export async function DELETE(request) {
  const { productId } = await request.json();
  serverCart = serverCart.filter((item) => item.productId !== productId);
  return NextResponse.json(serverCart);
}