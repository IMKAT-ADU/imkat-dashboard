import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/cost-items?optionId=xxx - List all cost items for an option
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const optionId = searchParams.get('optionId');

    const where = optionId ? { optionId } : {};

    const costItems = await prisma.costItem.findMany({
      where,
      include: {
        option: {
          include: {
            exterior: {
              include: {
                model: true,
              },
            },
          },
        },
      },
      orderBy: {
        btName: 'asc',
      },
    });

    return NextResponse.json(costItems);
  } catch (error) {
    console.error('Error fetching cost items:', error);
    return NextResponse.json({ error: 'Failed to fetch cost items' }, { status: 500 });
  }
}

// POST /api/cost-items - Create a new cost item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { btName, costGroup, isDefault, optionId } = body;

    if (!btName || typeof btName !== 'string') {
      return NextResponse.json({ error: 'BT name is required' }, { status: 400 });
    }

    if (!optionId || typeof optionId !== 'string') {
      return NextResponse.json({ error: 'Option ID is required' }, { status: 400 });
    }

    const costItem = await prisma.costItem.create({
      data: {
        btName: btName.trim(),
        costGroup: costGroup || false,
        isDefault: isDefault || false,
        optionId,
      },
      include: {
        option: true,
      },
    });

    return NextResponse.json(costItem, { status: 201 });
  } catch (error: any) {
    console.error('Error creating cost item:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A cost item with this BT name already exists for this option' },
        { status: 409 }
      );
    }
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to create cost item' }, { status: 500 });
  }
}
