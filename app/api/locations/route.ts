import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all locations
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

// POST create new location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, markup } = body;

    // Validate required fields
    if (!name || markup === undefined) {
      return NextResponse.json(
        { error: 'name and markup are required' },
        { status: 400 }
      );
    }

    const location = await prisma.location.create({
      data: {
        name,
        markup,
      },
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error('Error creating location:', error);
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      return NextResponse.json(
        { error: 'Location name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}
