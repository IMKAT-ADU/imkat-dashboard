import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/exteriors?modelId=xxx - List all exteriors for a model
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const modelId = searchParams.get('modelId');
    const includeOptions = searchParams.get('includeOptions') === 'true';

    const where = modelId ? { modelId } : {};

    const exteriors = await prisma.exterior.findMany({
      where,
      include: includeOptions
        ? {
            model: true,
            options: {
              include: {
                costItems: true,
              },
            },
          }
        : {
            model: true,
          },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(exteriors);
  } catch (error) {
    console.error('Error fetching exteriors:', error);
    return NextResponse.json({ error: 'Failed to fetch exteriors' }, { status: 500 });
  }
}

// POST /api/exteriors - Create a new exterior
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, modelId } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Exterior name is required' }, { status: 400 });
    }

    if (!modelId || typeof modelId !== 'string') {
      return NextResponse.json({ error: 'Model ID is required' }, { status: 400 });
    }

    const exterior = await prisma.exterior.create({
      data: {
        name: name.trim(),
        modelId,
      },
      include: {
        model: true,
      },
    });

    return NextResponse.json(exterior, { status: 201 });
  } catch (error: any) {
    console.error('Error creating exterior:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An exterior with this name already exists for this model' },
        { status: 409 }
      );
    }
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to create exterior' }, { status: 500 });
  }
}
