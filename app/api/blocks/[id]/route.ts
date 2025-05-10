import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to extract id from the URL
function getIdFromRequest(request: NextRequest): string | null {
  const url = request.nextUrl || new URL(request.url);
  const segments = url.pathname.split('/');
  const id = segments[segments.length - 1] || null;
  return id;
}

// GET /api/blocks/[id] - Get a specific block
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json(
        { error: 'Block ID is required' },
        { status: 400 },
      );
    }
    const block = await prisma.block.findUnique({
      where: { id },
    });

    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    return NextResponse.json(block);
  } catch (error) {
    console.error('Error fetching block:', error);
    return NextResponse.json(
      { error: 'Failed to fetch block' },
      { status: 500 },
    );
  }
}

// PUT /api/blocks/[id] - Update a specific block
export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json(
        { error: 'Block ID is required' },
        { status: 400 },
      );
    }
    const data = await request.json();
    // Check if block exists
    const existingBlock = await prisma.block.findUnique({
      where: { id },
    });

    if (!existingBlock) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }
    // Update block
    const block = await prisma.block.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(Array.isArray(data.categories) && { categories: data.categories }),
        ...(data.estimatedDuration !== undefined && {
          estimatedDuration: Number(data.estimatedDuration),
        }),
        ...(data.unitPrice !== undefined && {
          unitPrice: Number(data.unitPrice),
        }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      },
    });
    return NextResponse.json(block);
  } catch (error) {
    console.error('Error updating block:', error);
    return NextResponse.json(
      { error: 'Failed to update block' },
      { status: 500 },
    );
  }
}

// DELETE /api/blocks/[id] - Delete a specific block
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json(
        { error: 'Block ID is required' },
        { status: 400 },
      );
    }
    // Check if block exists
    const existingBlock = await prisma.block.findUnique({
      where: { id },
    });

    if (!existingBlock) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }
    // Delete block
    await prisma.block.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Block deleted successfully' });
  } catch (error) {
    console.error('Error deleting block:', error);
    return NextResponse.json(
      { error: 'Failed to delete block' },
      { status: 500 },
    );
  }
}
