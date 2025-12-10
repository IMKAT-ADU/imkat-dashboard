import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/models - List all models with optional exterior inclusion
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeExteriors = searchParams.get('includeExteriors') === 'true';

    const models = await prisma.model.findMany({
      include: includeExteriors
        ? {
            exteriors: {
              include: {
                options: {
                  include: {
                    costItems: true,
                  },
                },
              },
            },
          }
        : undefined,
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}

// POST /api/models - Create a new model
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Model name is required' }, { status: 400 });
    }

    const model = await prisma.model.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(model, { status: 201 });
  } catch (error: any) {
    console.error('Error creating model:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A model with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create model' }, { status: 500 });
  }
}
