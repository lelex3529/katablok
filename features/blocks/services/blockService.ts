import { Block } from '../types/Block';

import { prisma } from '@/lib/prisma';

/**
 * Fetches all blocks with optional filtering
 */
export async function getBlocks(
  title?: string,
  category?: string
): Promise<Block[]> {
  const params = new URLSearchParams();
  if (title) params.append('title', title);
  if (category) params.append('category', category);

  const queryString = params.toString();
  const url = `/api/blocks${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch blocks');
  }

  return response.json();
}

/**
 * Fetches a single block by ID
 */
export async function getBlock(id: string): Promise<Block> {
  const response = await fetch(`/api/blocks/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch block');
  }

  return response.json();
}

/**
 * Creates a new block
 */
export async function createBlock(blockData: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>): Promise<Block> {
  const response = await fetch('/api/blocks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blockData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create block');
  }

  return response.json();
}

/**
 * Updates an existing block
 */
export async function updateBlock(
  id: string,
  blockData: Partial<Omit<Block, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Block> {
  const response = await fetch(`/api/blocks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blockData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update block');
  }

  return response.json();
}

/**
 * Deletes a block
 */
export async function deleteBlock(id: string): Promise<void> {
  const response = await fetch(`/api/blocks/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete block');
  }
}

/**
 * Server-side function to get a block by ID
 */
export async function getServerBlock(id: string): Promise<Block | null> {
  try {
    const block = await prisma.block.findUnique({
      where: { id },
    });
    
    // Transform from Prisma model to Block type
    return block ? {
      ...block,
      estimatedDuration: block.estimatedDuration ?? undefined,
      unitPrice: block.unitPrice ?? undefined
    } : null;
  } catch (error) {
    console.error('Failed to fetch block:', error);
    return null;
  }
}

/**
 * Server-side function to get all blocks with optional filtering
 */
export async function getServerBlocks(
  title?: string,
  category?: string
): Promise<Block[]> {
  try {
    const where = {
      ...(title && { title: { contains: title, mode: 'insensitive' as const } }),
      ...(category && { category }),
    };

    const blocks = await prisma.block.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    // Transform from Prisma model to Block type
    return blocks.map(block => ({
      ...block,
      estimatedDuration: block.estimatedDuration ?? undefined,
      unitPrice: block.unitPrice ?? undefined
    }));
  } catch (error) {
    console.error('Failed to fetch blocks:', error);
    return [];
  }
}