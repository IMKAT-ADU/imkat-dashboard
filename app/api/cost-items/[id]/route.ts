import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/cost-items/[id] - Get a specific cost item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const costItem = await prisma.costItem.findUnique({
      where: { id },
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
    });

    if (!costItem) {
      return NextResponse.json({ error: 'Cost item not found' }, { status: 404 });
    }

    return NextResponse.json(costItem);
  } catch (error) {
    console.error('Error fetching cost item:', error);
    return NextResponse.json({ error: 'Failed to fetch cost item' }, { status: 500 });
  }
}

// PATCH /api/cost-items/[id] - Update a cost item
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

    const costItem = await prisma.costItem.update({
      where: { id },
      data: updateData,
      include: {
        option: true,
      },
    });

    return NextResponse.json(costItem);
  } catch (error: any) {
    console.error('Error updating cost item:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A cost item with this BT name already exists for this option' },
        { status: 409 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Cost item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update cost item' }, { status: 500 });
  }
}

// DELETE /api/cost-items/[id] - Delete a cost item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.costItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting cost item:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Cost item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete cost item' }, { status: 500 });
  }
}
