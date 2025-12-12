import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/exterior-cost-items/[id] - Get a specific exterior cost item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const exteriorCostItem = await prisma.exteriorCostItem.findUnique({
      where: { id },
      include: {
        exterior: {
          include: {
            model: true,
          },
        },
      },
    });

    if (!exteriorCostItem) {
      return NextResponse.json({ error: 'Exterior cost item not found' }, { status: 404 });
    }

    return NextResponse.json(exteriorCostItem);
  } catch (error) {
    console.error('Error fetching exterior cost item:', error);
    return NextResponse.json({ error: 'Failed to fetch exterior cost item' }, { status: 500 });
  }
}

// PATCH /api/exterior-cost-items/[id] - Update an exterior cost item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { btName, costGroup, isDefault } = body;

    const updateData: any = {};
    if (btName !== undefined) updateData.btName = btName.trim();
    if (costGroup !== undefined) updateData.costGroup = costGroup;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    const exteriorCostItem = await prisma.exteriorCostItem.update({
      where: { id },
      data: updateData,
      include: {
        exterior: true,
      },
    });

    return NextResponse.json(exteriorCostItem);
  } catch (error: any) {
    console.error('Error updating exterior cost item:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A cost item with this BT name already exists for this exterior' },
        { status: 409 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Exterior cost item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update exterior cost item' }, { status: 500 });
  }
}

// DELETE /api/exterior-cost-items/[id] - Delete an exterior cost item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.exteriorCostItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting exterior cost item:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Exterior cost item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete exterior cost item' }, { status: 500 });
  }
}
