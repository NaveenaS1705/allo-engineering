import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get the data from the request
    const body = await request.json();
    console.log("1. Received data:", body);
    
    const { productId, warehouseId, quantity } = body;

    // Validate input
    if (!productId || !warehouseId || !quantity) {
      console.log("2. Missing fields!");
      return NextResponse.json(
        { error: 'Missing productId, warehouseId, or quantity' },
        { status: 400 }
      );
    }

    // First, let's check if the product exists in the database
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    console.log("2. Product found:", product);

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: warehouseId }
    });
    console.log("3. Warehouse found:", warehouse);

    if (!product || !warehouse) {
      return NextResponse.json(
        { error: 'Product or warehouse not found' },
        { status: 404 }
      );
    }

    // Find the stock level
    const stockLevel = await prisma.stockLevel.findFirst({
      where: {
        productId: productId,
        warehouseId: warehouseId,
      },
    });
    console.log("4. Stock level:", stockLevel);

    if (!stockLevel) {
      return NextResponse.json(
        { error: 'No stock found for this product in this warehouse' },
        { status: 404 }
      );
    }

    // Calculate available stock
    const availableStock = stockLevel.totalUnits - stockLevel.reservedUnits;
    console.log("5. Available stock:", availableStock);

    if (availableStock < quantity) {
      return NextResponse.json(
        { error: `Only ${availableStock} units available` },
        { status: 409 }
      );
    }

    // Calculate expiry (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        productId: productId,
        warehouseId: warehouseId,
        quantity: quantity,
        expiresAt: expiresAt,
        status: 'PENDING',
      },
      include: {
        product: true,
        warehouse: true,
      },
    });
    console.log("6. Reservation created:", reservation.id);

    // Update the reserved units
    await prisma.stockLevel.update({
      where: { id: stockLevel.id },
      data: {
        reservedUnits: {
          increment: quantity,
        },
      },
    });
    console.log("7. Stock updated");

    // Return the reservation
    return NextResponse.json(reservation, { status: 201 });
    
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: 'Internal server error: ' + String(error) },
      { status: 500 }
    );
  }
}