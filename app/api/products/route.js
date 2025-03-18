import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

export async function POST(request) {
  const data = await request.json();
  const product = await prisma.product.create({ data });
  return NextResponse.json(product);
}