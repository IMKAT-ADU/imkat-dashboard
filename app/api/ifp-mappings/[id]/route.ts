import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

// PATCH update an IFP mapping
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { btName, costGroup, locationMarkups } = body;

    // Check if mapping exists
    const existingMapping = await prisma.iFPMapping.findUnique({
      where: { id },
    });

    if (!existingMapping) {
      return NextResponse.json(
        { error: 'Mapping not found' },
        { status: 404 }
      );
    }

    // Update mapping and handle location markups
    const mapping = await prisma.iFPMapping.update({
      where: { id },
      data: {
        ...(btName && { btName }),
        ...(costGroup !== undefined && { costGroup }),
        // Clear existing markups and create new ones if provided
        ...(locationMarkups && {
          locationMarkups: {
            deleteMany: {},
            create: locationMarkups,
          },
        }),
      },
      include: {
        locationMarkups: true,
      },
    });

    return NextResponse.json(mapping, { status: 200 });
  } catch (error) {
    console.error('Error updating IFP mapping:', error);
    return NextResponse.json(
      { error: 'Failed to update mapping' },
      { status: 500 }
    );
  }
}

// DELETE an IFP mapping
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if mapping exists
    const existingMapping = await prisma.iFPMapping.findUnique({
      where: { id },
    });

    if (!existingMapping) {
      return NextResponse.json(
        { error: 'Mapping not found' },
        { status: 404 }
      );
    }

    // Delete mapping (cascades to location markups)
    await prisma.iFPMapping.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting IFP mapping:', error);
    return NextResponse.json(
      { error: 'Failed to delete mapping' },
      { status: 500 }
    );
  }
}
