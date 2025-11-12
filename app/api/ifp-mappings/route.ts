import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all IFP mappings
export async function GET() {
  try {
    const mappings = await prisma.iFPMapping.findMany({
      include: {
        locationMarkups: {
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        ifpKey: 'asc',
      },
    });

    return NextResponse.json(mappings, { status: 200 });
  } catch (error) {
    console.error('Error fetching IFP mappings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mappings' },
      { status: 500 }
    );
  }
}

// POST create new IFP mapping
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ifpKey, btName, costGroup, locationMarkups } = body;

    // Validate required fields
    if (!ifpKey || !btName) {
      return NextResponse.json(
        { error: 'ifpKey and btName are required' },
        { status: 400 }
      );
    }

    const mapping = await prisma.iFPMapping.create({
      data: {
        ifpKey,
        btName,
        costGroup: costGroup ?? false,
        locationMarkups: {
          create: locationMarkups || [],
        },
      },
      include: {
        locationMarkups: true,
      },
    });

    return NextResponse.json(mapping, { status: 201 });
  } catch (error) {
    console.error('Error creating IFP mapping:', error);
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      return NextResponse.json(
        { error: 'IFP key already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create mapping' },
      { status: 500 }
    );
  }
}
