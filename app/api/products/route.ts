import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        stockLevels: {
          include: {
            warehouse: true,
          },
        },
      },
    });
    
    // Make sure we return an array
    return NextResponse.json(products || []);
  } catch (error) {
    console.error('API Error:', error);
    // Return an empty array on error
    return NextResponse.json([]);
  }
}