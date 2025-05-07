'use client';

import { useEffect, useState } from 'react';
import BlockList from '@/features/blocks/components/BlockList';
import { useBlocks } from '@/features/blocks/hooks/useBlocks';
import { extractUniqueCategories } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function BlocksPage() {
  const router = useRouter();
  const { blocks, loading, error, refreshBlocks, deleteBlock } = useBlocks();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (blocks.length > 0) {
      setCategories(extractUniqueCategories(blocks));
    }
  }, [blocks]);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-sora font-bold text-gray-800'>
          Content Blocks
        </h1>
        <button
          onClick={() => router.push('/blocks/new')}
          className='flex items-center gap-2 px-4 py-2 bg-katalyx-primary text-white rounded-md hover:bg-primary-dark transition-colors'
        >
          <PlusIcon className='h-5 w-5' />
          <span>Add New Block</span>
        </button>
      </div>

      <p className='text-gray-600'>
        Manage your reusable content blocks for commercial proposals.
      </p>

      {error && (
        <div className='bg-red-50 text-red-600 p-4 rounded-md'>{error}</div>
      )}

      {loading && blocks.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-500'>Loading blocks...</p>
        </div>
      ) : (
        <BlockList
          blocks={blocks}
          onDelete={deleteBlock}
          categories={categories}
        />
      )}
    </div>
  );
}
