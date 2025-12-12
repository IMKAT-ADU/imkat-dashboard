import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/exterior-cost-items?exteriorId=xxx - List all cost items for an exterior
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const exteriorId = searchParams.get('exteriorId');

    const where = exteriorId ? { exteriorId } : {};

    const exteriorCostItems = await prisma.exteriorCostItem.findMany({
      where,
      include: {
        exterior: {
          include: {
            model: true,
          },
        },
      },
      orderBy: {
        btName: 'asc',
      },
    });

    return NextResponse.json(exteriorCostItems);
  } catch (error) {
    console.error('Error fetching exterior cost items:', error);
    return NextResponse.json({ error: 'Failed to fetch exterior cost items' }, { status: 500 });
  }
}

// POST /api/exterior-cost-items - Create a new exterior cost item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { btName, costGroup, isDefault, exteriorId } = body;

    if (!btName || typeof btName !== 'string') {
      return NextResponse.json({ error: 'BT name is required' }, { status: 400 });
    }

    if (!exteriorId || typeof exteriorId !== 'string') {
      return NextResponse.json({ error: 'Exterior ID is required' }, { status: 400 });
    }

    const exteriorCostItem = await prisma.exteriorCostItem.create({
      data: {
        btName: btName.trim(),
        costGroup: costGroup || false,
        isDefault: isDefault || false,
        exteriorId,
      },
      include: {
        exterior: true,
      },
    });

    return NextResponse.json(exteriorCostItem, { status: 201 });
  } catch (error: any) {
    console.error('Error creating exterior cost item:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A cost item with this BT name already exists for this exterior' },
        { status: 409 }
      );
    }
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Exterior not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to create exterior cost item' }, { status: 500 });
  }
}
