'use client';

import { useState, useEffect, useCallback } from 'react';
import { Block } from '../types/Block';
import * as blockService from '../services/blockService';

export function useBlocks(initialTitle?: string, initialCategory?: string) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(initialTitle || '');
  const [category, setCategory] = useState(initialCategory || '');

  const fetchBlocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blockService.getBlocks(title || undefined, category || undefined);
      setBlocks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blocks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [title, category]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const deleteBlock = async (id: string) => {
    try {
      setLoading(true);
      await blockService.deleteBlock(id);
      setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete block');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    blocks,
    loading,
    error,
    title,
    setTitle,
    category,
    setCategory,
    refreshBlocks: fetchBlocks,
    deleteBlock,
  };
}

export function useBlock(id?: string) {
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(id !== undefined);
  const [error, setError] = useState<string | null>(null);

  const fetchBlock = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await blockService.getBlock(id);
      setBlock(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch block');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchBlock();
    }
  }, [id, fetchBlock]);

  const updateBlock = async (data: Partial<Omit<Block, 'id' | 'createdAt' | 'updatedAt'>>) => {
    if (!id || !block) return null;
    
    try {
      setLoading(true);
      setError(null);
      const updatedBlock = await blockService.updateBlock(id, data);
      setBlock(updatedBlock);
      return updatedBlock;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update block');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createBlock = async (data: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newBlock = await blockService.createBlock(data);
      setBlock(newBlock);
      return newBlock;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create block');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    block,
    loading,
    error,
    refreshBlock: fetchBlock,
    updateBlock,
    createBlock,
  };
}