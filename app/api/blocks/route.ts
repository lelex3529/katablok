import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/blocks - Get all blocks
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters for filtering
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const category = searchParams.get('category');
    
    // Build filter conditions
    const where: {
      title?: { contains: string, mode: 'insensitive' };
      categories?: { has: string };
    } = {};
    
    if (title) {
      where.title = { contains: title, mode: 'insensitive' };
    }
    
    if (category) {
      where.categories = { has: category };
    }
    
    const blocks = await prisma.block.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });
    
    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocks' },
      { status: 500 }
    );
  }
}

// POST /api/blocks - Create a new block
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields - removed estimatedDuration and unitPrice from required fields
    const requiredFields = ['title', 'content'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Create new block
    const block = await prisma.block.create({
      data: {
        title: data.title,
        content: data.content,
        categories: Array.isArray(data.categories) ? data.categories : [],
        estimatedDuration: data.estimatedDuration !== undefined ? Number(data.estimatedDuration) : undefined,
        unitPrice: data.unitPrice !== undefined ? Number(data.unitPrice) : undefined,
        isPublic: data.isPublic ?? true,
      }
    });
    
    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error('Error creating block:', error);
    return NextResponse.json(
      { error: 'Failed to create block' },
      { status: 500 }
    );
  }
}