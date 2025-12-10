import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/options?exteriorId=xxx - List all options for an exterior
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const exteriorId = searchParams.get('exteriorId');
    const includeCostItems = searchParams.get('includeCostItems') === 'true';

    const where = exteriorId ? { exteriorId } : {};

    const options = await prisma.option.findMany({
      where,
      include: includeCostItems
        ? {
            exterior: {
              include: {
                model: true,
              },
            },
            costItems: true,
          }
        : {
            exterior: {
              include: {
                model: true,
              },
            },
          },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error('Error fetching options:', error);
    return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
  }
}

// POST /api/options - Create a new option
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, exteriorId } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Option name is required' }, { status: 400 });
    }

    if (!exteriorId || typeof exteriorId !== 'string') {
      return NextResponse.json({ error: 'Exterior ID is required' }, { status: 400 });
    }

    const option = await prisma.option.create({
      data: {
        name: name.trim(),
        exteriorId,
      },
      include: {
        exterior: {
          include: {
            model: true,
          },
        },
      },
    });

    return NextResponse.json(option, { status: 201 });
  } catch (error: any) {
    console.error('Error creating option:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An option with this name already exists for this exterior' },
        { status: 409 }
      );
    }
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Exterior not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to create option' }, { status: 500 });
  }
}
