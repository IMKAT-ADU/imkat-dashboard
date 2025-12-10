import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/options/[id] - Get a specific option with all its data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const option = await prisma.option.findUnique({
      where: { id },
      include: {
        exterior: {
          include: {
            model: true,
          },
        },
        costItems: true,
      },
    });

    if (!option) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }

    return NextResponse.json(option);
  } catch (error) {
    console.error('Error fetching option:', error);
    return NextResponse.json({ error: 'Failed to fetch option' }, { status: 500 });
  }
}

// PATCH /api/options/[id] - Update an option
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Option name is required' }, { status: 400 });
    }

    const option = await prisma.option.update({
      where: { id },
      data: {
        name: name.trim(),
      },
      include: {
        exterior: {
          include: {
            model: true,
          },
        },
      },
    });

    return NextResponse.json(option);
  } catch (error: any) {
    console.error('Error updating option:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An option with this name already exists for this exterior' },
        { status: 409 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update option' }, { status: 500 });
  }
}

// DELETE /api/options/[id] - Delete an option and all its data
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.option.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting option:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete option' }, { status: 500 });
  }
}
