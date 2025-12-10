import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/exteriors/[id] - Get a specific exterior with all its data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const exterior = await prisma.exterior.findUnique({
      where: { id },
      include: {
        model: true,
        options: {
          include: {
            costItems: true,
          },
        },
      },
    });

    if (!exterior) {
      return NextResponse.json({ error: 'Exterior not found' }, { status: 404 });
    }

    return NextResponse.json(exterior);
  } catch (error) {
    console.error('Error fetching exterior:', error);
    return NextResponse.json({ error: 'Failed to fetch exterior' }, { status: 500 });
  }
}

// PATCH /api/exteriors/[id] - Update an exterior
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Exterior name is required' }, { status: 400 });
    }

    const exterior = await prisma.exterior.update({
      where: { id },
      data: {
        name: name.trim(),
      },
      include: {
        model: true,
      },
    });

    return NextResponse.json(exterior);
  } catch (error: any) {
    console.error('Error updating exterior:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An exterior with this name already exists for this model' },
        { status: 409 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Exterior not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update exterior' }, { status: 500 });
  }
}

// DELETE /api/exteriors/[id] - Delete an exterior and all its data
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.exterior.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting exterior:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Exterior not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete exterior' }, { status: 500 });
  }
}
