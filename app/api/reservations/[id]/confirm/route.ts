import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 16 async params
    const { id } = await context.params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    if (reservation.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Reservation already processed' },
        { status: 400 }
      );
    }

    if (reservation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Reservation has expired' },
        { status: 410 }
      );
    }

    // Confirm reservation and deduct stock
    await prisma.$transaction(async (tx) => {
      await tx.stockLevel.update({
        where: {
          productId_warehouseId: {
            productId: reservation.productId,
            warehouseId: reservation.warehouseId,
          },
        },
        data: {
          totalUnits: {
            decrement: reservation.quantity,
          },
          reservedUnits: {
            decrement: reservation.quantity,
          },
        },
      });

      await tx.reservation.update({
        where: { id },
        data: {
          status: 'CONFIRMED',
        },
      });
    });

    return NextResponse.json({
      message: 'Reservation confirmed',
    });
  } catch (error) {
    console.error('Confirm error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}